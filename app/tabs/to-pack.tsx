import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';

import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';

export default function ToPackScreen() {
  const { toPack, togglePacked } = usePackingStore();

  const renderItem = ({ item }: { item: PackingItem }) => (
    <PackingListItem item={item} onPress={() => togglePacked(item.id)} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={toPack}
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
  item: {
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  itemText: { fontSize: 16 },
  packedText: {
    textDecorationLine: 'line-through',
    color: COLORS.neutral500,
  },
});
