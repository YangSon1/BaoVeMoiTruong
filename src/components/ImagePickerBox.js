// src/components/ImagePickerBox.js
import React from 'react';
import { View, Text, Button, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerBox({ imageUri, onChangeImage }) {
  const pickImage = async () => {
    // Xin quyền truy cập thư viện ảnh
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Thông báo', 'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      onChangeImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Text style={styles.label}>Ảnh minh chứng (tùy chọn)</Text>
      <Button title="Chọn ảnh từ thư viện" onPress={pickImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { marginBottom: 4, fontWeight: 'bold' },
  preview: {
    width: '100%',
    height: 180,
    marginTop: 8,
    borderRadius: 8,
  },
});
