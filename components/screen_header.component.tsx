import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';

export default function ScreenHeader() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const user = useAuthStore((state) => state.user);
  const activeListName = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].name : 'My Trip';
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top + 6 }]}>
      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/(donate)')}
        activeOpacity={0.6}>
        <Feather name="coffee" size={18} color={COLORS.teal} />
      </TouchableOpacity>

      <View style={styles.titleArea}>
        <Text style={styles.subtitle}>CURRENT TRIP</Text>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {activeListName}
          </Text>
          <Feather name="chevron-down" size={12} color={COLORS.ink3} style={{ marginLeft: 2 }} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.iconBtn}
        onPress={() => router.push('/(profile)')}
        activeOpacity={0.6}>
        <Feather name={user ? 'user' : 'log-in'} size={18} color={COLORS.ink2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: COLORS.paper,
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.tealPale,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  titleArea: {
    flex: 1,
    minWidth: 0,
  },
  subtitle: {
    fontSize: 10,
    color: COLORS.mute,
    letterSpacing: 1.2,
    fontWeight: '500',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.ink,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
});
