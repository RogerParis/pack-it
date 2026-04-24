import { useCallback, useMemo, useRef, useState } from 'react';
import { TextInput } from 'react-native';

import { SUGGESTED_CATEGORIES } from '@/utils/categories';

import { PackingItem } from '@/types/packing';

export function useCategoryPicker(items: PackingItem[], defaultCategory = 'extras') {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const customInputRef = useRef<TextInput>(null);

  const displayCategories = useMemo(() => {
    const existing = Array.from(new Set(items.map((i) => i.category).filter(Boolean)));
    const suggested = (SUGGESTED_CATEGORIES as readonly string[]).filter(
      (c) => !existing.includes(c),
    );
    return [...existing, ...suggested];
  }, [items]);

  const confirmCustomCategory = useCallback(() => {
    const trimmed = customInput.trim().toLowerCase();
    if (trimmed) setSelectedCategory(trimmed);
    setCustomInput('');
    setShowCustomInput(false);
  }, [customInput]);

  const effectiveCategory =
    showCustomInput && customInput.trim() ? customInput.trim().toLowerCase() : selectedCategory;

  const afterItemAdded = useCallback(() => {
    if (showCustomInput && customInput.trim()) {
      setSelectedCategory(customInput.trim().toLowerCase());
    }
    setShowCustomInput(false);
    setCustomInput('');
  }, [showCustomInput, customInput]);

  return {
    selectedCategory,
    setSelectedCategory,
    showCustomInput,
    setShowCustomInput,
    customInput,
    setCustomInput,
    customInputRef,
    displayCategories,
    confirmCustomCategory,
    effectiveCategory,
    afterItemAdded,
  };
}
