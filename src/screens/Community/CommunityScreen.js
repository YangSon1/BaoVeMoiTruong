// src/screens/Community/CommunityScreen.js
import React, { useEffect, useState, useCallback } from 'react';
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
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../store/userContext';
import ImagePickerBox from '../../components/ImagePickerBox';
import {
  getAllPosts,
  createPost,
  likePost,
} from '../../services/communityService';
import { getReports } from '../../services/reportService';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CommunityScreen({ navigation }) {
  const { user, profile } = useUser();
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState('all'); // all | my-area

  // State cho thống kê biểu đồ
  const [chartData, setChartData] = useState({
    new: 0,
    processing: 0,
    done: 0,
    total: 0,
    max: 1 // Để tính tỷ lệ chiều cao cột
  });

  const [recycledAmount, setRecycledAmount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const userArea = profile?.defaultLocation || null;

  const loadPosts = async () => {
    const list = await getAllPosts();
    setPosts(list);
  };

  // 👇 Hàm tính toán số liệu cho Biểu đồ
  const loadCommunityStats = async () => {
    try {
      const allReports = await getReports();
      
      // Đếm số lượng theo trạng thái
      let countNew = 0;
      let countProcessing = 0;
      let countDone = 0;

      allReports.forEach(r => {
        const s = r.status || 'Đã nhận';
        if (s === 'Đã nhận') countNew++;
        else if (s === 'Đang xử lý') countProcessing++;
        else if (s === 'Hoàn thành') countDone++;
      });

      // Tìm giá trị lớn nhất để vẽ cột cao nhất (tránh chia cho 0)
      const maxValue = Math.max(countNew, countProcessing, countDone, 1);

      setChartData({
        new: countNew,
        processing: countProcessing,
        done: countDone,
        total: allReports.length,
        max: maxValue
      });

      // Giả lập rác tái chế
      setRecycledAmount(1200 + (allReports.length * 5));

    } catch (error) {
      console.log('Lỗi tải stats:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPosts();
      loadCommunityStats();
    }, [])
  );

  // 👇 2. HÀM XỬ LÝ XUẤT PDF (FR-13.1.3)
  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      
      // Lấy dữ liệu mới nhất
      const reports = await getReports();
      const dateStr = new Date().toLocaleDateString('vi-VN');

      // Tạo nội dung HTML cho báo cáo
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: 'Helvetica', sans-serif; padding: 20px; }
            h1 { text-align: center; color: #2E7D32; margin-bottom: 5px; }
            h3 { text-align: center; color: #555; margin-top: 0; }
            .meta { margin-bottom: 20px; font-style: italic; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; }
            th { background-color: #E8F5E9; color: #2E7D32; }
            .status-new { color: #555; font-weight: bold; }
            .status-processing { color: #F57F17; font-weight: bold; }
            .status-done { color: #2E7D32; font-weight: bold; }
            .footer { margin-top: 30px; text-align: right; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>BÁO CÁO TỔNG HỢP VI PHẠM MÔI TRƯỜNG</h1>
          <h3>Cộng đồng Chung tay Bảo vệ Môi trường</h3>
          
          <div class="meta">
            <p>Ngày xuất báo cáo: ${dateStr}</p>
            <p>Người lập: ${profile?.name || 'Admin'}</p>
            <p>Tổng số vụ việc: ${reports.length}</p>
          </div>

          <table>
            <tr>
              <th style="width: 5%">STT</th>
              <th style="width: 30%">Nội dung vi phạm</th>
              <th style="width: 25%">Vị trí (Tọa độ)</th>
              <th style="width: 20%">Ngày gửi</th>
              <th style="width: 20%">Trạng thái</th>
            </tr>
            ${reports.map((r, index) => {
              // Xử lý hiển thị ngày
              const d = new Date(r.timestamp || r.createdAt || Date.now()).toLocaleDateString('vi-VN');
              // Xử lý vị trí
              const loc = r.location ? `${r.location.latitude.toFixed(4)}, ${r.location.longitude.toFixed(4)}` : 'Chưa xác định';
              // Xử lý trạng thái class
              let statusClass = 'status-new';
              if (r.status === 'Đang xử lý') statusClass = 'status-processing';
              if (r.status === 'Hoàn thành') statusClass = 'status-done';

              return `
                <tr>
                  <td>${index + 1}</td>
                  <td>${r.title || r.description}</td>
                  <td>${loc}</td>
                  <td>${d}</td>
                  <td class="${statusClass}">${r.status || 'Đã nhận'}</td>
                </tr>
              `;
            }).join('')}
          </table>

          <div class="footer">
            <p>Xác nhận của cơ quan quản lý</p>
            <br><br><br>
            <p>__________________________</p>
          </div>
        </body>
        </html>
      `;

      // Tạo file PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // Chia sẻ/Lưu file
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });

    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xuất file PDF.');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

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

  // 👇 Component con: Cột biểu đồ
  const ChartBar = ({ label, value, color, max }) => {
    // Tính chiều cao cột (tối đa 100px)
    const barHeight = (value / max) * 100; 
    return (
      <View style={styles.chartCol}>
        <Text style={styles.chartValue}>{value}</Text>
        <View style={[styles.bar, { height: barHeight || 5, backgroundColor: color }]} />
        <Text style={styles.chartLabel}>{label}</Text>
      </View>
    );
  };

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

          {/* 👇 KHU VỰC BIỂU ĐỒ DASHBOARD (MỚI) */}
          <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTitle}>📊 Thống kê xử lý vi phạm</Text>
              {/* 👇 NÚT XUẤT PDF (MỚI) */}
              <TouchableOpacity 
                style={styles.exportButton} 
                onPress={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.exportText}>📄 Xuất PDF</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.chartSubTitle}>Tổng số: {chartData.total} vụ</Text>
            </View>
            
            <View style={styles.chartBody}>
              {/* Cột 1: Mới */}
              <ChartBar 
                label="Đã nhận" 
                value={chartData.new} 
                color="#757575" 
                max={chartData.max} 
              />
              {/* Cột 2: Đang xử lý */}
              <ChartBar 
                label="Đang xử lý" 
                value={chartData.processing} 
                color="#FF9800" 
                max={chartData.max} 
              />
              {/* Cột 3: Hoàn thành */}
              <ChartBar 
                label="Hoàn thành" 
                value={chartData.done} 
                color="#4CAF50" 
                max={chartData.max} 
              />
            </View>

            {/* Thông số rác tái chế */}
            <View style={styles.recycleBox}>
              <Text style={styles.recycleLabel}>♻️ Rác thải đã tái chế:</Text>
              <Text style={styles.recycleValue}>{recycledAmount} kg</Text>
            </View>
          </View>

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

  // 👇 Styles cho Biểu đồ (Chart)
  chartContainer: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 20,
    elevation: 3, borderWidth: 1, borderColor: '#eee',
    shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1, shadowRadius:4
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  chartTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chartSubTitle: { fontSize: 12, color: '#666', fontStyle: 'italic' },
  
  // 👇 Style nút xuất PDF
  exportButton: {
    backgroundColor: '#1976D2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 5,
    flexDirection: 'row', alignItems: 'center'
  },
  exportText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },

  chartBody: { 
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', 
    height: 140, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eee' 
  },
  chartCol: { alignItems: 'center', width: 60 },
  bar: { width: 30, borderRadius: 4, marginBottom: 5 },
  chartValue: { fontSize: 12, fontWeight: 'bold', marginBottom: 2, color: '#555' },
  chartLabel: { fontSize: 10, color: '#666', textAlign: 'center' },

  recycleBox: { 
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
    marginTop: 15, backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8 
  },
  recycleLabel: { fontSize: 14, color: '#333', marginRight: 5 },
  recycleValue: { fontSize: 16, fontWeight: 'bold', color: '#2E7D32' },

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
