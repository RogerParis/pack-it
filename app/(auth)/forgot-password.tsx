import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useRouter } from 'expo-router';

import { getFirebaseAuthError } from '@/utils/auth.utils';

import { showPasswordResetSuccessAlert } from '@/services/alerts.service';
import { resetPassword } from '@/services/auth.service';
import { authStyles as styles } from '@/theme/auth.styles';

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
      showPasswordResetSuccessAlert();
      router.push('/(auth)/login');
    } catch (err) {
      setError(getFirebaseAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <Text style={styles.appTitle}>Reset your password 🔐</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

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
          returnKeyType="done"
          onSubmitEditing={handleReset}
        />

        {error && (
          <Animated.Text entering={FadeInDown} style={styles.error}>
            {error}
          </Animated.Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleReset}
          disabled={loading}
          activeOpacity={0.5}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send Reset Email</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.back()} activeOpacity={0.5}>
        <Text style={styles.link}>Back to Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/to-pack')} activeOpacity={0.5}>
        <Text style={styles.link}>Continue as Guest</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
