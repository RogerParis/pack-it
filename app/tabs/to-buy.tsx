import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";
import { usePackingStore } from "../../store/packingStore";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { PackingItem } from "../../types/packing";
import { v4 as uuid } from "uuid";

export default function ToBuyScreen() {
  const [itemName, setItemName] = useState("");
  const { toBuy, addItem, moveToPack } = usePackingStore();

  const handleAdd = () => {
    if (!itemName.trim()) return;
    const newItem: PackingItem = {
      id: uuid(),
      name: itemName.trim(),
      packed: false,
    };
    addItem("toBuy", newItem);
    setItemName("");
  };

  const renderItem = ({ item }: { item: PackingItem }) => {
    const renderRightActions = () => (
      <View style={styles.swipeRight}>
        <Text style={styles.swipeText}>→ To Pack</Text>
      </View>
    );

    return (
      <Swipeable
        renderRightActions={renderRightActions}
      >
        <View style={styles.item}>
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🛒 To Buy</Text>
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
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  inputRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
  },
  list: { gap: 12 },
  item: {
    padding: 14,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  itemText: { fontSize: 16 },
  swipeRight: {
    backgroundColor: "#d4fcd4",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    flex: 1,
    borderRadius: 8,
  },
  swipeText: { fontWeight: "bold", color: "#008000" },
});
