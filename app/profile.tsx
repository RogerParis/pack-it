import { useCallback } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { saveUserPackingData } from '@/services/cloud.service';
import { useAuthStore } from '@/store/authStore';
import { usePackingStore } from '@/store/packingStore';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const getCurrentState = usePackingStore((state) => state.getCurrentState);

  const handleLogin = useCallback(() => {
    router.push('/login');
  }, [router]);

  const handleSignUp = useCallback(() => {
    router.push('/signup');
  }, [router]);

  const handleSync = useCallback(() => {
    const currentData = getCurrentState();
    saveUserPackingData(user!, currentData.toBuy, currentData.toPack, currentData.suggestions);
  }, [user, getCurrentState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {!user ? (
        <>
          <Button title="Log In" onPress={handleLogin} />
          <Button title="Sign Up" onPress={handleSignUp} />
        </>
      ) : (
        <>
          <Text style={styles.loggedInText}>Logged in as: {user}</Text>
          <Button title="Sync Now" onPress={handleSync} />
          <Button title="Log Out" onPress={signOut} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  loggedInText: { marginVertical: 16 },
});
