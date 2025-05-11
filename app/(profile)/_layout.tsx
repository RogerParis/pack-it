import React from 'react';

import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        gestureEnabled: false,
      }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
