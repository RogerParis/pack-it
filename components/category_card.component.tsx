import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { categoryAccent, categoryGlyphBg, categoryLabel } from '@/utils/categories';

import { CAT_TINT, COLORS } from '@/theme/colors';
import { PackingItem } from '@/types/packing';

type Props = {
  category: string;
  items: PackingItem[];
  moveTarget: 'toBuy' | 'toPack';
  onToggle: (id: string) => void;
  onMoveItem: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteCategory: () => void;
};

const MOVE_CONFIG = {
  toBuy: { icon: 'shopping-cart' as const, color: COLORS.coral, bgColor: COLORS.coralSoft },
  toPack: { icon: 'briefcase' as const, color: COLORS.teal, bgColor: COLORS.tealPale },
};

export default function CategoryCard({
  category,
  items,
  moveTarget,
  onToggle,
  onMoveItem,
  onDelete,
  onDeleteCategory,
}: Props) {
  const [expanded, setExpanded] = useState(true);
  const tintBg = (CAT_TINT as Record<string, { bg: string }>)[category]?.bg ?? COLORS.sand;
  const accent = categoryAccent(category);
  const glyphBg = categoryGlyphBg(category);
  const packed = items.filter((i) => i.packed).length;
  const total = items.length;
  const pct = total === 0 ? 0 : packed / total;
  const complete = total > 0 && pct === 1;
  const move = MOVE_CONFIG[moveTarget];

  return (
    <View style={[styles.card, { backgroundColor: tintBg }]}>
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.7}>
        <View style={[styles.glyphBox, { backgroundColor: complete ? COLORS.leafSoft : glyphBg }]}>
          <Feather name="package" size={16} color={complete ? COLORS.leaf : accent} />
        </View>
        <View style={styles.cardMeta}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>{categoryLabel(category)}</Text>
            {complete && (
              <View style={styles.doneBadge}>
                <Text style={styles.doneBadgeText}>DONE</Text>
              </View>
            )}
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${pct * 100}%` as `${number}%`,
                    backgroundColor: complete ? COLORS.leaf : accent,
                  },
                ]}
              />
            </View>
            <Text style={styles.progressCount}>
              {packed}/{total}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={onDeleteCategory}
          activeOpacity={0.7}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 4 }}>
          <Feather name="trash-2" size={14} color={COLORS.mute} />
        </TouchableOpacity>
        <Feather name={expanded ? 'chevron-down' : 'chevron-right'} size={14} color={COLORS.mute} />
      </TouchableOpacity>

      {expanded && (
        <View style={styles.cardBody}>
          {items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <TouchableOpacity
                style={[styles.checkbox, item.packed && styles.checkboxPacked]}
                onPress={() => onToggle(item.id)}
                activeOpacity={0.7}>
                {item.packed && <Feather name="check" size={11} color="#fff" />}
              </TouchableOpacity>
              <Text style={[styles.itemName, item.packed && styles.itemNamePacked]}>
                {item.name}
              </Text>
              <View style={styles.itemActions}>
                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: move.bgColor }]}
                  onPress={() => onMoveItem(item.id)}
                  activeOpacity={0.7}>
                  <Feather name={move.icon} size={12} color={move.color} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionChip, { backgroundColor: COLORS.sandDeep }]}
                  onPress={() => onDelete(item.id)}
                  activeOpacity={0.7}>
                  <Feather name="trash-2" size={12} color={COLORS.ink3} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    paddingHorizontal: 16,
  },
  glyphBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardMeta: {
    flex: 1,
    minWidth: 0,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 14.5,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: -0.1,
  },
  doneBadge: {
    backgroundColor: COLORS.leafSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  doneBadgeText: {
    fontSize: 9,
    color: COLORS.leaf,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 5,
  },
  progressBg: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    backgroundColor: 'rgba(18,40,58,0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressCount: {
    fontSize: 11,
    color: COLORS.ink3,
    fontWeight: '500',
  },
  cardBody: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(18,40,58,0.06)',
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
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
  itemName: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: COLORS.ink,
  },
  itemNamePacked: {
    textDecorationLine: 'line-through',
    color: COLORS.mute,
    fontWeight: '400',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 4,
  },
  actionChip: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
