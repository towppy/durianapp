import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from '../styles/Profile.styles'; // <-- import the CSS

const API_URL = "http://192.168.0.106:5000";

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState('https://via.placeholder.com/120');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedId = await AsyncStorage.getItem('user_id');
      if (!storedToken || !storedId) {
        router.replace('/LandingMobile');
        return;
      }
      setToken(storedToken);
      setUserId(storedId);

      try {
        const res = await axios.get(`${API_URL}/profile/${storedId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        setName(res.data.name);
        setEmail(res.data.email);
        setPhotoUri(res.data.photoUri || 'https://via.placeholder.com/120');
      } catch (e) {
        Alert.alert('Error', 'Failed to fetch profile');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!userId || !token) return;

    if (password && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Invalid email address');
      return;
    }

    try {
      await axios.put(
        `${API_URL}/profile/${userId}`,
        { name, email, password: password || undefined, photoUri },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Success', 'Profile updated!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (e) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <Text style={styles.title}>Profile</Text>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.avatar} />
      ) : (
        <View style={styles.avatar} />
      )}

      {isEditing ? (
        <>
          <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#aaa" style={styles.input} />
          <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#aaa" style={styles.input} keyboardType="email-address" />
          <TextInput value={password} onChangeText={setPassword} placeholder="New Password" placeholderTextColor="#aaa" style={styles.input} secureTextEntry />
          {password.length > 0 && <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Confirm Password" placeholderTextColor="#aaa" style={styles.input} secureTextEntry />}

          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Changes</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsEditing(false)} style={styles.cancelButton}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.editButton}>
            <Text style={styles.buttonText}>✏️ Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
