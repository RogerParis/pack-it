import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { categoryAccent, categoryGlyphBg, categoryLabel } from '@/utils/categories';

import { COLORS } from '@/theme/colors';

type Props = {
  displayCategories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  showCustomInput: boolean;
  customInput: string;
  customInputRef?: React.RefObject<TextInput | null>;
  onCustomInputChange: (text: string) => void;
  onConfirmCustom: () => void;
  onOpenCustom: () => void;
  onCancelCustom: () => void;
};

export default function CategoryPicker({
  displayCategories,
  selectedCategory,
  onSelectCategory,
  showCustomInput,
  customInput,
  customInputRef,
  onCustomInputChange,
  onConfirmCustom,
  onOpenCustom,
  onCancelCustom,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      {displayCategories.map((cat) => {
        const active = selectedCategory === cat;
        const accent = categoryAccent(cat);
        const glyphBg = categoryGlyphBg(cat);
        return (
          <TouchableOpacity
            key={cat}
            style={[styles.pill, { backgroundColor: active ? accent : glyphBg }]}
            onPress={() => {
              onSelectCategory(cat);
            }}
            activeOpacity={0.7}>
            <Text style={[styles.pillText, { color: active ? '#fff' : accent }]}>
              {categoryLabel(cat)}
            </Text>
          </TouchableOpacity>
        );
      })}

      {showCustomInput ? (
        <View style={styles.customInputRow}>
          <TextInput
            ref={customInputRef}
            value={customInput}
            onChangeText={onCustomInputChange}
            placeholder="Category name…"
            placeholderTextColor={COLORS.mute}
            style={styles.customInput}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={onConfirmCustom}
          />
          <TouchableOpacity onPress={onConfirmCustom} activeOpacity={0.7}>
            <Feather name="check" size={16} color={COLORS.teal} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onCancelCustom} activeOpacity={0.7}>
            <Feather name="x" size={16} color={COLORS.mute} />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.addPill} onPress={onOpenCustom} activeOpacity={0.7}>
          <Feather name="plus" size={13} color={COLORS.ink3} />
          <Text style={styles.addPillText}>New</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingBottom: 2,
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  addPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.line,
  },
  addPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.ink3,
  },
  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.sand,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  customInput: {
    fontSize: 12.5,
    color: COLORS.ink,
    minWidth: 100,
    paddingVertical: 0,
  },
});
