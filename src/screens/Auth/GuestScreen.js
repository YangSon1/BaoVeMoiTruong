import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GuestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chế độ khách</Text>
      <Text>- Không cần tài khoản.</Text>
      <Text>- Dữ liệu chỉ được lưu trên máy, không có đồng bộ.</Text>
      <Text>- Một số chức năng như thống kê dài hạn, đổi quà có thể bị hạn chế.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
});
