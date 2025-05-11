import { useState } from 'react';
import { Alert, Button, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useRouter } from 'expo-router';

import { resetPassword } from '@/services/auth.service';
import { COLORS } from '@/theme/colors';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleReset = async () => {
    try {
      await resetPassword(email);
      Alert.alert('Success', 'Password reset email sent.');
      router.push('/login');
    } catch (error) {
      console.error('Password reset failed:', error);
      Alert.alert('Error', 'Failed to send password reset email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <Button title="Send Reset Email" onPress={handleReset} />
      <Pressable onPress={() => router.push('/login')}>
        <Text style={styles.link}>Back to Login</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/to-pack')}>
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
    marginBottom: 16,
    borderRadius: 6,
  },
  link: { color: COLORS.primary, marginTop: 12, textAlign: 'center' },
});
