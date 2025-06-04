import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Feather } from '@expo/vector-icons';

import { COLORS } from '../theme/colors';

import { showDeleteItemAlert } from '@/services/alerts.service';
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
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.secondary }]}
          onPress={onMoveToPack}
          activeOpacity={0.5}>
          <Feather name="briefcase" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
      {onMoveToBuy && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.primary }]}
          onPress={onMoveToBuy}
          activeOpacity={0.5}>
          <Feather name="shopping-cart" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.error }]}
          onPress={() => showDeleteItemAlert(onDelete)}
          activeOpacity={0.5}>
          <Feather name="trash-2" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.5}>
        <View style={styles.item}>
          <Text style={[styles.itemText, item.packed && styles.packedText]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
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
  itemText: {
    fontSize: 18,
    color: COLORS.text,
  },
  packedText: {
    textDecorationLine: 'line-through',
    color: COLORS.neutral500,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  actionButton: {
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
});
