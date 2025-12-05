import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import { useUser } from '../../store/userContext';
// 👇 1. Import thêm Gamification
import { useGamification } from '../../store/GamificationContext'; 
import {
  getReportsByUser,
  createReport,
  updateReportStatus,
} from '../../services/reportService';
import ImagePickerBox from '../../components/ImagePickerBox';

export default function ReportListScreen() {
  const { user, profile } = useUser();
  // 👇 2. Lấy hàm cộng điểm
  const { earnPoints } = useGamification();

  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  useEffect(() => {

    loadReports();

  }, [user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const list = await getReportsByUser(user?.id);
      const cleanList = (list || []).filter(item => item && typeof item === 'object');
      setReports(cleanList);
    } catch (e) {
      console.warn('Lỗi load reports:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
      if (!profile?.allowLocation) {
        Alert.alert('Thông báo', 'Vui lòng bật quyền vị trí trong cài đặt.');
        return;
      }
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Không được cấp quyền vị trí.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    } catch (e) {
      Alert.alert('Lỗi', 'Không lấy được vị trí.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!description.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập mô tả.');
      return;
    }

    try {
      const autoTitle = description.trim().substring(0, 50) + (description.length > 50 ? '...' : '');

      const data = {
        title: autoTitle,
        description: description.trim(),
        imageUri: imageUri || null,
        location: location || null,
      };

      await createReport(user?.id, data);
      
      Alert.alert('Thành công', 'Đã gửi báo cáo.');
      
      setDescription('');
      setImageUri(null);
      setLocation(null);
      
      await loadReports();
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi', 'Gửi thất bại.');
    }
  };

  // 🔥 HÀM QUAN TRỌNG: Cập nhật trạng thái và cộng điểm
  const handleChangeStatus = async (report) => {
    if (!report?.id) return;
    
    // Logic vòng lặp trạng thái: Đã nhận -> Đang xử lý -> Hoàn thành -> Đã nhận
    let newStatus = 'Đã nhận';
    if (report.status === 'Đã nhận') newStatus = 'Đang xử lý';
    else if (report.status === 'Đang xử lý') newStatus = 'Hoàn thành';
    
    try {
      // Cập nhật trạng thái
      await updateReportStatus(report.id, newStatus);
      
      // 👇 LOGIC CỘNG ĐIỂM Ở ĐÂY 👇
      // Nếu trạng thái mới là 'Hoàn thành' VÀ trạng thái cũ chưa phải 'Hoàn thành'
      if (newStatus === 'Hoàn thành' && report.status !== 'Hoàn thành') {
        await earnPoints('REPORT_VIOLATION'); // Cộng 20 điểm
      }

      await loadReports();
    } catch (e) {
      console.warn(e);
    }
  };

  const renderReportItem = ({ item }) => {
    if (!item) return null;

    // Màu sắc cho trạng thái
    let statusColor = '#333';
    if (item.status === 'Đang xử lý') statusColor = 'orange';
    if (item.status === 'Hoàn thành') statusColor = 'green';

    return (
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>
          Nội dung: {item?.description || item?.title || 'Không có mô tả'}
        </Text>
        
        {item?.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.reportImage} />
        ) : (
          <Text style={styles.noDataText}>⚪ Không có ảnh</Text>
        )}

        {item?.location ? (
          <Text style={styles.reportLine}>
            📍 {item.location.latitude?.toFixed(4)}, {item.location.longitude?.toFixed(4)}
          </Text>
        ) : (
          <Text style={styles.noDataText}>📍 Vị trí: Không xác định</Text>
        )}

        <View style={styles.divider} />
        
        <Text style={styles.reportLine}>
          Trạng thái: <Text style={{fontWeight:'bold', color:statusColor}}>{item?.status || 'Mới'}</Text>
        </Text>
        
        <Text style={styles.reportTime}>
          {new Date(item?.timestamp || item?.createdAt || Date.now()).toLocaleString()}
        </Text>

        <Button
          title="Đổi trạng thái (Test)"
          onPress={() => handleChangeStatus(item)}
        />
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Báo cáo vi phạm</Text>

        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Tạo báo cáo mới</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Mô tả vi phạm..."
            value={description}
            onChangeText={setDescription}
            multiline
          />

          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Vị trí (Tùy chọn)</Text>
              {location ? (
                <Text style={{color: 'green'}}>✅ Đã lấy GPS</Text>
              ) : (
                <Text style={styles.note}>Chưa chọn vị trí</Text>
              )}
            </View>
            <Button
              title={loadingLocation ? 'Đang lấy...' : '📍 Lấy GPS'}
              onPress={handleGetLocation}
            />
          </View>

          <View style={{ marginTop: 8, marginBottom: 8 }}>
            <ImagePickerBox imageUri={imageUri} onChangeImage={setImageUri} />
          </View>

          <Button title="Gửi báo cáo" onPress={handleSubmitReport} />
        </View>

        <Text style={styles.sectionTitle}>Lịch sử báo cáo</Text>
        {loading ? (
          <Text style={{textAlign: 'center', marginTop: 10}}>Đang tải...</Text>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={(item, index) => item?.id ? item.id.toString() : index.toString()}
            renderItem={renderReportItem}
            ListEmptyComponent={<Text style={styles.emptyText}>Chưa có báo cáo nào.</Text>}
            scrollEnabled={false} 
            style={{ marginTop: 8 }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 12, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center', color: '#333' },
  formContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#2E7D32' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: '#fafafa', textAlignVertical: 'top' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 4, color: '#555' },
  note: { fontSize: 12, color: '#999', fontStyle: 'italic' },
  reportCard: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 15, elevation: 2 },
  reportTitle: { fontWeight: 'bold', marginBottom: 6, fontSize: 16, color: '#333' },
  reportLine: { fontSize: 14, marginBottom: 4, color: '#555' },
  reportTime: { fontSize: 12, color: '#999', marginTop: 8, marginBottom: 8, textAlign: 'right' },
  reportImage: { width: '100%', height: 180, borderRadius: 8, marginBottom: 10, resizeMode: 'cover', backgroundColor: '#eee' },
  noDataText: { fontSize: 13, color: '#bbb', fontStyle: 'italic', marginBottom: 8 },
  divider: { height: 1, backgroundColor: '#f0f0f0', marginVertical: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' }
});