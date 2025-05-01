import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { COLORS } from '@/theme/colors';

export default function ToPackScreen() {
  const { toPack, togglePacked } = usePackingStore();

  const renderItem = ({ item }: { item: PackingItem }) => (
    <Pressable onPress={() => togglePacked(item.id)}>
      <View style={styles.item}>
        <Text style={[styles.itemText, item.packed && styles.packedText]}>{item.name}</Text>
      </View>
    </Pressable>
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
    color: COLORS.text,
  },
});
