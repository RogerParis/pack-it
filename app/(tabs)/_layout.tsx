import { Tabs } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '@/theme/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.paper,
          borderTopColor: COLORS.line,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.teal,
        tabBarInactiveTintColor: COLORS.mute,
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: '600',
          letterSpacing: 0.1,
        },
      }}>
      <Tabs.Screen
        name="to-pack"
        options={{
          tabBarLabel: 'To Pack',
          tabBarIcon: ({ color, size }) => <Feather name="briefcase" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="to-buy"
        options={{
          tabBarLabel: 'To Buy',
          tabBarIcon: ({ color, size }) => (
            <Feather name="shopping-cart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="suggestions"
        options={{
          tabBarLabel: 'Suggestions',
          tabBarIcon: ({ color, size }) => <Feather name="zap" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
