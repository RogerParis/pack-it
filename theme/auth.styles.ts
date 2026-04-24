import { StyleSheet } from 'react-native';

import { COLORS } from '@/theme/colors';

export const authStyles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  appTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: '600', marginBottom: 20, textAlign: 'center' },
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
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.neutral300,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 16,
  },
  link: { color: COLORS.primary, marginTop: 16, textAlign: 'center' },
});
