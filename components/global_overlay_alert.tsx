import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';

import CustomButton from '@/components/custom_button.component';

import { useAlertStore } from '@/store/alertStore';
import { COLORS } from '@/theme/colors';

const GlobalOverlayAlert: React.FC = () => {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          {(buttons && buttons.length > 0
            ? buttons
            : [{ text: 'OK', style: 'default', onPress: () => {} }]
          ).map((btn, idx) => (
            <CustomButton
              key={idx}
              title={btn.text}
              onPress={() => {
                btn.onPress?.();
                hideAlert();
              }}
              style={[
                styles.button,
                btn.style === 'cancel' && styles.cancelButton,
                btn.style === 'destructive' && styles.destructiveButton,
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    elevation: 9999,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    minWidth: 280,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#444',
    maxWidth: '80%',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: COLORS.primary,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: COLORS.neutral500,
  },
  destructiveButton: {
    backgroundColor: COLORS.error,
  },
});

export default GlobalOverlayAlert;
