// app/(auth)/landing.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
  KeyboardAvoidingView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { API_URL } from "./config/appconf";

export default function Landing() {
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isSmallScreen = width < 375;
  const isMediumScreen = width >= 375 && width < 768;
  const isLargeScreen = width >= 768;

  // Calculate heights based on screen size
  const heroHeight = isSmallScreen ? height * 0.35 : isWeb ? height * 0.4 : height * 0.38;
  const featureImageHeight = isSmallScreen ? 120 : isMediumScreen ? 140 : 160;

  const styles = StyleSheet.create({
    // Main Container
    safeArea: {
      flex: 1,
      backgroundColor: "#fff",
    },
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    scrollContainer: {
      flexGrow: 1,
    },
    
    // Hero Section
    heroSection: {
      minHeight: heroHeight,
      backgroundColor: "#f0f9f0",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 32 : 20,
      paddingVertical: isSmallScreen ? 20 : isWeb ? 40 : 30,
    },
    heroContent: {
      width: "100%",
      maxWidth: 600,
      alignItems: "center",
    },
    heroImage: {
      width: "100%",
      height: isSmallScreen ? 120 : isMediumScreen ? 150 : 180,
      borderRadius: 12,
      resizeMode: "cover",
      marginBottom: isSmallScreen ? 12 : 16,
    },
    heroTitle: {
      fontSize: isSmallScreen ? 22 : isMediumScreen ? 26 : isWeb ? 32 : 28,
      fontWeight: "bold",
      color: "#1b5e20",
      textAlign: "center",
      marginBottom: isSmallScreen ? 6 : 8,
      lineHeight: isSmallScreen ? 26 : isMediumScreen ? 30 : 34,
    },
    heroSubtitle: {
      fontSize: isSmallScreen ? 14 : isMediumScreen ? 15 : 16,
      color: "#4b5563",
      textAlign: "center",
      lineHeight: isSmallScreen ? 20 : 22,
      marginBottom: isSmallScreen ? 16 : 20,
      paddingHorizontal: isSmallScreen ? 4 : 8,
    },
    
    // Buttons
    heroButtons: {
      flexDirection: isWeb ? "row" : "column",
      gap: isSmallScreen ? 10 : 12,
      width: "100%",
      maxWidth: isWeb ? 400 : "100%",
    },
    button: {
      paddingVertical: isSmallScreen ? 12 : 14,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      minHeight: isSmallScreen ? 44 : 48,
      width: isWeb ? "auto" : "100%",
      flex: isWeb ? 1 : undefined,
      paddingHorizontal: isWeb ? 32 : 24,
    },
    primaryButton: {
      backgroundColor: "#1b5e20",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "#1b5e20",
    },
    buttonText: {
      fontSize: isSmallScreen ? 15 : 16,
      fontWeight: "600",
    },
    primaryButtonText: {
      color: "#fff",
    },
    secondaryButtonText: {
      color: "#1b5e20",
    },
    
    // Features Section
    infoSection: {
      backgroundColor: "#fff",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 32 : 20,
      paddingVertical: isSmallScreen ? 24 : isWeb ? 40 : 32,
    },
    sectionTitle: {
      fontSize: isSmallScreen ? 20 : isMediumScreen ? 24 : isWeb ? 30 : 26,
      fontWeight: "bold",
      color: "#1b5e20",
      textAlign: "center",
      marginBottom: isSmallScreen ? 16 : 24,
      lineHeight: isSmallScreen ? 24 : 30,
    },
    featureBlock: {
      backgroundColor: "#f9f9f9",
      borderRadius: 12,
      padding: isSmallScreen ? 14 : 16,
      marginBottom: isSmallScreen ? 12 : 16,
      elevation: 1,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    featureImage: {
      width: "100%",
      height: featureImageHeight,
      borderRadius: 8,
      marginBottom: isSmallScreen ? 10 : 12,
      resizeMode: "cover",
    },
    featureText: {
      fontSize: isSmallScreen ? 14 : 15,
      color: "#374151",
      textAlign: "center",
      lineHeight: isSmallScreen ? 20 : 22,
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: isSmallScreen ? 16 : 20,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 16,
      width: "100%",
      maxWidth: 400,
      padding: isSmallScreen ? 20 : 24,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalTitle: {
      fontSize: isSmallScreen ? 22 : 24,
      fontWeight: "bold",
      color: "#1b5e20",
      textAlign: "center",
      marginBottom: isSmallScreen ? 16 : 20,
    },
    input: {
      borderWidth: 1,
      borderColor: "#d1d5db",
      borderRadius: 10,
      paddingVertical: isSmallScreen ? 12 : 14,
      paddingHorizontal: isSmallScreen ? 14 : 16,
      fontSize: isSmallScreen ? 15 : 16,
      color: "#1f2937",
      marginBottom: isSmallScreen ? 12 : 14,
      backgroundColor: "#f9fafb",
    },
    
    // Loading States
    disabledButton: {
      opacity: 0.6,
    },
    loadingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
  });

  const openAuthModal = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalVisible(true);
  };

  const closeAuthModal = () => {
    setAuthModalVisible(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setLoading(false);
  };

  // Platform-aware storage function
  const storeData = async (key: string, value: string): Promise<void> => {
    await AsyncStorage.setItem(key, value);
  };

  // JWT decoding function
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (authMode === "signup") {
        if (!name || !email || !password || !confirmPassword) {
          Alert.alert("Error", "Please fill in all fields");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert("Error", "Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          Alert.alert("Error", "Password must be at least 6 characters");
          setLoading(false);
          return;
        }

        // Signup
        const signupRes = await axios.post(`${API_URL}/signup`, {
          name,
          email,
          password,
          confirm_password: confirmPassword,
        });

        if (!signupRes.data.success) {
          Alert.alert("Signup Error", signupRes.data.error || "Signup failed");
          setLoading(false);
          return;
        }

        Alert.alert("Signup Success", signupRes.data.message);
      }

      // Login
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        setLoading(false);
        return;
      }

      const loginRes = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (!loginRes.data.success || !loginRes.data.token) {
        Alert.alert("Login Error", loginRes.data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Save JWT and user info
      await storeData("jwt_token", loginRes.data.token);

      // Decode JWT
      const payload = decodeJWT(loginRes.data.token);
      const userId = payload?.sub;
      if (userId) {
        await storeData("user_id", userId);
      }

      if (authMode === "signup" && name) {
        await storeData("name", name);
      }

      // Default profile photo
      await storeData("photoProfile", "https://ui-avatars.com/api/?name=" + encodeURIComponent(name || "User") + "&background=1b5e20&color=fff");

      closeAuthModal();
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      console.error("Auth error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.error || err.message || "Something went wrong"
      );
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HERO SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <Image
              source={require("../assets/images/durian-bg.jpg")}
              style={styles.heroImage}
            />
            <Text style={styles.heroTitle}>Know Your Durian Instantly</Text>
            <Text style={styles.heroSubtitle}>
              Durianostics uses AI to check quality — damage, disease & export‑grade readiness — in seconds.
            </Text>

            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
                onPress={() => openAuthModal("login")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  {loading ? "Processing..." : "Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, loading && styles.disabledButton]}
                onPress={() => openAuthModal("signup")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Why Durianostics?</Text>

          <View style={styles.featureBlock}>
            <Image
              source={require("../assets/images/feature1.jpg")}
              style={styles.featureImage}
            />
            <Text style={styles.featureText}>
              Fast and accurate AI analysis for growers, sellers, and exporters.
            </Text>
          </View>

          <View style={styles.featureBlock}>
            <Image
              source={require("../assets/images/feature2.jpg")}
              style={styles.featureImage}
            />
            <Text style={styles.featureText}>
              Detect early signs of damage and disease before it's too late.
            </Text>
          </View>

          <View style={styles.featureBlock}>
            <Image
              source={require("../assets/images/feature3.jpg")}
              style={styles.featureImage}
            />
            <Text style={styles.featureText}>
              Export‑ready quality standards at your fingertips.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* AUTH MODAL */}
      <Modal
        visible={authModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeAuthModal}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {authMode === "login" ? "Login" : "Sign Up"}
              </Text>

              {authMode === "signup" && (
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                  autoCapitalize="words"
                />
              )}
              
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
                autoCapitalize="none"
              />
              
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
              />
              
              {authMode === "signup" && (
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  editable={!loading}
                />
              )}

              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { marginTop: 8 }, loading && styles.disabledButton]}
                onPress={onSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, styles.primaryButtonText]}>
                    {authMode === "login" ? "Login" : "Sign Up"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 16, paddingVertical: 8 }}
                onPress={() => setAuthMode(authMode === "login" ? "signup" : "login")}
                disabled={loading}
              >
                <Text style={{ color: "#1b5e20", textAlign: "center", fontSize: isSmallScreen ? 14 : 15 }}>
                  {authMode === "login"
                    ? "Don't have an account? Sign Up"
                    : "Already have an account? Login"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 8, paddingVertical: 8 }}
                onPress={closeAuthModal}
                disabled={loading}
              >
                <Text style={{ color: "#6b7280", textAlign: "center", fontSize: isSmallScreen ? 14 : 15 }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}