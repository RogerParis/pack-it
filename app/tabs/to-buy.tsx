import React from 'react';
import { useState } from 'react';
import { Button, FlatList, StyleSheet, TextInput, View } from 'react-native';

import PackingListItem from '@/components/packing_list_item.component';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { COLORS } from '@/theme/colors';
import { v4 as uuid } from 'uuid';

export default function ToBuyScreen() {
  const [itemName, setItemName] = useState('');
  const { toBuy, addItem, removeItem, moveItem } = usePackingStore();

  const handleAdd = () => {
    if (!itemName.trim()) return;
    const newItem: PackingItem = {
      id: uuid(),
      name: itemName.trim(),
      packed: false,
    };
    addItem('toBuy', newItem);
    setItemName('');
  };

  const renderItem = ({ item }: { item: PackingItem }) => (
    <PackingListItem
      item={item}
      onDelete={() => removeItem('toBuy', item.id)}
      onMoveToPack={() => moveItem('toBuy', 'toPack', item.id)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          value={itemName}
          onChangeText={setItemName}
          placeholder="Add item..."
          style={styles.input}
        />
        <Button title="Add" onPress={handleAdd} />
      </View>
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
  inputRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 8,
    borderRadius: 6,
  },
  list: { gap: 12 },
});
