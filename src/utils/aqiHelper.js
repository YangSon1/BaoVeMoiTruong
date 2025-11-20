// Chuyển giá trị AQI thành thông tin hiển thị (mức độ, màu, khuyến nghị)
export function getAQIInfo(aqi) {
  if (aqi <= 50) {
    return {
      value: aqi,
      level: 'Tốt',
      color: '#9CE69C',
      advice: 'Không khí trong lành, bạn có thể hoạt động bình thường ngoài trời.',
    };
  }
  if (aqi <= 100) {
    return {
      value: aqi,
      level: 'Trung bình',
      color: '#FFF59D',
      advice: 'Người nhạy cảm nên hạn chế thời gian ở ngoài trời lâu.',
    };
  }
  if (aqi <= 150) {
    return {
      value: aqi,
      level: 'Kém',
      color: '#FFCC80',
      advice: 'Đeo khẩu trang khi ra ngoài, hạn chế vận động mạnh ngoài trời.',
    };
  }
  if (aqi <= 200) {
    return {
      value: aqi,
      level: 'Xấu',
      color: '#FFAB91',
      advice: 'Nên ở trong nhà, đặc biệt là người già và trẻ nhỏ.',
    };
  }
  return {
    value: aqi,
    level: 'Rất xấu',
    color: '#EF9A9A',
    advice: 'Hạn chế ra ngoài tối đa, đóng cửa sổ nếu có thể.',
  };
}
