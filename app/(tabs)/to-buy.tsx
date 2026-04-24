import React, { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
import PackingListItem from '@/components/packing_list_item.component';
import ScreenHeader from '@/components/screen_header.component';

import { showDuplicateItemAlert, showMoveItemAlert } from '@/services/alerts.service';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';
import { v4 as uuid } from 'uuid';

export default function ToBuyScreen() {
  const { addItem, removeItem, moveItem } = usePackingStore();

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
        category: '',
      };
      addItem('toBuy', newItem);
    },
    [addItem, removeItem, toBuy, toPack],
  );

  const renderItem = useCallback(
    ({ item }: { item: PackingItem }) => (
      <PackingListItem
        item={item}
        onDelete={() => removeItem('toBuy', item.id)}
        onMoveToPack={() => moveItem('toBuy', 'toPack', item.id)}
      />
    ),
    [removeItem, moveItem],
  );

  return (
    <View style={styles.screen}>
      <ScreenHeader />

      <FlatList
        data={toBuy}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            {/* Coral hero */}
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

            {/* Add input */}
            <AddPackingItemInput
              onAdd={handleAdd}
              placeholder="Add something to buy…"
              accentColor={COLORS.coral}
            />
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.paper,
  },
  listHeader: {
    gap: 12,
    marginBottom: 4,
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
  list: {
    gap: 10,
    padding: 20,
    paddingTop: 0,
  },
});
