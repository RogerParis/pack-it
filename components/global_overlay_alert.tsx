import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useAlertStore } from '@/store/alertStore';

const GlobalOverlayAlert: React.FC = () => {
  const { visible, title, message, buttons, hideAlert } = useAlertStore();

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          {(buttons && buttons.length > 0
            ? buttons
            : [{ text: 'OK', style: 'default', onPress: () => {} }]
          ).map((btn, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.button,
                btn.style === 'cancel' && styles.cancelButton,
                btn.style === 'destructive' && styles.destructiveButton,
              ]}
              onPress={() => {
                btn.onPress?.();
                hideAlert();
              }}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>{btn.text}</Text>
            </TouchableOpacity>
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
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  button: {
    marginLeft: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#aaa',
  },
  destructiveButton: {
    backgroundColor: '#e74c3c',
  },
});

export default GlobalOverlayAlert;
