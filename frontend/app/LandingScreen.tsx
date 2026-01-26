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
  const isTablet = width >= 768;
  const isSmallScreen = width < 375; // iPhone SE size
  
  // Responsive styles based on platform
  const styles = StyleSheet.create({
    pageContainer: {
      flexGrow: 1,
      backgroundColor: "#fff",
    },
    heroSection: {
      alignItems: "center",
      padding: isWeb ? 40 : isSmallScreen ? 15 : 20,
      paddingTop: isWeb ? 60 : isSmallScreen ? 30 : 40,
      backgroundColor: "#f8fff8",
    },
    heroImage: {
      width: "100%",
      height: isWeb ? 400 : isSmallScreen ? 180 : 250,
      borderRadius: isWeb ? 12 : 8,
      resizeMode: "cover",
    },
    heroTitle: {
      fontSize: isSmallScreen ? 24 : isWeb ? 36 : 28,
      fontWeight: "bold",
      color: "#1b5e20",
      marginTop: isSmallScreen ? 15 : 20,
      textAlign: "center",
      maxWidth: isWeb ? 800 : "100%",
      paddingHorizontal: isSmallScreen ? 10 : 0,
    },
    heroSubtitle: {
      fontSize: isSmallScreen ? 14 : isWeb ? 18 : 16,
      color: "#666",
      marginTop: isSmallScreen ? 8 : 10,
      textAlign: "center",
      maxWidth: isWeb ? 800 : "100%",
      lineHeight: 1.5,
      paddingHorizontal: isSmallScreen ? 10 : isWeb ? 20 : 15,
    },
    heroButtons: {
      flexDirection: isWeb ? "row" : "column",
      marginTop: isSmallScreen ? 20 : 30,
      gap: isSmallScreen ? 10 : 15,
      width: isWeb ? "auto" : "100%",
      paddingHorizontal: isSmallScreen ? 10 : 0,
    },
    primaryButton: {
      backgroundColor: "#1b5e20",
      paddingVertical: isSmallScreen ? 12 : isWeb ? 16 : 14,
      paddingHorizontal: isWeb ? 32 : 24,
      borderRadius: 8,
      minWidth: isWeb ? 150 : "100%",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 3,
    },
    secondaryButton: {
      backgroundColor: "transparent",
      borderWidth: 2,
      borderColor: "#1b5e20",
      paddingVertical: isSmallScreen ? 12 : isWeb ? 16 : 14,
      paddingHorizontal: isWeb ? 32 : 24,
      borderRadius: 8,
      minWidth: isWeb ? 150 : "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    primaryButtonText: {
      color: "#fff",
      fontSize: isSmallScreen ? 14 : isWeb ? 18 : 16,
      fontWeight: "600",
    },
    secondaryButtonText: {
      color: "#1b5e20",
      fontSize: isSmallScreen ? 14 : isWeb ? 18 : 16,
      fontWeight: "600",
    },
    infoSection: {
      padding: isSmallScreen ? 15 : isWeb ? 40 : 20,
      backgroundColor: "#fff",
    },
    sectionTitle: {
      fontSize: isSmallScreen ? 20 : isWeb ? 32 : 24,
      fontWeight: "bold",
      color: "#1b5e20",
      marginBottom: isSmallScreen ? 15 : isWeb ? 30 : 20,
      textAlign: "center",
    },
    featureBlock: {
      marginBottom: isSmallScreen ? 15 : isWeb ? 30 : 20,
      alignItems: "center",
      backgroundColor: "#f9f9f9",
      borderRadius: 12,
      padding: isSmallScreen ? 12 : isWeb ? 20 : 15,
      marginHorizontal: isWeb ? 0 : isSmallScreen ? 5 : 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    featureImage: {
      width: "100%",
      height: isSmallScreen ? 120 : isWeb ? 200 : 150,
      borderRadius: 8,
      marginBottom: isSmallScreen ? 10 : 15,
      resizeMode: "cover",
    },
    featureText: {
      fontSize: isSmallScreen ? 14 : isWeb ? 18 : 16,
      color: "#444",
      textAlign: "center",
      lineHeight: 1.4,
    },
    disabledButton: {
      opacity: 0.6,
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
    // AsyncStorage works on both web and mobile in Expo
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

      // ---------------- SIGNUP ----------------
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

      // ---------------- LOGIN ----------------
      if (!email || !password) {
        Alert.alert("Error", "Please fill in all fields");
        setLoading(false);
        return;
      }

      console.log("Attempting login to:", `${API_URL}/login`);

      const loginRes = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });

      if (!loginRes.data.success || !loginRes.data.token) {
        Alert.alert(
          "Login Error",
          loginRes.data.error || "Invalid credentials"
        );
        setLoading(false);
        return;
      }

      // Save JWT using platform-aware storage
      await storeData("jwt_token", loginRes.data.token);

      // Decode JWT for user_id
      const payload = decodeJWT(loginRes.data.token);
      const userId = payload?.sub;
      if (userId) {
        await storeData("user_id", userId);
      }

      if (authMode === "signup" && name) {
        await storeData("name", name);
      }

      // Optional: default profile photo
      await storeData(
        "photoProfile",
        "https://via.placeholder.com/120"
      );

      closeAuthModal();
      router.replace("/(tabs)/Home"); // redirect after login/signup
    } catch (err: any) {
      console.error(err);
      Alert.alert(
        "Error",
        err.response?.data?.error || err.message || "Something went wrong"
      );
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.pageContainer}
      showsVerticalScrollIndicator={isWeb}
    >
      {/* HERO SECTION */}
      <View style={styles.heroSection}>
        <Image
          source={require("../assets/images/durian-bg.jpg")} 
          style={styles.heroImage}
        />
        <Text style={styles.heroTitle}>Know Your Durian Instantly</Text>
        <Text style={styles.heroSubtitle}>
          Durianostics uses AI to check quality — damage, disease & export‑grade
          readiness — in seconds.
        </Text>

        <View style={styles.heroButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.disabledButton]}
            onPress={() => openAuthModal("login")}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? "Processing..." : "Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, loading && styles.disabledButton]}
            onPress={() => openAuthModal("signup")}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* INFORMATION / FEATURES */}
      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Why Durianostics?</Text>

        <View style={styles.featureBlock}>
          <Image
            source={require("../assets/images/feature1.jpg")} // ✅ Fixed path
            style={styles.featureImage}
          />
          <Text style={styles.featureText}>
            Fast and accurate AI analysis for growers, sellers, and exporters.
          </Text>
        </View>

        <View style={styles.featureBlock}>
          <Image
            source={require("../assets/images/feature2.jpg")} // ✅ Fixed path
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

      {/* AUTH MODAL */}
      <Modal
        visible={authModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeAuthModal}
      >
        <View style={modalStyles.modalOverlay}>
          <View
            style={[
              modalStyles.modalContent,
              isWeb && modalStyles.modalContentWeb,
              isSmallScreen && modalStyles.modalContentSmall,
            ]}
          >
            <Text style={modalStyles.modalTitle}>
              {authMode === "login" ? "Login" : "Sign Up"}
            </Text>

            {authMode === "signup" && (
              <TextInput
                style={modalStyles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
                editable={!loading}
              />
            )}
            <TextInput
              style={modalStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
              autoCapitalize="none"
            />
            <TextInput
              style={modalStyles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
            {authMode === "signup" && (
              <TextInput
                style={modalStyles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
              />
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { marginTop: 20 },
                loading && styles.disabledButton,
              ]}
              onPress={onSubmit}
              disabled={loading}
            >
              <Text style={styles.primaryButtonText}>
                {loading
                  ? "Processing..."
                  : authMode === "login"
                  ? "Login"
                  : "Sign Up"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={() =>
                setAuthMode(authMode === "login" ? "signup" : "login")
              }
              disabled={loading}
            >
              <Text style={{ color: "#1b5e20", textAlign: "center", fontSize: isSmallScreen ? 14 : 16 }}>
                {authMode === "login"
                  ? "Don't have an account? Sign Up"
                  : "Already have an account? Login"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 12 }}
              onPress={closeAuthModal}
              disabled={loading}
            >
              <Text style={{ color: "#999", textAlign: "center", fontSize: isSmallScreen ? 14 : 16 }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: Platform.OS === "web" ? 20 : 10,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: Platform.OS === "web" ? "90%" : "85%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalContentWeb: {
    width: "90%",
  },
  modalContentSmall: {
    width: "95%",
    padding: 16,
    maxWidth: 350,
  },
  modalTitle: {
    fontSize: Platform.OS === "web" ? 28 : 24,
    fontWeight: "600",
    color: "#1b5e20",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: Platform.OS === "web" ? 14 : 12,
    marginBottom: 15,
    fontSize: Platform.OS === "web" ? 16 : 14,
    backgroundColor: "#f9f9f9",
  },
});