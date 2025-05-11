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

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      router.push('/to-pack');
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

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
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 12 }} />
      )}

      <Pressable onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/forgot-password')}>
        <Text style={styles.link}>Forgot password?</Text>
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
