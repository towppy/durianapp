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
import { API_URL } from "./config/appconf"; // ✅ FIXED IMPORT PATH

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
    
    // Header Section
    header: {
      backgroundColor: "#0d5233",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 40 : 20,
      paddingVertical: isSmallScreen ? 12 : 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 3,
      borderBottomColor: "#1b7a4d",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
    },
    logo: {
      width: isSmallScreen ? 40 : 50,
      height: isSmallScreen ? 40 : 50,
      backgroundColor: "#fff",
      borderRadius: 8,
    },
    headerTitle: {
      fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : 20,
      fontWeight: "bold",
      color: "#fff",
      maxWidth: isSmallScreen ? 180 : isMediumScreen ? 250 : 400,
    },
    headerRight: {
      flexDirection: "row",
      gap: isSmallScreen ? 8 : 12,
    },
    
    // Navigation
    nav: {
      backgroundColor: "#333",
      paddingHorizontal: isSmallScreen ? 12 : isWeb ? 40 : 20,
      paddingVertical: isSmallScreen ? 10 : 12,
    },
    navScroll: {
      flexDirection: "row",
      gap: isSmallScreen ? 12 : 20,
    },
    navItem: {
      paddingVertical: 8,
      paddingHorizontal: isSmallScreen ? 8 : 12,
    },
    navText: {
      color: "#fff",
      fontSize: isSmallScreen ? 13 : 15,
      fontWeight: "500",
    },
    
    // Hero Section (Banner)
    heroSection: {
      backgroundColor: "#f5f5f5",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 40 : 20,
      paddingVertical: isSmallScreen ? 24 : isWeb ? 48 : 32,
    },
    heroContent: {
      width: "100%",
      maxWidth: 1200,
      alignSelf: "center",
    },
    heroBanner: {
      width: "100%",
      height: isSmallScreen ? 200 : isMediumScreen ? 300 : isWeb ? 450 : 350,
      borderRadius: 12,
      resizeMode: "cover",
      marginBottom: isSmallScreen ? 20 : 32,
    },
    heroTextOverlay: {
      position: "absolute",
      top: isSmallScreen ? 20 : 40,
      left: isSmallScreen ? 20 : 40,
      right: isSmallScreen ? 20 : 40,
    },
    heroTitle: {
      fontSize: isSmallScreen ? 24 : isMediumScreen ? 32 : isWeb ? 48 : 36,
      fontWeight: "bold",
      color: "#1b5e20",
      marginBottom: isSmallScreen ? 8 : 12,
      textShadowColor: "rgba(255, 255, 255, 0.8)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    heroSubtitle: {
      fontSize: isSmallScreen ? 14 : isMediumScreen ? 16 : isWeb ? 20 : 18,
      color: "#333",
      lineHeight: isSmallScreen ? 20 : 24,
      maxWidth: isSmallScreen ? 280 : 500,
      textShadowColor: "rgba(255, 255, 255, 0.8)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 3,
    },
    
    // Info Cards Section
    infoCardsSection: {
      backgroundColor: "#fff",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 40 : 20,
      paddingVertical: isSmallScreen ? 24 : 32,
    },
    infoCardsGrid: {
      flexDirection: isWeb && isLargeScreen ? "row" : "column",
      gap: isSmallScreen ? 16 : 20,
      flexWrap: "wrap",
      justifyContent: "center",
    },
    infoCard: {
      backgroundColor: "#0d5233",
      borderRadius: 12,
      padding: isSmallScreen ? 20 : 24,
      flex: isWeb && isLargeScreen ? 1 : undefined,
      minWidth: isWeb && isLargeScreen ? 250 : undefined,
      maxWidth: isWeb && isLargeScreen ? 350 : undefined,
      alignItems: "center",
    },
    infoCardTitle: {
      fontSize: isSmallScreen ? 18 : 20,
      fontWeight: "bold",
      color: "#fff",
      marginBottom: 12,
      textAlign: "center",
    },
    infoCardText: {
      fontSize: isSmallScreen ? 14 : 15,
      color: "#e0e0e0",
      textAlign: "center",
      lineHeight: 20,
    },
    
    // Buttons
    heroButtons: {
      flexDirection: isWeb ? "row" : "column",
      gap: isSmallScreen ? 12 : 16,
      marginTop: isSmallScreen ? 20 : 32,
      justifyContent: "center",
    },
    button: {
      paddingVertical: isSmallScreen ? 14 : 16,
      paddingHorizontal: isSmallScreen ? 24 : 32,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
      minHeight: isSmallScreen ? 48 : 52,
      minWidth: isSmallScreen ? 140 : 160,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    primaryButton: {
      backgroundColor: "#1b5e20",
    },
    secondaryButton: {
      backgroundColor: "#fff",
      borderWidth: 2,
      borderColor: "#1b5e20",
    },
    buttonText: {
      fontSize: isSmallScreen ? 16 : 17,
      fontWeight: "700",
    },
    primaryButtonText: {
      color: "#fff",
    },
    secondaryButtonText: {
      color: "#1b5e20",
    },
    
    // Features Section
    infoSection: {
      backgroundColor: "#f5f5f5",
      paddingHorizontal: isSmallScreen ? 16 : isWeb ? 40 : 20,
      paddingVertical: isSmallScreen ? 32 : isWeb ? 48 : 40,
    },
    sectionTitle: {
      fontSize: isSmallScreen ? 24 : isMediumScreen ? 28 : isWeb ? 36 : 30,
      fontWeight: "bold",
      color: "#0d5233",
      textAlign: "center",
      marginBottom: isSmallScreen ? 24 : 32,
    },
    featureBlock: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: isSmallScreen ? 16 : 20,
      marginBottom: isSmallScreen ? 16 : 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    featureImage: {
      width: "100%",
      height: isSmallScreen ? 140 : isMediumScreen ? 160 : 180,
      borderRadius: 8,
      marginBottom: isSmallScreen ? 12 : 16,
      resizeMode: "cover",
    },
    featureText: {
      fontSize: isSmallScreen ? 15 : 16,
      color: "#333",
      textAlign: "center",
      lineHeight: isSmallScreen ? 22 : 24,
      fontWeight: "500",
    },
    
    // Modal Styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: isSmallScreen ? 16 : 20,
    },
    modalContent: {
      backgroundColor: "#fff",
      borderRadius: 16,
      width: "100%",
      maxWidth: 400,
      padding: isSmallScreen ? 24 : 28,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    modalTitle: {
      fontSize: isSmallScreen ? 24 : 26,
      fontWeight: "bold",
      color: "#0d5233",
      textAlign: "center",
      marginBottom: isSmallScreen ? 20 : 24,
    },
    input: {
      borderWidth: 1.5,
      borderColor: "#d1d5db",
      borderRadius: 10,
      paddingVertical: isSmallScreen ? 12 : 14,
      paddingHorizontal: isSmallScreen ? 14 : 16,
      fontSize: isSmallScreen ? 15 : 16,
      color: "#1f2937",
      marginBottom: isSmallScreen ? 14 : 16,
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
      console.error("JWT decode error:", error);
      return null;
    }
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      // Validation
      if (authMode === "signup") {
        if (!email || !password || !confirmPassword) {
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
          name: email.split("@")[0], // Use email prefix as name
          email,
          password,
          confirm_password: password,
        });

        if (!signupRes.data.success) {
          Alert.alert("Signup Error", signupRes.data.error || "Signup failed");
          setLoading(false);
          return;
        }

        Alert.alert("Signup Success", "Account created! Please log in.");
        setAuthMode("login"); // Switch to login mode
        setLoading(false);
        return;
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

      // Save JWT token
      await storeData("jwt_token", loginRes.data.token);

      // Decode JWT for user_id
      const payload = decodeJWT(loginRes.data.token);
      const userId = payload?.sub;
      if (userId) {
        await storeData("user_id", userId);
      }

      // Store user info
      await storeData("userEmail", email);
      await storeData("name", loginRes.data.name || email.split("@")[0]);
      await storeData("photoProfile", "https://ui-avatars.com/api/?name=" + encodeURIComponent(email.split("@")[0]) + "&background=1b5e20&color=fff");

      closeAuthModal();
      router.replace("/(tabs)/Home");
    } catch (err: any) {
      console.error("Auth error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.detail || err.message || "Something went wrong"
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
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logo}>
              {/* Logo placeholder - replace with your logo */}
            </View>
            <Text style={styles.headerTitle}>Durianostics</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.button, styles.primaryButton, { minWidth: isSmallScreen ? 80 : 100, paddingVertical: isSmallScreen ? 8 : 10 }]}
              onPress={() => openAuthModal("login")}
            >
              <Text style={[styles.buttonText, styles.primaryButtonText, { fontSize: isSmallScreen ? 14 : 15 }]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton, { minWidth: isSmallScreen ? 80 : 100, paddingVertical: isSmallScreen ? 8 : 10 }]}
              onPress={() => openAuthModal("signup")}
            >
              <Text style={[styles.buttonText, styles.secondaryButtonText, { fontSize: isSmallScreen ? 14 : 15 }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* NAVIGATION */}
        <View style={styles.nav}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.navScroll}>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>About Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Services</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navItem}>
                <Text style={styles.navText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>

        {/* HERO BANNER SECTION */}
        <View style={styles.heroSection}>
          <View style={styles.heroContent}>
            <View style={{ position: "relative" }}>
              <Image
                source={require("../assets/images/durian-bg.jpg")}
                style={styles.heroBanner}
              />
              <View style={styles.heroTextOverlay}>
                <Text style={styles.heroTitle}>Know Your Durian Instantly</Text>
                <Text style={styles.heroSubtitle}>
                  AI-powered quality analysis for damage, disease & export standards
                </Text>
              </View>
            </View>

            <View style={styles.heroButtons}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton, loading && styles.disabledButton]}
                onPress={() => openAuthModal("login")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Get Started
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.secondaryButton, loading && styles.disabledButton]}
                onPress={() => openAuthModal("signup")}
                disabled={loading}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Learn More
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* INFO CARDS SECTION */}
        <View style={styles.infoCardsSection}>
          <View style={styles.infoCardsGrid}>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Fast Analysis</Text>
              <Text style={styles.infoCardText}>
                Get instant AI-powered quality assessment in seconds
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Early Detection</Text>
              <Text style={styles.infoCardText}>
                Identify damage and disease before it spreads
              </Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoCardTitle}>Export Ready</Text>
              <Text style={styles.infoCardText}>
                Meet international quality standards with confidence
              </Text>
            </View>
          </View>
        </View>

        {/* FEATURES SECTION */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Why Choose Durianostics?</Text>

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