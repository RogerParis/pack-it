import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { Slot } from 'expo-router';

import 'react-native-get-random-values';
import { onUserAuthStateChanged } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

enableScreens();

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onUserAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser.uid);
      } else {
        setUser(null); // guest user
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView>
      <SafeAreaProvider>
        <Slot />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
