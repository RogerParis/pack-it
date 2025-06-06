import { useEffect } from 'react';
import { AppState } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import GlobalOverlayAlert from '@/components/global_overlay_alert';

import 'react-native-get-random-values';
import { onUserAuthStateChanged } from '@/services/auth.service';
import { getUserPackingData, saveUserPackingData } from '@/services/cloud.service';
import { useAuthStore } from '@/store/authStore';
import { usePackingStore } from '@/store/packingStore';

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);
  const user = useAuthStore((state) => state.user);
  const replaceAllData = usePackingStore((state) => state.replaceAllData);
  const setLastSyncedAt = usePackingStore((state) => state.setLastSyncedAt);
  // Watch for Firebase login state and sync data
  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);

        // Try to get Firestore data
        const cloudData = await getUserPackingData(firebaseUser.uid);
        if (cloudData) {
          replaceAllData(cloudData.lists);
          setLastSyncedAt(
            cloudData.lastSyncedAt
              ? new Date(cloudData.lastSyncedAt.seconds * 1000).getTime()
              : Date.now(),
          );
        } else {
          // No data → upload local MMKV data
          await saveUserPackingData(firebaseUser.uid);
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
        saveUserPackingData(user);
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

          <Stack.Screen
            name="(donate)"
            options={{
              headerShown: true,
              headerTitle: 'Thanks for your support!',
              headerBackButtonDisplayMode: 'minimal',
            }}
          />
        </Stack>
        <GlobalOverlayAlert />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
