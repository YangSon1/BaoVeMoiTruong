import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Alert 
} from 'react-native';

// Import dữ liệu giả lập (đã tạo ở bước trước)
import { ARTICLES } from '../../data/learningData';

// Danh sách bộ lọc
const FILTERS = ['Tất cả', 'BÀI VIẾT', 'VIDEO', 'INFOGRAPHIC'];

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  // Logic lọc bài viết
  const filteredData = activeFilter === 'Tất cả' 
    ? ARTICLES 
    : ARTICLES.filter(item => item.type === activeFilter);

  const handlePressItem = (item) => {
    // Sau này có thể navigate sang màn hình chi tiết (WebView hoặc VideoPlayer)
    Alert.alert(item.title, item.content);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePressItem(item)}>
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <View style={styles.typeTag}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.snippet} numberOfLines={2}>{item.content}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* --- KHU VỰC BỘ LỌC NGANG --- */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* --- DANH SÁCH BÀI VIẾT --- */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Không tìm thấy nội dung phù hợp.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  
  // Style cho bộ lọc
  filterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 5,
    elevation: 2, // Bóng đổ Android
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  filterChipActive: {
    backgroundColor: '#0288D1', // Màu xanh dương
    borderColor: '#0288D1',
  },
  filterText: { color: '#666', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#fff' },

  // Style cho danh sách
  listContent: { padding: 12 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  cardImage: { width: 110, height: 110, resizeMode: 'cover' },
  cardContent: { flex: 1, padding: 10, justifyContent: 'center' },
  
  typeTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1F5FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  typeText: { fontSize: 10, color: '#0288D1', fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  snippet: { fontSize: 12, color: '#666' },
  
  emptyText: { textAlign: 'center', marginTop: 40, color: '#888' }
});