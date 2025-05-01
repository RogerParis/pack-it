import { View, Text, StyleSheet } from "react-native";

export default function ToBuyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🛒 To Buy</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
