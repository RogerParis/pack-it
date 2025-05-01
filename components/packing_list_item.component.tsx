import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { COLORS } from '../theme/colors';
import { PackingItem } from '../types/packing';

type Props = {
  item: PackingItem;
  onSwipeLeft?: () => void;
  onPress?: () => void;
};

export default function PackingListItem({ item, onSwipeLeft, onPress }: Props) {
  const renderRightActions = () => (
    <View style={styles.swipeRight}>
      <Text style={styles.swipeText}>→ To Pack</Text>
    </View>
  );

  return (
    <Swipeable
      renderRightActions={onSwipeLeft ? renderRightActions : undefined}
      onSwipeableOpen={(direction) => {
        if (direction === 'left') {
          onSwipeLeft?.();
        }
      }}>
      <Pressable onPress={onPress}>
        <View style={styles.item}>
          <Text style={[styles.itemText, item.packed && styles.packedText]}>{item.name}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
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
  swipeRight: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    flex: 1,
    borderRadius: 8,
  },
  swipeText: { fontWeight: 'bold', color: COLORS.white },
});
