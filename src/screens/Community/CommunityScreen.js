// src/screens/Community/CommunityScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useUser } from '../../store/userContext';
import ImagePickerBox from '../../components/ImagePickerBox';
import {
  getAllPosts,
  createPost,
  likePost,
} from '../../services/communityService';

export default function CommunityScreen({ navigation }) {
  const { user, profile } = useUser();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // all | my-area

  const userArea = profile?.defaultLocation || null;

  const loadPosts = async () => {
    const list = await getAllPosts();
    setPosts(list);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!content.trim()) {
      Alert.alert('Thiếu nội dung', 'Hãy viết gì đó trước khi đăng.');
      return;
    }

    const data = {
      userId: user.id,
      author: user.email || 'Người dùng',
      area: userArea || 'Chưa chọn khu vực',
      content,
      imageUri,
    };

    await createPost(data);
    setContent('');
    setImageUri(null);
    await loadPosts();
  };

  const handleLike = async (postId) => {
    await likePost(postId);
    await loadPosts();
  };

  const filteredPosts =
    filter === 'all'
      ? posts
      : posts.filter(p => p.area === userArea);

  const renderPost = ({ item }) => (
    <TouchableOpacity
      style={styles.postCard}
      onPress={() =>
        navigation.navigate('PostDetail', { post: item })
      }
    >
      <Text style={styles.author}>{item.author}</Text>
      <Text style={styles.area}>Nhóm khu vực: {item.area}</Text>
      <Text style={styles.content}>{item.content}</Text>

      {item.imageUri && (
        <Image source={{ uri: item.imageUri }} style={styles.postImg} />
      )}

      <View style={styles.row}>
        <TouchableOpacity onPress={() => handleLike(item.id)}>
          <Text>❤️ {item.likes}</Text>
        </TouchableOpacity>
        <Text> | </Text>
        <Text>💬 {item.comments.length}</Text>
        <Text> | </Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Chia sẻ', 'Đã chia sẻ bài viết này đến cộng đồng (mock).')}
        >
          <Text>🔗 Chia sẻ</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Cộng đồng sống xanh</Text>

          {/* ====== NHÓM CỘNG ĐỒNG THEO KHU VỰC (FR-8.1.3) ====== */}
          <View style={styles.groupBox}>
            <Text style={styles.groupTitle}>Nhóm cộng đồng của bạn</Text>
            {userArea ? (
              <>
                <Text style={styles.groupName}>{userArea}</Text>
                <Text style={styles.groupNote}>
                  Bạn đang thuộc nhóm cộng đồng theo khu vực: {userArea}. Các bài viết trong nhóm này sẽ ưu tiên hiển thị khi chọn bộ lọc "Nhóm của tôi".
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.groupName}>Chưa chọn khu vực</Text>
                <Text style={styles.groupNote}>
                  Hãy vào mục "Hồ sơ" để cập nhật phường/xã, quận/huyện. Ứng dụng sẽ dùng thông tin đó làm nhóm cộng đồng của bạn.
                </Text>
              </>
            )}
          </View>

          {/* ====== TẠO BÀI VIẾT MỚI (FR-8.1.1) ====== */}
          <Text style={styles.sub}>Tạo bài viết mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Chia sẻ mẹo sống xanh, hoạt động môi trường tại khu vực của bạn..."
            value={content}
            onChangeText={setContent}
            multiline
          />
          <ImagePickerBox imageUri={imageUri} onChangeImage={setImageUri} />
          <Button title="Đăng bài" onPress={handleCreatePost} />

          {/* ====== BỘ LỌC NHÓM CỘNG ĐỒNG (FR-8.1.3) ====== */}
          <Text style={styles.sub}>Bộ lọc bài viết</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setFilter('all')}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === 'all' && styles.filterTextActive,
                ]}
              >
                Tất cả bài
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'my-area' && styles.filterButtonActive,
              ]}
              onPress={() => {
                if (!userArea) {
                  Alert.alert(
                    'Chưa có khu vực',
                    'Vui lòng vào Hồ sơ để chọn phường/xã, quận/huyện.'
                  );
                  return;
                }
                setFilter('my-area');
              }}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === 'my-area' && styles.filterTextActive,
                ]}
              >
                Chỉ trong nhóm của tôi
              </Text>
            </TouchableOpacity>
          </View>

          {/* ====== DANH SÁCH BÀI VIẾT (FR-8.1.1 + 8.1.2) ====== */}
          <Text style={styles.sub}>Bài viết trong cộng đồng</Text>
          <FlatList
            data={filteredPosts}
            keyExtractor={item => item.id}
            renderItem={renderPost}
            scrollEnabled={false}
            style={{ marginVertical: 8 }}
            ListEmptyComponent={
              <Text>Chưa có bài viết nào trong bộ lọc hiện tại.</Text>
            }
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 12, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold' },

  groupBox: {
    marginTop: 12,
    marginBottom: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
  },
  groupTitle: { fontWeight: 'bold', marginBottom: 4 },
  groupName: { fontSize: 16, fontWeight: 'bold', color: '#2e7d32' },
  groupNote: { fontSize: 12, color: '#555', marginTop: 4 },

  sub: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    minHeight: 70,
    marginBottom: 8,
  },

  postCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  postImg: { width: '100%', height: 180, borderRadius: 8, marginTop: 8 },
  author: { fontWeight: 'bold' },
  area: { fontSize: 12, color: '#666', marginBottom: 4 },
  content: { marginBottom: 4 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },

  filterButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginRight: 8,
    marginTop: 4,
  },
  filterButtonActive: {
    backgroundColor: '#1976d2',
  },
  filterText: { fontSize: 12, color: '#1976d2' },
  filterTextActive: { color: '#fff' },
});
