import React from 'react';

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
