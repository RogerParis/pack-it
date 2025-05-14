import { Pressable } from 'react-native';

import { Tabs, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/theme/colors';

export default function TabLayout() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  return (
    <Tabs
      screenOptions={{
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
      }}>
      <Tabs.Screen
        name="to-pack"
        options={{
          title: '🎒 To Pack',
          tabBarLabel: 'To Pack',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="briefcase-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="to-buy"
        options={{
          title: '🛒 To Buy',
          tabBarLabel: 'To Buy',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          title: '🤖 AI Suggestions',
          tabBarLabel: 'Suggestions',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
