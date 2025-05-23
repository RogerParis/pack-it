import React, { useCallback, useRef, useState } from 'react';
import { Button, StyleSheet, TextInput, View } from 'react-native';

import { COLORS } from '@/theme/colors';

type Props = {
  onAdd: (name: string) => void;
  placeholder?: string;
};

export default function AddPackingItemInput({ onAdd, placeholder = 'Add item...' }: Props) {
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
    <View style={styles.inputRow}>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={styles.input}
        returnKeyType="done"
        onSubmitEditing={handleAdd}
      />
      <Button title="Add" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 8,
    borderRadius: 6,
  },
});
