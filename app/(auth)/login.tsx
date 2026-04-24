import React, { useRef, useState } from 'react';
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

import { useAuthStore } from '@/store/authStore';
import { authStyles as styles } from '@/theme/auth.styles';

export default function LoginScreen() {
  const router = useRouter();
  const signIn = useAuthStore((state) => state.signIn);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await signIn(email, password);
      router.push('/(tabs)/to-pack');
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
      <Text style={styles.appTitle}>Welcome to PackIt 👋</Text>

      <View style={styles.card}>
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
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextInput
          ref={passwordRef}
          placeholder="Password"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError('');
          }}
          secureTextEntry
          style={styles.input}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {error && (
          <Animated.Text entering={FadeInDown} style={styles.error}>
            {error}
          </Animated.Text>
        )}

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.5}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => router.push('/signup')} activeOpacity={0.5}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/forgot-password')} activeOpacity={0.5}>
        <Text style={styles.link}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace('/to-pack')} activeOpacity={0.5}>
        <Text style={styles.link}>Continue as Guest</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
