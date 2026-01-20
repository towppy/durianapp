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
import styles from "./styles/LandingMobile.styles";

type ViewMode = "landing" | "login" | "signup";

export default function LandingMobile() {
  const [viewMode, setViewMode] = useState<ViewMode>("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const BACKEND_URL = "http://192.168.0.104:5000"; // Change if needed

  // ------------------ Signup ------------------
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/signup`, {
        name,
        email,
        password,
        confirm_password: confirmPassword,
      });

      Alert.alert("Success", res.data.message);
      // Clear form and go to login
      setViewMode("login");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      Alert.alert("Signup Error", err.response?.data?.error || "Something went wrong");
    }
  };

  // ------------------ Login ------------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const res = await axios.post(`${BACKEND_URL}/login`, { email, password });

      // Save JWT token here if needed (AsyncStorage)
      // await AsyncStorage.setItem("token", res.data.token);

      // Redirect to Home (tabs)
      router.replace("/(tabs)/Home");
    } catch (err: any) {
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

              <TouchableOpacity
                style={styles.button}
                onPress={() => setViewMode("login")}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>LOG IN</Text>
              </TouchableOpacity>

              <Text style={styles.or}>OR</Text>

              <TouchableOpacity
                style={styles.button}
                onPress={() => setViewMode("signup")}
                activeOpacity={0.8}
              >
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
              <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
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
              <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.8}>
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
