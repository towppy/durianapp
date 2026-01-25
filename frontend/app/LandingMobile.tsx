import React, { useState } from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "./styles/LandingMobile.styles";

type ViewMode = "landing" | "login" | "signup";

export default function LandingMobile() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const BACKEND_URL = "http://192.168.0.106:5000";

  // -----------------------------
  // SIGNUP
  // -----------------------------
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      // Call backend signup
      const res = await axios.post(`${BACKEND_URL}/signup`, {
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });

      if (!res.data.success) {
        Alert.alert("Signup Error", res.data.error || "Signup failed");
        return;
      }

      Alert.alert("Success", res.data.message);

      // Auto-login after signup
      await handleLogin(true); // pass true to indicate it's after signup
    } catch (err: any) {
      console.error("Signup error:", err);
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = async (afterSignup = false) => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, { email, password });

      if (!res.data.success || !res.data.token) {
        Alert.alert("Login Error", res.data.error || "Invalid credentials");
        return;
      }

      // Decode JWT token to get user_id
      const tokenParts = res.data.token.split(".");
      if (tokenParts.length !== 3) throw new Error("Invalid token format");

      const payload = JSON.parse(
        atob(tokenParts[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      const userId = payload.sub;

      // Save login data
      await AsyncStorage.setItem("jwt_token", res.data.token);
      await AsyncStorage.setItem("user_id", userId);
      await AsyncStorage.setItem("isLoggedIn", "true");

      // Default profile photo
      const defaultPhoto = "https://via.placeholder.com/120";
      await AsyncStorage.setItem("photoProfile", defaultPhoto);

      // If login was triggered by signup, use the signup name
      if (afterSignup && name) {
        await AsyncStorage.setItem("name", name);
      }

      // Redirect to Home tab
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      console.error("Login error:", err);
      Alert.alert("Login Error", err.response?.data?.error || "Something went wrong");
    }
  };

  const goBack = () => {
    setViewMode("landing");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/durian-bg.jpg")}
          style={styles.hero}
          imageStyle={{ opacity: 0.95 }}
          resizeMode="cover"
        />
        <View style={styles.card}>
          {/* Landing */}
          {viewMode === "landing" && (
            <>
              <Text style={styles.title}>
                Know your <Text style={styles.italic}>Durian!</Text>
              </Text>
              <View style={styles.divider} />
              <Text style={styles.description}>
                Durianostics uses AI to check durian quality instantly—detecting damage, disease,
                and export-grade readiness.
              </Text>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.button} onPress={() => setViewMode("login")}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </TouchableOpacity>
              <Text style={styles.or}>OR</Text>
              <TouchableOpacity style={styles.button} onPress={() => setViewMode("signup")}>
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Login */}
          {viewMode === "login" && (
            <>
              <Text style={styles.title}>Login</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                <Text style={styles.buttonText}>LOG IN</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Signup */}
          {viewMode === "signup" && (
            <>
              <Text style={styles.title}>Sign Up</Text>
              <View style={styles.divider} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                placeholderTextColor="#9ca3af"
              />
              <TouchableOpacity style={styles.button} onPress={handleSignup}>
                <Text style={styles.buttonText}>SIGN UP</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={goBack} style={styles.backButton}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </>
  );
}
