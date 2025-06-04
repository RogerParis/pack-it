import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
import PackingListItem from '@/components/packing_list_item.component';

import { showDuplicateItemAlert, showMoveItemAlert } from '@/services/alerts.service';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';
import { v4 as uuid } from 'uuid';

export default function ToPackScreen() {
  const { togglePacked, removeItem, copyItem, addItem } = usePackingStore();

  const toPack = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toPack : [];
  });
  const toBuy = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toBuy : [];
  });

  const totalItems = toPack.length;
  const packedItems = toPack.filter((item) => item.packed).length;
  const progress = totalItems === 0 ? 0 : packedItems / totalItems;

  const sortedToPack = useMemo(() => {
    return [...toPack].sort((a, b) => {
      if (a.packed === b.packed) return 0;
      return a.packed ? 1 : -1; // unpacked first
    });
  }, [toPack]);

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
      };
      addItem('toPack', newItem);
    },
    [addItem, removeItem, toPack, toBuy],
  );

  const renderItem = useCallback(
    ({ item }: { item: PackingItem }) => (
      <PackingListItem
        item={item}
        onPress={() => togglePacked(item.id)}
        onDelete={() => removeItem('toPack', item.id)}
        onMoveToBuy={() => copyItem('toPack', 'toBuy', item.id)}
      />
    ),
    [togglePacked, removeItem, copyItem],
  );

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>
          🎒 Packed {packedItems} / {totalItems} items
        </Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <AddPackingItemInput onAdd={handleAdd} />

      <FlatList
        data={sortedToPack}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  list: { gap: 12 },
  progressContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
    color: COLORS.text,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: COLORS.neutral300,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
});
