import React, { useCallback, useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
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

export default function ToBuyScreen() {
  const { addItem, removeItem, moveItem, togglePacked, clearCategory } = usePackingStore();

  const toBuy = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toBuy : [];
  });
  const toPack = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toPack : [];
  });

  const bought = toBuy.filter((i) => i.packed).length;
  const total = toBuy.length;

  const grouped = useMemo(() => groupByCategory(toBuy), [toBuy]);
  const orderedCategories = useMemo(() => orderCategories(grouped), [grouped]);

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
  } = useCategoryPicker(toBuy);

  const handleAdd = useCallback(
    (name: string) => {
      const lowerName = name.trim().toLowerCase();
      const inToBuy = toBuy.some((item) => item.name.trim().toLowerCase() === lowerName);
      const inToPack = toPack.some((item) => item.name.trim().toLowerCase() === lowerName);

      if (inToBuy) {
        showDuplicateItemAlert('To Buy');
        return;
      }
      if (inToPack) {
        showMoveItemAlert('To Pack', 'To Buy', () => {
          const itemToMove = toPack.find((item) => item.name.trim().toLowerCase() === lowerName);
          if (itemToMove) {
            removeItem('toPack', itemToMove.id);
            addItem('toBuy', { ...itemToMove, packed: false });
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
      addItem('toBuy', newItem);
      afterItemAdded();
    },
    [addItem, removeItem, toBuy, toPack, effectiveCategory, afterItemAdded],
  );

  const handleDeleteCategory = useCallback(
    (category: string) => {
      showDeleteCategoryAlert(categoryLabel(category), () => clearCategory('toBuy', category));
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
          <View style={styles.heroIcon}>
            <Feather name="shopping-cart" size={22} color={COLORS.coral} />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroLabel}>SHOPPING LIST</Text>
            <Text style={styles.heroTitle}>
              {total - bought} thing{total - bought !== 1 ? 's' : ''} to buy
            </Text>
          </View>
          <View style={styles.heroCounts}>
            <Text style={styles.heroBought}>{bought}</Text>
            <Text style={styles.heroTotal}>/{total}</Text>
          </View>
        </View>

        <AddPackingItemInput
          onAdd={handleAdd}
          placeholder="Add something to buy…"
          accentColor={COLORS.coral}
        />

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
            moveTarget="toPack"
            onToggle={(id) => togglePacked('toBuy', id)}
            onMoveItem={(id) => moveItem('toBuy', 'toPack', id)}
            onDelete={(id) => removeItem('toBuy', id)}
            onDeleteCategory={() => handleDeleteCategory(cat)}
          />
        ))}

        {total === 0 && (
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
    gap: 12,
    padding: 16,
    paddingHorizontal: 18,
    borderRadius: 22,
    backgroundColor: COLORS.coralSoft,
    borderWidth: 1,
    borderColor: 'rgba(226,122,92,0.2)',
  },
  heroIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  heroText: {
    flex: 1,
  },
  heroLabel: {
    fontSize: 10,
    color: COLORS.coral,
    letterSpacing: 1.3,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: -0.2,
    marginTop: 2,
  },
  heroCounts: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroBought: {
    fontSize: 30,
    color: COLORS.ink,
    fontWeight: '300',
    letterSpacing: -0.5,
  },
  heroTotal: {
    fontSize: 18,
    color: COLORS.ink3,
    fontWeight: '400',
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
