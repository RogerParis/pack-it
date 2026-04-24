import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
import BigSuitcase from '@/components/big_suitcase.component';
import CategoryCard from '@/components/category_card.component';
import CategoryPicker from '@/components/category_picker.component';
import ScreenHeader from '@/components/screen_header.component';
import { categoryLabel, groupByCategory, orderCategories } from '@/utils/categories';
import { useCategoryPicker } from '@/utils/use_category_picker';

import {
  showDeleteCategoryAlert,
  showDuplicateItemAlert,
  showMoveItemAlert,
} from '@/services/alerts.service';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';
import { v4 as uuid } from 'uuid';

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

  const grouped = useMemo(() => groupByCategory(toPack), [toPack]);
  const orderedCategories = useMemo(() => orderCategories(grouped), [grouped]);

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

  const handleDeleteCategory = useCallback(
    (category: string) => {
      showDeleteCategoryAlert(categoryLabel(category), () => clearCategory('toPack', category));
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

        <AddPackingItemInput onAdd={handleAdd} />

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

        {orderedCategories.map((cat) => (
          <CategoryCard
            key={cat}
            category={cat}
            items={grouped[cat] ?? []}
            moveTarget="toBuy"
            onToggle={(id) => togglePacked('toPack', id)}
            onMoveItem={(id) => moveItem('toPack', 'toBuy', id)}
            onDelete={(id) => removeItem('toPack', id)}
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mute,
  },
});
