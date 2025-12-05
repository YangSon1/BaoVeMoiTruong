import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useUser } from '../../store/userContext';

export default function ProfileScreen({ navigation }) {
  const { user, profile, updateProfileInfo, logout } = useUser();
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [phone, setPhone] = useState('');

  const userPoints = profile?.points || 0;
  const userRank = profile?.rank || 'Người mới';

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setArea(profile.defaultLocation || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfileInfo({
        name,
        defaultLocation: area,
        phone,
      });
      Alert.alert('Thành công', 'Đã lưu hồ sơ');
    } catch (e) {
      Alert.alert('Lỗi', 'Không lưu được hồ sơ');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Chưa đăng nhập.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hồ sơ người dùng</Text>
      <View style={styles.rankContainer}>
        <Text style={styles.rankTitle}>Hạng: {userRank}</Text>
        <Text style={styles.pointsText}>Điểm tích lũy: {userPoints}</Text>
        
        <TouchableOpacity 
          style={styles.rewardButton}
          onPress={() => navigation.navigate('Rewards')} // Chuyển sang màn hình RewardScreen
        >
          <Text style={styles.rewardButtonText}>🎁 Đổi quà ngay</Text>
        </TouchableOpacity>
      </View>

      <Text>ID: {user.id}</Text>
      {user.email && <Text>Email: {user.email}</Text>}

      <Text style={styles.label}>Tên hiển thị</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />

      <Text style={styles.label}>Khu vực sinh sống (ví dụ: Quận 1, TP.HCM)</Text>
      <TextInput style={styles.input} value={area} onChangeText={setArea} />

      <Text style={styles.label}>Số điện thoại</Text>
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Button title="Lưu hồ sơ" onPress={handleSave} />

      <View style={{ height: 12 }} />
      <Button title="Đăng xuất" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  label: { marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 8 },

  rankContainer: {
    backgroundColor: '#E8F5E9', // Màu nền xanh nhạt
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  rankTitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  pointsText: { fontSize: 16, color: '#555', marginBottom: 10 },
  rewardButton: {
    backgroundColor: '#2E7D32', // Màu nút xanh đậm
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rewardButtonText: { color: '#fff', fontWeight: 'bold' },
});
