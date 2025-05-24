import { Pressable } from 'react-native';

import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { usePackingStore } from '@/store/packingStore';
import { COLORS } from '@/theme/colors';

export default function TabLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const activeListName = usePackingStore((state) => {
    const activeList = state.activeList;
    return activeList ? state.lists[activeList].name : 'Default List';
  });
  return (
    <Tabs
      screenOptions={{
        headerLeft: () => (
          <Pressable onPress={() => router.push('/(donate)')} style={{ marginLeft: 16 }}>
            <Ionicons name="cafe-outline" size={24} color={COLORS.primary} />
          </Pressable>
        ),
        headerRight: () => (
          <Pressable onPress={() => router.push('/(profile)')} style={{ marginRight: 16 }}>
            <Ionicons
              name={user ? 'person-circle' : 'log-in-outline'}
              size={28}
              color={COLORS.primary}
            />
          </Pressable>
        ),
        headerShown: true,
        headerTitle: activeListName,
      }}>
      <Tabs.Screen
        name="to-pack"
        options={{
          tabBarLabel: 'To Pack',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="to-buy"
        options={{
          tabBarLabel: 'To Buy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          tabBarLabel: 'Suggestions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
