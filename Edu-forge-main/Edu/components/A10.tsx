"use client";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type SimplePondActivityProps = {
  onBack: () => void;
};

export default function A10({
  onBack,
}: SimplePondActivityProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFF3E0", "#FFE0B2", "#FFCC80"]}
        style={styles.background}
      />

      <View style={styles.content}>
        <Text style={styles.title}>Pond Respiration Activity</Text>
        <Text style={styles.subtitle}>
          This is a simplified version of the activity
        </Text>

        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "#FF9800",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
