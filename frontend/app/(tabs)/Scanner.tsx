import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';

export default function Scanner() {
  const cameraRef = useRef<CameraView | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Loading state
  if (!permission) return <Text>Loading permissions...</Text>;

  // Permission denied
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No camera access</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Take picture function
  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
      } catch (e) {
        console.error('Error taking picture:', e);
      }
    }
  };

  // Back button function (safe in tabs)
  const handleBack = () => {
    router.replace('/LandingMobile'); // Always navigate to landing
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Camera preview */}
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="back"
      />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Take picture button */}
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureText}>📸 Take Picture</Text>
      </TouchableOpacity>

      {/* Photo preview */}
      {photoUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  button: { padding: 12, backgroundColor: '#2e7d32', borderRadius: 8, marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backText: { fontSize: 16, fontWeight: 'bold' },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#27AE60',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
  },
  captureText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewContainer: {
    position: 'absolute',
    bottom: 110,
    left: 20,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  previewImage: { width: '100%', height: '100%' },
});
