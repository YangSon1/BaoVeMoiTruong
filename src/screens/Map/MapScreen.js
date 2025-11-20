import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { getEnvPointsByType } from '../../services/mapService';

const FILTERS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Rác tái chế', value: 'recycle' },
  { label: 'Rác điện tử', value: 'electronic' },
  { label: 'Pin', value: 'battery' },
  { label: 'Bãi rác', value: 'landfill' },
  { label: 'Nước / xử lý', value: 'water' }
];

export default function MapScreen() {
  const [selectedType, setSelectedType] = useState('all');

  const points = getEnvPointsByType(selectedType);

  // Trung tâm bản đồ (HCM)
  const initialRegion = {
    latitude: 10.776889,
    longitude: 106.700806,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bản đồ môi trường</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
      >
        {FILTERS.map(f => (
          <View key={f.value} style={styles.filterButton}>
            <Button
              title={f.label}
              onPress={() => setSelectedType(f.value)}
              color={selectedType === f.value ? '#2e7d32' : undefined}
            />
          </View>
        ))}
      </ScrollView>

      <MapView style={styles.map} initialRegion={initialRegion}>
        {points.map(p => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.lat, longitude: p.lng }}
            title={p.name}
            description={p.type}
          />
        ))}
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Thông tin lớp dữ liệu</Text>
        <Text>- Hiển thị các điểm thu gom rác tái chế, rác điện tử, pin, bãi rác, trạm xử lý nước.</Text>
        <Text>- Bạn có thể lọc theo loại bằng thanh nút phía trên.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 8, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  filterRow: { marginBottom: 8 },
  filterButton: { marginRight: 8 },
  map: { flex: 1 },
  infoBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  infoTitle: { fontWeight: 'bold', marginBottom: 4 },
});
