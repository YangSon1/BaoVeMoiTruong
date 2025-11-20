import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Cấu hình hiển thị khi app đang mở
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Xin quyền gửi thông báo (nếu chưa có)
async function ensurePermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
    return true;
  }
  const request = await Notifications.requestPermissionsAsync();
  return request.granted;
}

// Gửi thông báo khi AQI vượt ngưỡng
export async function sendAQIAlertNotification(aqiInfo) {
  const ok = await ensurePermission();
  if (!ok) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Cảnh báo AQI: ${aqiInfo.value} (${aqiInfo.level})`,
      body: `Không khí đang ${aqiInfo.level.toLowerCase()}. ${aqiInfo.advice}`,
      data: { aqi: aqiInfo.value },
    },
    trigger: null, // gửi ngay lập tức
  });
}
