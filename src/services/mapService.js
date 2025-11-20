import points from '../data/mapPoints.json';

// Lấy tất cả điểm
export function getAllEnvPoints() {
  return points;
}

// Lọc theo loại (nếu type === 'all' thì trả về hết)
export function getEnvPointsByType(type) {
  if (!type || type === 'all') return points;
  return points.filter(p => p.type === type);
}
