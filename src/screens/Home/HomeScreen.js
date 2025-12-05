import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  Alert 
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../store/userContext';
import { getReportsByUser } from '../../services/reportService';
import { ARTICLES, DAILY_TIPS } from '../../data/learningData';

export default function HomeScreen({ navigation }) {
  const { user, profile } = useUser();
  const [dailyTip, setDailyTip] = useState('');

  // State cho thống kê
  const [reportCount, setReportCount] = useState(0);
  const [wasteCount, setWasteCount] = useState(0);

  // Random mẹo sống xanh khi vào màn hình
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * DAILY_TIPS.length);
    setDailyTip(DAILY_TIPS[randomIndex]);
  }, []);

  // 2. 🔥 TẢI DỮ LIỆU THỐNG KÊ (MỚI)
  // Dùng useFocusEffect để khi quay lại trang chủ là số liệu tự cập nhật ngay
  useFocusEffect(
    useCallback(() => {
      const fetchStats = async () => {
        if (user?.id) {
          try {
            const reports = await getReportsByUser(user.id);
            // Kiểm tra kỹ xem reports có phải mảng không
            const count = Array.isArray(reports) ? reports.length : 0;
            console.log(`🏠 Home Stats - User: ${user.id}, Reports Found: ${count}`);
            setReportCount(count);
            
            setWasteCount(profile?.wasteCount || 5); 
          } catch (error) {
            console.log("Lỗi fetchStats:", error);
          }
        }
      };
      fetchStats();
    }, [user, profile])
  );

  // 👇 2. Hàm render thẻ bài viết (giống bên Community cũ)
  const renderLibraryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.libCard}
      onPress={() => Alert.alert(item.title, item.content)} 
    >
      <Image source={{ uri: item.image }} style={styles.libImage} />
      <View style={styles.libTagContainer}>
        <Text style={styles.libTag}>{item.type}</Text>
      </View>
      <Text style={styles.libTitle} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      {/* Header Chào mừng */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Xin chào, 👋</Text>
          <Text style={styles.username}>{profile?.name || 'Người dùng mới'}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
           <Text style={styles.pointsBadge}>💎 {profile?.points || 0} điểm</Text>
        </TouchableOpacity>
      </View>

      {/*  KHU VỰC THỐNG KÊ CÁ NHÂN*/}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{profile?.points || 0}</Text>
          <Text style={styles.statLabel}>Điểm thưởng</Text>
        </View>
        <View style={[styles.statBox, styles.statBorder]}>
          <Text style={styles.statNumber}>{reportCount}</Text>
          <Text style={styles.statLabel}>Báo cáo gửi</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{wasteCount}</Text>
          <Text style={styles.statLabel}>Lần phân loại</Text>
        </View>
      </View>

      {/* 2. FR-11.1.3: GỢI Ý HÀNH ĐỘNG MỖI NGÀY*/}
      <View style={styles.tipCard}>
        <View style={styles.tipHeader}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={styles.tipTitle}>Mẹo sống xanh hôm nay</Text>
        </View>
        <Text style={styles.tipContent}>"{dailyTip}"</Text>
        <Text style={styles.tipFooter}>Hãy thử thực hiện ngay nhé!</Text>
      </View>

      {/* 👇 3. KHU VỰC THƯ VIỆN KIẾN THỨC (MỚI) */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>📚 Kiến thức Xanh</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Library')}>
            <Text style={styles.seeAllText}>Xem tất cả ➔</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={ARTICLES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={renderLibraryItem}
          style={styles.listStyle}
        />
      </View>
      {/* ========================================= */}

      {/* 👇 KHU VỰC QUIZ GAME (MỚI) */}
      <View style={styles.quizBanner}>
        <View style={styles.quizContent}>
          <Text style={styles.quizTitle}>🧩 Thử thách kiến thức</Text>
          <Text style={styles.quizDesc}>Trả lời đúng câu hỏi để nhận ngay 30 điểm thưởng!</Text>
          <TouchableOpacity 
            style={styles.quizButton}
            onPress={() => navigation.navigate('Quiz')}
          >
            <Text style={styles.quizButtonText}>Bắt đầu</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.quizEmoji}>🏆</Text>
      </View>
      {/* ============================== */}

      {/* Các phần khác của trang chủ (ví dụ: AQI, Gợi ý...) sẽ thêm sau */}
      <View style={styles.placeholderBox}>
        <Text style={{color: '#666'}}>Khu vực hiển thị chỉ số AQI (Đang phát triển)</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  
  // Header styles
  header: { marginBottom: 10, marginTop: 10 },
  greeting: { fontSize: 16, color: '#666' },
  username: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32' },
  introText: { fontSize: 14, color: '#555', marginBottom: 20, fontStyle: 'italic' },

  // 👇 Styles cho phần Thống kê
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3, // Bóng đổ Android
    shadowColor: '#000', // Bóng đổ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee'
  },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#eee' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4 },

  // 👇 Styles cho Daily Tip (Mới)
  tipCard: {
    backgroundColor: '#FFF8E1', // Màu vàng nhạt
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#FFC107', // Viền vàng đậm
    elevation: 2,
  },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipIcon: { fontSize: 20, marginRight: 8 },
  tipTitle: { fontSize: 16, fontWeight: 'bold', color: '#F57F17' },
  tipContent: { fontSize: 18, fontStyle: 'italic', color: '#333', lineHeight: 26, marginBottom: 8 },
  tipFooter: { fontSize: 12, color: '#888', textAlign: 'right' },

  // 👇 Styles cho phần Thư viện
  sectionContainer: { marginBottom: 24 },
  sectionHeaderRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 12 
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeAllText: { fontSize: 14, color: '#1976d2', fontWeight: '600' },
  
  listStyle: { paddingBottom: 5 }, // Tránh bị cắt bóng đổ
  
  libCard: {
    width: 150, 
    marginRight: 12, 
    backgroundColor: '#fff',
    borderRadius: 8, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: '#eee',
    elevation: 3, // Bóng đổ Android
    shadowColor: '#000', // Bóng đổ iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    paddingBottom: 10
  },
  libImage: { width: '100%', height: 100, resizeMode: 'cover' },
  libTagContainer: { 
    position: 'absolute', top: 6, left: 6, 
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, borderRadius: 4, paddingVertical: 2
  },
  libTag: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  libTitle: { fontSize: 14, fontWeight: '600', paddingHorizontal: 8, marginTop: 8, color: '#333' },

  // Placeholder styles
  placeholderBox: {
    height: 100, backgroundColor: '#f5f5f5', 
    borderRadius: 8, justifyContent: 'center', alignItems: 'center',
    borderStyle: 'dashed', borderWidth: 1, borderColor: '#ccc'
  },

  quizBanner: {
    flexDirection: 'row',
    backgroundColor: '#FFF3E0', // Màu cam nhạt
    borderRadius: 12,
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE0B2'
  },
  quizContent: { flex: 1 },
  quizTitle: { fontSize: 18, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  quizDesc: { fontSize: 13, color: '#BF360C', marginBottom: 12 },
  quizButton: { 
    backgroundColor: '#EF6C00', paddingVertical: 8, paddingHorizontal: 16, 
    borderRadius: 20, alignSelf: 'flex-start' 
  },
  quizButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  quizEmoji: { fontSize: 40, marginLeft: 10 },
});