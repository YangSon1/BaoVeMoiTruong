// src/services/reportService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORTS_KEY = 'ENV_APP_REPORTS';

// Lấy toàn bộ danh sách báo cáo
export async function getAllReports() {
  const json = await AsyncStorage.getItem(REPORTS_KEY);
  return json ? JSON.parse(json) : [];
}

// Lưu lại danh sách xuống AsyncStorage
async function saveAllReports(reports) {
  await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

// Lấy danh sách báo cáo theo userId (nếu cần)
export async function getReportsByUser(userId) {
  const all = await getAllReports();
  if (!userId) return all;
  return all.filter(r => r.userId === userId);
}

// Tạo báo cáo mới
export async function createReport(reportData) {
  const all = await getAllReports();

  const newReport = {
    id: Date.now().toString(),
    userId: reportData.userId || null,
    description: reportData.description || '',
    imageUri: reportData.imageUri || null,
    location: reportData.location || null, // { latitude, longitude }
    status: 'Đã nhận',                      // trạng thái ban đầu
    createdAt: new Date().toISOString(),
  };

  all.unshift(newReport); // thêm lên đầu
  await saveAllReports(all);
  return newReport;
}

// Cập nhật trạng thái báo cáo
export async function updateReportStatus(reportId, newStatus) {
  const all = await getAllReports();
  const idx = all.findIndex(r => r.id === reportId);
  if (idx === -1) return null;
  all[idx].status = newStatus;
  await saveAllReports(all);
  return all[idx];
}
