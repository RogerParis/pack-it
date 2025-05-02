import { Button, StyleSheet, Text, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useAuthStore } from '../store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      {!user ? (
        <>
          <Button title="Log In" onPress={() => router.push('/login')} />
          <Button title="Sign Up" onPress={() => router.push('/signup')} />
        </>
      ) : (
        <>
          <Text style={styles.loggedInText}>Logged in as: {user}</Text>
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
