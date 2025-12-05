import React, { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, 
  ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator 
} from 'react-native';
import { useUser } from '../../store/userContext';
import { createReport } from '../../services/reportService';

export default function ReportCreateScreen({ navigation }) {
  const { user } = useUser();

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Giả lập chọn ảnh
  const handlePickImage = () => {
    setImageUri('https://via.placeholder.com/300/09f/fff.png?text=Evidence+Photo');
  };

  const handleSubmit = async () => {
    // 1. Chỉ bắt buộc Tiêu đề và Mô tả
    if (!title.trim() || !description.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập Tiêu đề và Mô tả.');
      return;
    }

    setLoading(true);
    try {
      // 2. Gửi dữ liệu (Location và Image có thể null)
      await createReport(user?.id, {
        title: title.trim(),
        description: description.trim(),
        location: location.trim() || null,
        imageUri: imageUri || null
      });

      Alert.alert('Thành công', 'Cảm ơn bạn đã báo cáo!');
      navigation.goBack(); 

    } catch (error) {
      console.log(error);
      Alert.alert('Lỗi', 'Không thể gửi báo cáo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Tạo báo cáo mới</Text>

      <Text style={styles.label}>Tiêu đề (*)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ví dụ: Rác thải bừa bãi..."
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Mô tả chi tiết (*)</Text>
      <TextInput 
        style={[styles.input, styles.textArea]} 
        placeholder="Mô tả sự việc..."
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Địa điểm (Tùy chọn)</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Nhập địa chỉ..."
        value={location}
        onChangeText={setLocation}
      />

      <Text style={styles.label}>Hình ảnh (Tùy chọn)</Text>
      {imageUri ? (
        <View style={styles.imagePreviewContainer}>
           <Image source={{ uri: imageUri }} style={styles.previewImage} />
           <Button title="Xóa ảnh" onPress={() => setImageUri(null)} color="#d32f2f" />
        </View>
      ) : (
        <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
          <Text style={styles.uploadText}>📷 Chọn ảnh minh chứng</Text>
        </TouchableOpacity>
      )}

      <View style={styles.spacer} />

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" />
      ) : (
        <Button title="Gửi báo cáo" onPress={handleSubmit} color="#2E7D32" />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flexGrow: 1 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#2E7D32', textAlign: 'center' },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 5, color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, marginBottom: 15, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  uploadButton: { 
    backgroundColor: '#f5f5f5', padding: 15, borderRadius: 8, 
    alignItems: 'center', marginBottom: 15, borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc' 
  },
  uploadText: { color: '#666', fontSize: 15 },
  imagePreviewContainer: { marginBottom: 15, alignItems: 'center' },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' },
  spacer: { height: 10 },
});