import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, Alert } from 'react-native';
import * as Location from 'expo-location';
import { getAQIByLocation } from '../../services/aqiService';
import { getAQIInfo } from '../../utils/aqiHelper';
import { useAQI } from '../../store/aqiContext';
import { useUser } from '../../store/userContext';
import { sendAQIAlertNotification } from '../../services/notificationService';

export default function AQIScreen() {
  const { currentAQI, setCurrentAQI, threshold, setThreshold } = useAQI();
  const { profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [inputThreshold, setInputThreshold] = useState(String(threshold));
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAQI();
  }, []);

  const fetchAQI = async () => {
    setLoading(true);
    setError('');
    try {
      let lat = null;
      let lng = null;

      // Chỉ dùng GPS nếu người dùng đã cho phép trong Settings
      if (profile?.allowLocation) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const location = await Location.getCurrentPositionAsync({});
          lat = location.coords.latitude;
          lng = location.coords.longitude;
        } else {
          setError('Không được cấp quyền GPS, dùng vị trí mặc định.');
        }
      }

      // Nếu chưa có tọa độ (không cho phép hoặc lỗi) → dùng vị trí mặc định (ví dụ: HCM)
      if (lat === null || lng === null) {
        // bạn có thể thay bằng khu vực mặc định từ profile.defaultLocation
        lat = 10.776;
        lng = 106.700;
      }

      const aqiValue = await getAQIByLocation(lat, lng);
      const info = getAQIInfo(aqiValue);
      setCurrentAQI(info);

      // Nếu vượt ngưỡng → gửi thông báo
      if (info.value > threshold) {
        await sendAQIAlertNotification(info);
      }
    } catch (e) {
      console.log(e);
      setError('Không lấy được dữ liệu AQI.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveThreshold = () => {
    const num = parseInt(inputThreshold, 10);
    if (isNaN(num) || num <= 0) {
      Alert.alert('Lỗi', 'Ngưỡng phải là số dương.');
      return;
    }
    setThreshold(num);
    Alert.alert('Thành công', 'Đã cập nhật ngưỡng cảnh báo AQI.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chất lượng không khí (AQI)</Text>

      {loading && <ActivityIndicator size="large" />}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {currentAQI && !loading && (
        <View style={[styles.card, { backgroundColor: currentAQI.color }]}>
          <Text style={styles.aqiValue}>AQI: {currentAQI.value}</Text>
          <Text style={styles.level}>Mức độ: {currentAQI.level}</Text>
          <Text style={styles.advice}>{currentAQI.advice}</Text>
        </View>
      )}

      <View style={styles.thresholdBox}>
        <Text style={styles.subtitle}>Ngưỡng cảnh báo AQI</Text>
        <TextInput
          style={styles.input}
          value={inputThreshold}
          onChangeText={setInputThreshold}
          keyboardType="numeric"
        />
        <Button title="Lưu ngưỡng cảnh báo" onPress={handleSaveThreshold} />
        <Text style={styles.note}>
          Khi AQI vượt ngưỡng này, ứng dụng sẽ gửi thông báo cảnh báo.
        </Text>
      </View>

      <View style={{ height: 16 }} />
      <Button title="Làm mới AQI" onPress={fetchAQI} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  error: { color: 'red', marginVertical: 8 },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  aqiValue: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  level: { fontSize: 18, marginBottom: 4 },
  advice: { fontSize: 14 },
  thresholdBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
  },
  subtitle: { fontWeight: 'bold', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  note: { fontSize: 12, color: '#555' },
});
