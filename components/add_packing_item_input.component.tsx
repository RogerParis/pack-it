import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { COLORS } from '@/theme/colors';

type Props = {
  onAdd: (name: string) => void;
  placeholder?: string;
  accentColor?: string;
};

export default function AddPackingItemInput({
  onAdd,
  placeholder = 'Add an item…',
  accentColor = COLORS.ink,
}: Props) {
  const [value, setValue] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleAdd = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onAdd(trimmed);
    setValue('');

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [onAdd, value]);

  return (
    <View style={styles.row}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mute}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: accentColor }]}
        onPress={handleAdd}
        activeOpacity={0.75}>
        <Feather name="plus" size={16} color="#fff" />
        <Text style={styles.addLabel}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 14,
    fontSize: 14,
    color: COLORS.ink,
  },
  addBtn: {
    height: 44,
    paddingHorizontal: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13.5,
  },
});
