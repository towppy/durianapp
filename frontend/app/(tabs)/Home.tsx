import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import styles from "../styles/Home.styles";

const Home: React.FC = () => {
  const handleLogout = () => {
    // clear token from AsyncStorage if you store it
    // AsyncStorage.removeItem("token");
    router.replace("/LandingMobile"); // navigate back to landing page
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Durianostics!</Text>
        <Text style={styles.subtitle}>You are logged in.</Text>

        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
