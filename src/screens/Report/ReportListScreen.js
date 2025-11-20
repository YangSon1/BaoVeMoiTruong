// src/screens/Report/ReportListScreen.js
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
} from 'react-native';
import * as Location from 'expo-location';
import { useUser } from '../../store/userContext';
import {
  getReportsByUser,
  createReport,
  updateReportStatus,
} from '../../services/reportService';
import ImagePickerBox from '../../components/ImagePickerBox';

export default function ReportListScreen() {
  const { user, profile } = useUser();
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Load danh sách báo cáo khi mở màn hình
  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const list = await getReportsByUser(user?.id);
      setReports(list);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);

      if (!profile?.allowLocation) {
        Alert.alert(
          'Chưa bật quyền vị trí',
          'Vui lòng vào tab Cài đặt và bật "Cho phép sử dụng vị trí GPS".'
        );
        setLoadingLocation(false);
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Ứng dụng không được cấp quyền vị trí.');
        setLoadingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation(coords);
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi', 'Không lấy được vị trí hiện tại.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSubmitReport = async () => {
    if (!description.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập mô tả vi phạm.');
      return;
    }

    try {
      const data = {
        userId: user?.id || null,
        description: description.trim(),
        imageUri,
        location,
      };

      await createReport(data);
      Alert.alert('Thành công', 'Đã gửi báo cáo vi phạm.');
      setDescription('');
      setImageUri(null);
      setLocation(null);
      await loadReports();
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi', 'Không gửi được báo cáo.');
    }
  };

  const cycleStatus = (current) => {
    if (current === 'Đã nhận') return 'Đang xử lý';
    if (current === 'Đang xử lý') return 'Hoàn thành';
    return 'Hoàn thành';
  };

  const handleChangeStatus = async (report) => {
    const newStatus = cycleStatus(report.status);
    try {
      await updateReportStatus(report.id, newStatus);
      await loadReports();
    } catch (e) {
      console.warn(e);
      Alert.alert('Lỗi', 'Không cập nhật được trạng thái.');
    }
  };

  const renderReportItem = ({ item }) => (
    <View style={styles.reportCard}>
      <Text style={styles.reportTitle}>Báo cáo: {item.description}</Text>
      {item.imageUri && (
        <Text style={styles.reportLine}>Có đính kèm ảnh minh chứng.</Text>
      )}
      {item.location ? (
        <Text style={styles.reportLine}>
          Vị trí: ({item.location.latitude.toFixed(5)},{' '}
          {item.location.longitude.toFixed(5)})
        </Text>
      ) : (
        <Text style={styles.reportLine}>Vị trí: (chưa xác định)</Text>
      )}
      <Text style={styles.reportLine}>Trạng thái: {item.status}</Text>
      <Text style={styles.reportTime}>
        Thời gian: {new Date(item.createdAt).toLocaleString()}
      </Text>
      <Button
        title="Cập nhật trạng thái (mock)"
        onPress={() => handleChangeStatus(item)}
      />
    </View>
  );

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
        <Text style={styles.title}>Báo cáo vi phạm môi trường</Text>

        {/* Form tạo báo cáo mới */}
        <Text style={styles.sectionTitle}>Tạo báo cáo mới</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Mô tả vi phạm: xả rác, đốt rác, khói bụi, tiếng ồn..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Lấy vị trí GPS */}
        <View style={styles.rowBetween}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Vị trí hiện tại (GPS)</Text>
            {location ? (
              <Text>
                {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.note}>Chưa lấy vị trí.</Text>
            )}
          </View>
          <Button
            title={loadingLocation ? 'Đang lấy...' : 'Lấy vị trí'}
            onPress={handleGetLocation}
          />
        </View>

        {/* Chọn ảnh */}
        <View style={{ marginTop: 8, marginBottom: 8 }}>
          <ImagePickerBox imageUri={imageUri} onChangeImage={setImageUri} />
        </View>

        <Button title="Gửi báo cáo" onPress={handleSubmitReport} />

        {/* Danh sách báo cáo đã gửi */}
        <Text style={styles.sectionTitle}>Danh sách báo cáo của bạn</Text>
        {loading ? (
          <Text>Đang tải...</Text>
        ) : (
          <FlatList
            data={reports}
            keyExtractor={item => item.id}
            renderItem={renderReportItem}
            ListEmptyComponent={
              <Text>Bạn chưa gửi báo cáo nào.</Text>
            }
            scrollEnabled={false} // để ScrollView cha lo cuộn, không bị xung đột
            style={{ marginTop: 8, marginBottom: 16 }}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // cho ScrollView cuộn được
    padding: 12,
    backgroundColor: '#fff',
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { fontWeight: 'bold', marginBottom: 4 },
  note: { fontSize: 12, color: '#777' },
  reportCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  reportTitle: { fontWeight: 'bold', marginBottom: 4 },
  reportLine: { fontSize: 13 },
  reportTime: { fontSize: 11, color: '#777', marginBottom: 4 },
});
