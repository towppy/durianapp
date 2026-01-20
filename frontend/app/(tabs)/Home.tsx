import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { router } from "expo-router";

export default function Home() {
  const handleLogout = () => {
    // clear token from AsyncStorage if you store it
    // AsyncStorage.removeItem("token");
    router.replace("/LandingMobile"); // go back to landing page
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Durianostics!</Text>
      <Text style={styles.subtitle}>You are logged in.</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
});
