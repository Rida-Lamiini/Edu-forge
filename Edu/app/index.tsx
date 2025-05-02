import { View, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";
import HomeScreen from "./home-screen";

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f9fk",
  },
});
