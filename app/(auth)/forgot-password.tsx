import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useRouter } from 'expo-router';

import { resetPassword } from '@/services/auth.service';
import { COLORS } from '@/theme/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async () => {
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent.');
      router.back();
    } catch (err) {
      console.error('Reset failed:', err);
      setError('Could not send reset email. Double check that the email is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>

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

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        title={loading ? 'Sending email...' : 'Send Reset Email'}
        onPress={handleReset}
        disabled={loading}
      />

      {loading && (
        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 12 }} />
      )}

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Back to Login</Text>
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
