import React from 'react';

import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackButtonDisplayMode: 'minimal',
      }}>
      <Stack.Screen
        name="login"
        options={{
          headerShown: true,
          headerTitle: 'Login',
        }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{
          headerShown: true,
          headerTitle: 'Forgot Password',
        }}
      />
      <Stack.Screen
        name="signup"
        options={{
          headerShown: true,
          headerTitle: 'Sign Up',
        }}
      />
    </Stack>
  );
}
