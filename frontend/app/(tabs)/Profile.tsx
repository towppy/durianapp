// app/(tabs)/Profile.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  useWindowDimensions,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/appconf';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoModalVisible, setPhotoModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSmallScreen = width < 375;

  // Simple styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      paddingHorizontal: 16,
      paddingTop: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
    },
    backButton: {
      padding: 8,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1b5e20',
      textAlign: 'center',
      flex: 1,
    },
    profileCard: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      marginBottom: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: '#e8f5e9',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#1b5e20',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 60,
    },
    avatarPlaceholder: {
      fontSize: 42,
      color: '#1b5e20',
      fontWeight: 'bold',
    },
    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: width / 2 - 60,
      backgroundColor: '#1b5e20',
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: '#fff',
    },
    infoContainer: {
      alignItems: 'center',
    },
    name: {
      fontSize: 24,
      fontWeight: '600',
      color: '#1b5e20',
      marginBottom: 4,
      textAlign: 'center',
    },
    email: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20,
      textAlign: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: '#1b5e20',
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 12,
      padding: 14,
      fontSize: 16,
      backgroundColor: '#f9f9f9',
      color: '#333',
      marginBottom: 8,
    },
    buttonRow: {
      flexDirection: 'column',
      gap: 12,
      marginTop: 24,
    },
    editButton: {
      backgroundColor: '#1b5e20',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    saveButton: {
      backgroundColor: '#1b5e20',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: 'transparent',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#ddd',
    },
    logoutButton: {
      backgroundColor: '#dc3545',
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButtonText: {
      color: '#666',
      fontSize: 16,
      fontWeight: '600',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f8f9fa',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 24,
      width: '85%',
      maxWidth: 400,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: '#1b5e20',
      marginBottom: 20,
      textAlign: 'center',
    },
    modalButtons: {
      flexDirection: 'column',
      gap: 12,
      width: '100%',
    },
    modalButton: {
      paddingVertical: 15,
      borderRadius: 12,
      alignItems: 'center',
      width: '100%',
    },
    modalButtonPrimary: {
      backgroundColor: '#1b5e20',
    },
    modalButtonSecondary: {
      backgroundColor: '#6c757d',
    },
    modalCancelButton: {
      marginTop: 16,
      padding: 10,
    },
  });

  // Request permissions on mount
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: galleryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (galleryStatus !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to upload profile pictures.');
      }
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission needed', 'Please allow camera access to take profile pictures.');
      }
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedId = await AsyncStorage.getItem('user_id');
      
      if (!storedToken || !storedId) {
        router.replace('/');
        return;
      }

      // Get stored data first
      const storedName = await AsyncStorage.getItem('name');
      const storedPhoto = await AsyncStorage.getItem('photoProfile');
      
      if (storedName) setName(storedName);
      if (storedPhoto) setPhotoUri(storedPhoto);

      // Try to fetch from API
      try {
        const res = await axios.get(`${API_URL}/profile/${storedId}`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        
        if (res.data.name) {
          setName(res.data.name);
          await AsyncStorage.setItem('name', res.data.name);
        }
        if (res.data.email) setEmail(res.data.email);
        if (res.data.photoUri) {
          setPhotoUri(res.data.photoUri);
          await AsyncStorage.setItem('photoProfile', res.data.photoUri);
        }
      } catch (apiError) {
        console.log('Using cached profile data');
      }
    } catch (error) {
      console.error('Profile load error:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Pick image from gallery
  const pickImageFromGallery = async () => {
    try {
      setUploadingPhoto(true);
      
      if (isWeb) {
        // For web - use file input
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (event: any) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              const result = e.target?.result as string;
              setPhotoUri(result);
              Alert.alert('Success', 'Photo selected! Click "Save Changes" to update.');
            };
            reader.readAsDataURL(file);
          }
        };
        
        input.click();
      } else {
        // For mobile - use expo-image-picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

        if (!result.canceled && result.assets[0].uri) {
          setPhotoUri(result.assets[0].uri);
          Alert.alert('Success', 'Photo selected! Click "Save Changes" to update.');
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploadingPhoto(false);
      setPhotoModalVisible(false);
    }
  };

  // Take photo with camera
  const takePhotoWithCamera = async () => {
    try {
      setUploadingPhoto(true);
      
      if (isWeb) {
        Alert.alert('Info', 'Camera access is limited on web. Please use "Choose from Gallery" instead.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0].uri) {
        setPhotoUri(result.assets[0].uri);
        Alert.alert('Success', 'Photo taken! Click "Save Changes" to update.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setUploadingPhoto(false);
      setPhotoModalVisible(false);
    }
  };

  const uploadPhotoToServer = async (imageUri: string, userId: string, token: string) => {
    try {
      // For web with data URL
      if (isWeb && imageUri.startsWith('data:')) {
        // Convert data URL to blob
        const response = await fetch(imageUri);
        const blob = await response.blob();
        
        const formData = new FormData();
        formData.append('photo', blob, 'profile.jpg');
        formData.append('userId', userId);

        const uploadRes = await axios.post(
          `${API_URL}/upload-profile-photo`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return uploadRes.data.photoUrl;
      }
      
      // For mobile with local URI
      if (!isWeb) {
        const formData = new FormData();
        
        // Get filename from URI
        const filename = imageUri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        
        // @ts-ignore
        formData.append('photo', {
          uri: imageUri,
          name: filename,
          type,
        });
        formData.append('userId', userId);

        const uploadRes = await axios.post(
          `${API_URL}/upload-profile-photo`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        return uploadRes.data.photoUrl;
      }

      return imageUri;
    } catch (error) {
      console.error('Photo upload error:', error);
      throw new Error('Failed to upload photo');
    }
  };

  const handleSave = async () => {
    if (!password && !confirmPassword) {
      // Just update profile info without password
      await updateProfile();
    } else if (password && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      if (password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }
      await updateProfile();
    } else {
      Alert.alert('Error', 'Please fill both password fields');
      return;
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      const storedToken = await AsyncStorage.getItem('jwt_token');
      const storedId = await AsyncStorage.getItem('user_id');

      if (!storedToken || !storedId) {
        router.replace('/');
        return;
      }

      const updateData: any = {
        name: name.trim(),
        email: email.trim(),
      };

      if (password) {
        updateData.password = password;
      }

      // Upload photo if it's a new one (not from placeholder)
      let uploadedPhotoUrl = photoUri;
      if (photoUri && !photoUri.includes('via.placeholder.com') && !photoUri.includes('http')) {
        try {
          uploadedPhotoUrl = await uploadPhotoToServer(photoUri, storedId, storedToken);
          updateData.photoUri = uploadedPhotoUrl;
        } catch (uploadError) {
          console.error('Photo upload failed, saving without photo:', uploadError);
          // Continue without photo update
        }
      } else if (photoUri && photoUri.includes('http')) {
        updateData.photoUri = photoUri;
      }

      // Update profile data
      await axios.put(
        `${API_URL}/profile/${storedId}`,
        updateData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // Update AsyncStorage
      await AsyncStorage.setItem('name', name.trim());
      if (uploadedPhotoUrl) {
        await AsyncStorage.setItem('photoProfile', uploadedPhotoUrl);
        setPhotoUri(uploadedPhotoUrl);
      }

      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Update error:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('jwt_token');
      await AsyncStorage.removeItem('user_id');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('photoProfile');
      router.replace('/');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const getInitials = () => {
    if (!name || name.trim().length === 0) {
      return 'US';
    }
    const parts = name.split(' ').filter(part => part.length > 0);
    if (parts.length === 0) return 'US';
    
    return parts
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1b5e20" />
        <Text style={{ marginTop: 10, color: '#1b5e20' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {!isWeb && (
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1b5e20" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>My Profile</Text>
        {!isWeb && <View style={{ width: 40 }} />}
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarPlaceholder}>{getInitials()}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => setPhotoModalVisible(true)}
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="camera" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor="#999"
              style={styles.input}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Email Address</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>New Password (Optional)</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter new password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
            />

            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity 
                onPress={handleSave} 
                style={styles.saveButton}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setIsEditing(false);
                  setPassword('');
                  setConfirmPassword('');
                }}
                style={styles.cancelButton}
                disabled={saving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{name || 'User Name'}</Text>
            <Text style={styles.email}>{email || 'user@example.com'}</Text>
            
            <TouchableOpacity
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
            >
              <Text style={styles.buttonText}>
                <Ionicons name="create-outline" size={16} color="#fff" />{' '}
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.buttonText}>
          <Ionicons name="log-out-outline" size={16} color="#fff" />{' '}
          Logout
        </Text>
      </TouchableOpacity>

      {/* Photo Upload Modal */}
      <Modal
        visible={photoModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPhotoModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Profile Photo</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={pickImageFromGallery}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Choose from Gallery</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={takePhotoWithCamera}
                disabled={uploadingPhoto || isWeb}
              >
                <Text style={styles.buttonText}>
                  {isWeb ? 'Camera (Not Available)' : 'Take Photo'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setPhotoModalVisible(false)}
              disabled={uploadingPhoto}
            >
              <Text style={{ color: '#666', fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}