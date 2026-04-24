import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

import { Feather } from '@expo/vector-icons';

import { showDeleteItemAlert } from '@/services/alerts.service';
import { COLORS } from '@/theme/colors';
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
          style={[styles.actionButton, { backgroundColor: COLORS.teal }]}
          onPress={onMoveToPack}
          activeOpacity={0.75}>
          <Feather name="briefcase" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {onMoveToBuy && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.coral }]}
          onPress={onMoveToBuy}
          activeOpacity={0.75}>
          <Feather name="shopping-cart" size={20} color="#fff" />
        </TouchableOpacity>
      )}
      {onDelete && (
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: COLORS.ink }]}
          onPress={() => showDeleteItemAlert(onDelete)}
          activeOpacity={0.75}>
          <Feather name="trash-2" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={[styles.item, item.packed && styles.itemPacked]}>
          <View style={[styles.checkbox, item.packed && styles.checkboxPacked]}>
            {item.packed && <Feather name="check" size={12} color="#fff" />}
          </View>
          <Text style={[styles.itemText, item.packed && styles.packedText]}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default React.memo(PackingListItem);

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 13,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  itemPacked: {
    backgroundColor: COLORS.paper,
    borderStyle: 'dashed',
    borderColor: COLORS.lineSoft,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: COLORS.mute,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxPacked: {
    backgroundColor: COLORS.teal,
    borderColor: COLORS.teal,
  },
  itemText: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    color: COLORS.ink,
  },
  packedText: {
    textDecorationLine: 'line-through',
    color: COLORS.mute,
    fontWeight: '400',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
    height: '100%',
  },
  actionButton: {
    width: 48,
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
