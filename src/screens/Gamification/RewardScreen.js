// src/screens/Gamification/RewardScreen.js
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { useUser } from '../../store/userContext';
import { useGamification } from '../../store/GamificationContext';

export default function RewardScreen() {
  const { profile } = useUser();
  const { rewards, exchangeGift } = useGamification();

  const points = profile?.points || 0;
  const rank = profile?.rank || 'Người mới';
  const badge = profile?.badgeIcon || '🌱';

  const handlePressReward = (item) => {
    Alert.alert(
      'Xác nhận đổi quà',
      `Dùng ${item.cost} điểm để đổi lấy "${item.name}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Đổi ngay', onPress: () => exchangeGift(item) }
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.cardIcon}>{item.icon}</Text>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardCost}>{item.cost} điểm</Text>
      </View>
      <TouchableOpacity 
        style={[styles.btnRedeem, points < item.cost && styles.btnDisabled]}
        disabled={points < item.cost}
        onPress={() => handlePressReward(item)}
      >
        <Text style={styles.btnText}>Đổi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.header}>
        <Text style={styles.badgeLarge}>{badge}</Text>
        <View>
          <Text style={styles.rankText}>{rank}</Text>
          <Text style={styles.pointText}>Điểm tích lũy: {points}</Text>
        </View>
      </View>

      <Text style={styles.title}>Kho quà tặng</Text>

      <FlatList 
        data={rewards}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f2', padding: 15 },
  header: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', 
    padding: 20, borderRadius: 12, marginBottom: 20, elevation: 2 
  },
  badgeLarge: { fontSize: 40, marginRight: 15 },
  rankText: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' }, // Màu xanh lá
  pointText: { color: '#555', marginTop: 4 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    padding: 15, borderRadius: 10, marginBottom: 10
  },
  cardIcon: { fontSize: 32, marginRight: 15 },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600' },
  cardCost: { color: '#E65100', fontWeight: 'bold' }, // Màu cam
  
  btnRedeem: { backgroundColor: '#2E7D32', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 6 },
  btnDisabled: { backgroundColor: '#ccc' },
  btnText: { color: '#fff', fontWeight: 'bold' }
});