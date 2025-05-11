import React, { useState } from 'react';
import {
  ActivityIndicator,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/theme/colors';

export default function SignupScreen() {
  const router = useRouter();
  const register = useAuthStore((state) => state.signUp);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(email, password);
      router.push('/login');
    } catch (err) {
      console.error('Signup failed:', err);
      setError('Account could not be created. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
        }}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError('');
        }}
        secureTextEntry
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={loading ? 'Creating account...' : 'Sign Up'}
        onPress={handleSignup}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 12 }} />
      )}

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </Pressable>

      <Pressable onPress={() => router.replace('/to-pack')}>
        <Text style={styles.link}>Continue as Guest</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.neutral300,
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  error: {
    color: COLORS.error,
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 14,
  },
  link: { color: COLORS.primary, marginTop: 12, textAlign: 'center' },
});
