import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
import BigSuitcase from '@/components/big_suitcase.component';
import CategoryPicker from '@/components/category_picker.component';
import ScreenHeader from '@/components/screen_header.component';
import {
  categoryAccent,
  categoryGlyphBg,
  categoryLabel,
  SUGGESTED_CATEGORIES,
} from '@/utils/categories';
import { useCategoryPicker } from '@/utils/use_category_picker';

import {
  showDeleteCategoryAlert,
  showDuplicateItemAlert,
  showMoveItemAlert,
} from '@/services/alerts.service';
import { usePackingStore } from '@/store/packingStore';
import { CAT_TINT, COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';
import { v4 as uuid } from 'uuid';

function CategoryCard({
  category,
  items,
  onToggle,
  onMoveToBuy,
  onDelete,
  onDeleteCategory,
}: {
  category: string;
  items: PackingItem[];
  onToggle: (id: string) => void;
  onMoveToBuy: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteCategory: () => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const tintBg = (CAT_TINT as Record<string, { bg: string }>)[category]?.bg ?? COLORS.sand;
  const accent = categoryAccent(category);
  const glyphBg = categoryGlyphBg(category);
  const packed = items.filter((i) => i.packed).length;
  const total = items.length;
  const pct = total === 0 ? 0 : packed / total;
  const complete = total > 0 && pct === 1;

  return (
    <View style={[styles.card, { backgroundColor: tintBg }]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}>
        <View style={[styles.glyphBox, { backgroundColor: complete ? COLORS.leafSoft : glyphBg }]}>
          <Feather name="package" size={16} color={complete ? COLORS.leaf : accent} />
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{categoryLabel(category)}</Text>
            {complete && (
              <View style={styles.doneBadge}>
                <Text style={styles.doneBadgeText}>DONE</Text>
              </View>
            )}
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pct * 100}%` as `${number}%`,
                    backgroundColor: complete ? COLORS.leaf : accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressCount}>
              {packed}/{total}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onDeleteCategory}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
          <Feather name="trash-2" size={14} color={COLORS.mute} />
        </TouchableOpacity>
        <Feather name={expanded ? 'chevron-down' : 'chevron-right'} size={14} color={COLORS.mute} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity
                style={[styles.checkbox, item.packed && styles.checkboxPacked]}
                onPress={() => onToggle(item.id)}
                activeOpacity={0.7}>
                {item.packed && <Feather name="check" size={11} color="#fff" />}
              </TouchableOpacity>
              <Text style={[styles.itemName, item.packed && styles.itemNamePacked]}>
                {item.name}
              </Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: COLORS.coralSoft }]}
                  onPress={() => onMoveToBuy(item.id)}
                  activeOpacity={0.7}>
                  <Feather name="shopping-cart" size={12} color={COLORS.coral} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: COLORS.sandDeep }]}
                  onPress={() => onDelete(item.id)}
                  activeOpacity={0.7}>
                  <Feather name="trash-2" size={12} color={COLORS.ink3} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export default function ToPackScreen() {
  const { togglePacked, removeItem, moveItem, addItem, clearCategory } = usePackingStore();

  const toPack = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toPack : [];
  });
  const toBuy = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toBuy : [];
  });

  const {
    selectedCategory,
    setSelectedCategory,
    showCustomInput,
    setShowCustomInput,
    customInput,
    setCustomInput,
    customInputRef,
    displayCategories,
    confirmCustomCategory,
    effectiveCategory,
    afterItemAdded,
  } = useCategoryPicker(toPack);

  const totalItems = toPack.length;
  const packedItems = toPack.filter((item) => item.packed).length;
  const fillRatio = totalItems === 0 ? 0 : packedItems / totalItems;
  const remaining = totalItems - packedItems;

  const grouped = useMemo(() => {
    const map: Record<string, PackingItem[]> = {};
    for (const item of toPack) {
      const cat = item.category ?? 'extras';
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    }
    return map;
  }, [toPack]);

  const orderedCategories = useMemo(() => {
    const present = new Set(Object.keys(grouped));
    const ordered: string[] = (SUGGESTED_CATEGORIES as readonly string[]).filter((c) =>
      present.has(c),
    );
    for (const c of present) {
      if (!(SUGGESTED_CATEGORIES as readonly string[]).includes(c)) ordered.push(c);
    }
    return ordered;
  }, [grouped]);

  const handleAdd = useCallback(
    (name: string) => {
      const lowerName = name.trim().toLowerCase();
      const inToPack = toPack.some((item) => item.name.trim().toLowerCase() === lowerName);
      const inToBuy = toBuy.some((item) => item.name.trim().toLowerCase() === lowerName);

      if (inToPack) {
        showDuplicateItemAlert('To Pack');
        return;
      }
      if (inToBuy) {
        showMoveItemAlert('To Buy', 'To Pack', () => {
          const itemToMove = toBuy.find((item) => item.name.trim().toLowerCase() === lowerName);
          if (itemToMove) {
            removeItem('toBuy', itemToMove.id);
            addItem('toPack', { ...itemToMove, packed: false });
          }
        });
        return;
      }
      const newItem: PackingItem = {
        id: uuid(),
        name,
        packed: false,
        category: effectiveCategory,
      };
      addItem('toPack', newItem);
      afterItemAdded();
    },
    [addItem, removeItem, toPack, toBuy, effectiveCategory, afterItemAdded],
  );

  const handleMoveToBuy = useCallback(
    (id: string) => {
      moveItem('toPack', 'toBuy', id);
    },
    [moveItem],
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeItem('toPack', id);
    },
    [removeItem],
  );

  const handleDeleteCategory = useCallback(
    (category: string) => {
      showDeleteCategoryAlert(categoryLabel(category), () => clearCategory(category));
    },
    [clearCategory],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <BigSuitcase fill={fillRatio} size={80} />
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>PACKING</Text>
            <View style={styles.heroCountRow}>
              <Text style={styles.heroCount}>{packedItems}</Text>
              <Text style={styles.heroTotal}>/ {totalItems}</Text>
            </View>
            <Text style={styles.heroSub}>
              {remaining === 0
                ? totalItems === 0
                  ? 'Nothing added yet'
                  : 'All packed!'
                : `${remaining} item${remaining !== 1 ? 's' : ''} left`}
            </Text>
          </View>
        </View>

        {/* Add input */}
        <View style={styles.inputWrapper}>
          <AddPackingItemInput onAdd={handleAdd} />
        </View>

        {/* Category picker */}
        <CategoryPicker
          displayCategories={displayCategories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setShowCustomInput(false);
          }}
          showCustomInput={showCustomInput}
          customInput={customInput}
          customInputRef={customInputRef}
          onCustomInputChange={setCustomInput}
          onConfirmCustom={confirmCustomCategory}
          onOpenCustom={() => setShowCustomInput(true)}
          onCancelCustom={() => {
            setShowCustomInput(false);
            setCustomInput('');
          }}
        />

        {/* Category groups */}
        {orderedCategories.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            items={grouped[cat] ?? []}
            onToggle={(id) => togglePacked('toPack', id)}
            onMoveToBuy={handleMoveToBuy}
            onDelete={handleDelete}
            onDeleteCategory={() => handleDeleteCategory(cat)}
          />
        ))}

        {totalItems === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Add your first item above</Text>
          </View>
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },

  // Hero
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: COLORS.tealPale,
    borderWidth: 1,
    borderColor: COLORS.lineSoft,
  },
  heroText: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 10,
    color: COLORS.teal,
    letterSpacing: 1.3,
    fontWeight: '600',
  },
  heroCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginTop: 2,
  },
  heroCount: {
    fontSize: 38,
    color: COLORS.ink,
    lineHeight: 40,
    fontWeight: '300',
    letterSpacing: -1,
  },
  heroTotal: {
    fontSize: 20,
    color: COLORS.ink3,
    fontWeight: '400',
  },
  heroSub: {
    fontSize: 12.5,
    color: COLORS.ink3,
    marginTop: 4,
  },

  // Input
  inputWrapper: {},

  // Category card
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  },
  glyphBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: -0.1,
  },
  doneBadge: {
    backgroundColor: COLORS.leafSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  doneBadgeText: {
    fontSize: 9,
    color: COLORS.leaf,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  progressBg: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(18,40,58,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCount: {
    fontSize: 11,
    color: COLORS.ink3,
    fontWeight: '500',
  },

  // Card body
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(18,40,58,0.06)',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORS.mute,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxPacked: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  itemName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: COLORS.ink,
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: COLORS.mute,
    fontWeight: '400',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mute,
  },
});
