// Mock: tính AQI dựa trên vĩ độ/kinh độ cho vui, không phải dữ liệu thật

// Hàm đơn giản để tạo số "giống AQI" từ lat/lng
function pseudoRandomAQI(lat, lng) {
  const base = Math.abs(Math.sin(lat) * 100 + Math.cos(lng) * 80);
  const aqi = Math.round((base % 250) + 10); // 10–260
  return aqi;
}

// Lấy AQI theo vị trí (GPS hoặc vị trí mặc định)
export async function getAQIByLocation(lat, lng) {
  // Sau này bạn có thể gọi API thật ở đây.
  const aqi = pseudoRandomAQI(lat, lng);
  return aqi;
}
