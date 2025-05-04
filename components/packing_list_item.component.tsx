import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '../theme/colors';

import { PackingItem } from '@/types/packing';

type Props = {
  item: PackingItem;
  onDelete?: () => void;
  onMoveToPack?: () => void;
  onMoveToBuy?: () => void;
  onPress?: () => void;
};

const PackingListItem = ({ item, onDelete, onMoveToPack, onMoveToBuy, onPress }: Props) => {
  const renderRightActions = () => (
    <View style={styles.actionsContainer}>
      {onMoveToPack && (
        <Pressable
          style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
          onPress={onMoveToPack}>
          <Ionicons name="briefcase-outline" size={24} color={COLORS.white} />
        </Pressable>
      )}
      {onMoveToBuy && (
        <Pressable
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={onMoveToBuy}>
          <Ionicons name="cart-outline" size={24} color={COLORS.white} />
        </Pressable>
      )}
      {onDelete && (
        <Pressable
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => {
            Alert.alert(
              'Delete Item',
              'Are you sure you want to delete this item?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: onDelete },
              ],
              { cancelable: true },
            );
          }}>
          <Ionicons name="trash-bin" size={24} color={COLORS.white} />
        </Pressable>
      )}
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable onPress={onPress}>
        <View style={styles.item}>
          <Text style={[styles.itemText, item.packed && styles.packedText]}>{item.name}</Text>
        </View>
      </Pressable>
    </Swipeable>
  );
};

export default React.memo(PackingListItem);

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
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    marginLeft: 8,
  },
});
