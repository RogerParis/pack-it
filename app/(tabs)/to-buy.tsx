import React, { useCallback } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import AddPackingItemInput from '@/components/add_packing_item_input.component';
import PackingListItem from '@/components/packing_list_item.component';

import { usePackingStore } from '@/store/packingStore';
import { PackingItem } from '@/types/packing';
import { v4 as uuid } from 'uuid';

export default function ToBuyScreen() {
  const { addItem, removeItem, copyItem } = usePackingStore();

  const toBuy = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toBuy : [];
  });
  const toPack = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].toPack : [];
  });

  const handleAdd = useCallback(
    (name: string) => {
      const lowerName = name.trim().toLowerCase();
      const inToBuy = toBuy.some((item) => item.name.trim().toLowerCase() === lowerName);
      const inToPack = toPack.some((item) => item.name.trim().toLowerCase() === lowerName);

      if (inToBuy) {
        Alert.alert('Duplicate Item', 'This item is already in your "To Buy" list.');
        return;
      }
      if (inToPack) {
        Alert.alert(
          'Item Exists in To Pack',
          'This item is already in your "To Pack" list. Move it to "To Buy"?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Move',
              onPress: () => {
                // Find the item in toPack
                const itemToMove = toPack.find(
                  (item) => item.name.trim().toLowerCase() === lowerName,
                );
                if (itemToMove) {
                  removeItem('toPack', itemToMove.id);
                  addItem('toBuy', { ...itemToMove, packed: false });
                }
              },
            },
          ],
        );
        return;
      }
      const newItem: PackingItem = {
        id: uuid(),
        name,
        packed: false,
      };
      addItem('toBuy', newItem);
    },
    [addItem, removeItem, toBuy, toPack],
  );

  const renderItem = ({ item }: { item: PackingItem }) => (
    <PackingListItem
      item={item}
      onDelete={() => removeItem('toBuy', item.id)}
      onMoveToPack={() => copyItem('toBuy', 'toPack', item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <AddPackingItemInput onAdd={handleAdd} />
      <FlatList
        data={toBuy}
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
});
