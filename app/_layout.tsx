import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { onUserAuthStateChanged } from '../services/auth.service';
import { useAuthStore } from '../store/authStore';
import { usePackingStore } from '../store/packingStore';

import 'react-native-get-random-values';
import { getUserPackingData, saveUserPackingData } from '@/services/cloud.service';

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const replaceAllData = usePackingStore((state) => state.replaceAllData);
  const getCurrentState = usePackingStore((state) => state.getCurrentState);

  // Watch for Firebase login state and sync data
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);

        // Try to get Firestore data
        const cloudData = await getUserPackingData(firebaseUser.uid);
        if (cloudData) {
          replaceAllData({
            toBuy: cloudData.toBuy ?? [],
            toPack: cloudData.toPack ?? [],
            suggestions: cloudData.suggestions ?? [],
          });
        } else {
          // No data → upload local MMKV data
          const localData = getCurrentState();
          await saveUserPackingData(
            firebaseUser.uid,
            localData.toBuy,
            localData.toPack,
            localData.suggestions,
          );
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        const currentData = getCurrentState();
        saveUserPackingData(user, currentData.toBuy, currentData.toPack, currentData.suggestions);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: true,
          }}>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
              animation: 'fade_from_bottom',
            }}
          />

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              gestureEnabled: false,
            }}
          />

          <Stack.Screen
            name="(profile)"
            options={{
              headerShown: true,
              headerTitle: 'Profile',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
