import AsyncStorage from '@react-native-async-storage/async-storage';

const REPORT_KEY = 'ENV_APP_REPORTS';

// Giả lập delay mạng
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Lấy tất cả báo cáo
export async function getReports() {
  try {
    const json = await AsyncStorage.getItem(REPORT_KEY);
    return json ? JSON.parse(json) : [];
  } catch (e) {
    return [];
  }
}

// 2. Lấy báo cáo của riêng User
export async function getReportsByUser(userId) {
  if (!userId) return [];
  const allReports = await getReports();
  // Lọc chỉ lấy bài của user này
  return allReports.filter(report => report.userId === userId);
}

// 3. Tạo báo cáo mới
export async function createReport(userId, data) {
  await delay(1000); 

  const reports = await getReports();
  
  const newReport = {
    id: Date.now().toString(),
    userId,
    title: data.title,
    description: data.description,
    location: data.location,
    imageUri: data.imageUri || null, 
    status: 'Đã nhận', // Trạng thái mặc định ban đầu
    timestamp: new Date().toISOString(),
  };

  // Thêm vào đầu danh sách
  reports.unshift(newReport);
  
  await AsyncStorage.setItem(REPORT_KEY, JSON.stringify(reports));
  return newReport;
}

// 4.Cập nhật trạng thái báo cáo
export async function updateReportStatus(reportId, newStatus) {
  await delay(500);

  // Lấy danh sách cũ
  const reports = await getReports();
  
  // Tìm báo cáo cần sửa
  const index = reports.findIndex(r => r.id === reportId);
  if (index === -1) {
    throw new Error('Không tìm thấy báo cáo');
  }

  // Cập nhật trạng thái mới
  reports[index].status = newStatus;

  // Lưu lại vào bộ nhớ
  await AsyncStorage.setItem(REPORT_KEY, JSON.stringify(reports));
  
  return reports[index];
}