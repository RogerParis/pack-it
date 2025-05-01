import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { usePackingStore } from '../../store/packingStore';
import { PackingItem } from '../../types/packing';

import { COLORS } from '@/theme/colors';
import { v4 as uuid } from 'uuid';

export default function ToBuyScreen() {
  const [itemName, setItemName] = useState('');
  const { toBuy, addItem } = usePackingStore();

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

  const renderItem = ({ item }: { item: PackingItem }) => {
    const renderRightActions = () => (
      <View style={styles.swipeRight}>
        <Text style={styles.swipeText}>→ To Pack</Text>
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </Swipeable>
    );
  };

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
  inputRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 8,
    borderRadius: 6,
  },
  list: { gap: 12 },
  item: {
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  itemText: { fontSize: 16 },
  swipeRight: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    flex: 1,
    borderRadius: 8,
  },
  swipeText: { fontWeight: 'bold', color: COLORS.secondary },
});
