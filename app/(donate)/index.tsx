import React from 'react';
import { Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Feather } from '@expo/vector-icons';

import { COLORS } from '@/theme/colors';

export default function DonationsScreen() {
  const openBMC = () => {
    Linking.openURL('https://www.buymeacoffee.com/rogerparis');
  };

  return (
    <View style={styles.container}>
      <Feather name="heart" size={64} color={COLORS.primary} />
      <Text style={styles.heading}>Support PackIt 💛</Text>
      <Text style={styles.text}>
        If you find this app helpful, you can support its development through Buy Me a Coffee.
      </Text>

      <TouchableOpacity style={styles.button} onPress={openBMC}>
        <Image
          source={{
            uri: 'https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png',
          }}
          style={styles.bmcLogo}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', marginVertical: 16 },
  text: { fontSize: 16, textAlign: 'center', marginBottom: 24, color: COLORS.text },
  button: {
    backgroundColor: 'transparent',
  },
  bmcLogo: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
  },
});
