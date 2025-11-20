// src/screens/Waste/WasteGuideScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  getWasteCategories,
  getWasteByCategory,
  searchWasteByName,
  suggestCategoryByDescription,
} from '../../services/wasteService';

export default function WasteGuideScreen() {
  const categories = getWasteCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [description, setDescription] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState(null);

  const itemsByCategory = getWasteByCategory(selectedCategory);
  const searchResults = searchWasteByName(searchText);

  const handleSuggest = () => {
    const cat = suggestCategoryByDescription(description);
    setSuggestedCategory(cat);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text>Loại rác: {item.category}</Text>
      <Text style={styles.handling}>Cách xử lý: {item.handling}</Text>
      {item.dropPoints && item.dropPoints.length > 0 ? (
        <View style={styles.dropPointsBox}>
          <Text style={styles.dropPointsTitle}>Điểm thu gom gợi ý:</Text>
          {item.dropPoints.map((p, idx) => (
            <Text key={idx}>• {p}</Text>
          ))}
        </View>
      ) : (
        <Text style={styles.note}>
          Chưa có điểm thu gom cụ thể, vui lòng hỏi chính quyền địa phương.
        </Text>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // nếu header cao hơn có thể tăng số này
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Hướng dẫn xử lý rác</Text>

        {/* 3.1.1: Chọn loại rác */}
        <Text style={styles.sectionTitle}>Chọn loại rác</Text>
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === 'all' && styles.categoryTextActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                selectedCategory === cat && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat && styles.categoryTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={itemsByCategory}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={<Text>Không có vật phẩm nào cho loại này.</Text>}
          style={{ marginBottom: 16 }}
          scrollEnabled={false} // để ScrollView cha lo cuộn
        />

        {/* 3.2.1: Tìm kiếm theo tên vật phẩm */}
        <Text style={styles.sectionTitle}>Tìm kiếm theo tên vật phẩm</Text>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: chai nhựa, pin tiểu, khẩu trang..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            searchText ? <Text>Không tìm thấy vật phẩm phù hợp.</Text> : null
          }
          style={{ maxHeight: 200, marginBottom: 16 }}
          scrollEnabled={false}
        />

        {/* 3.2.2: AI gợi ý dựa trên mô tả */}
        <Text style={styles.sectionTitle}>AI gợi ý phân loại từ mô tả</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Mô tả vật phẩm, ví dụ: 'chai nước suối bằng nhựa đã dùng rồi'..."
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <Button title="Gợi ý phân loại" onPress={handleSuggest} />

        {suggestedCategory && (
          <Text style={styles.suggestText}>
            Gợi ý: Vật phẩm này có thể thuộc loại rác:{' '}
            <Text style={{ fontWeight: 'bold' }}>{suggestedCategory}</Text>
          </Text>
        )}

        <Text style={styles.footerNote}>
          
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // để ScrollView cuộn được
    padding: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 8, marginBottom: 4 },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  categoryButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2e7d32',
    marginRight: 6,
    marginBottom: 6,
  },
  categoryButtonActive: {
    backgroundColor: '#2e7d32',
  },
  categoryText: { fontSize: 12, color: '#2e7d32' },
  categoryTextActive: { color: '#fff' },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  itemName: { fontWeight: 'bold', marginBottom: 4 },
  handling: { marginTop: 4 },
  dropPointsBox: { marginTop: 4 },
  dropPointsTitle: { fontWeight: 'bold' },
  note: { fontSize: 12, color: '#555', marginTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  suggestText: { marginTop: 8 },
  footerNote: { marginTop: 8, fontSize: 11, color: '#777', marginBottom: 16 },
});
