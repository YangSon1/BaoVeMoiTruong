// src/services/gamificationService.js
import { getUserProfile, updateUserProfile } from './userService';

// --- CẤU HÌNH ---

// FR-9.1.1: Điểm thưởng cho các hành động
export const ACTION_POINTS = {
  REPORT_VIOLATION: 20, // Báo cáo vi phạm
  CLASSIFY_WASTE: 10,   // Phân loại rác (Tra cứu)
  JOIN_CAMPAIGN: 50,    // Tham gia chiến dịch
  COMPLETE_QUIZ: 30,
};

// FR-9.1.2: Hệ thống huy hiệu
export const RANKS = [
  { name: 'Người mới', minPoints: 0, badge: '🌱' },
  { name: 'Người xanh', minPoints: 100, badge: '🌿' },
  { name: 'Chiến binh môi trường', minPoints: 500, badge: '🛡️' },
  { name: 'Thành phố sạch', minPoints: 1000, badge: '🏙️' },
];

// FR-9.1.3: Danh sách quà tặng
export const REWARDS = [
  { id: 'r1', name: 'Voucher 50k', cost: 200, icon: '🎫' },
  { id: 'r2', name: 'Sen đá mini', cost: 300, icon: '🌵' },
  { id: 'r3', name: 'Túi vải', cost: 400, icon: '👜' },
  { id: 'r4', name: 'Bình giữ nhiệt', cost: 800, icon: '🥤' },
];

// --- HÀM XỬ LÝ ---

function calculateRank(points) {
  // Tìm rank cao nhất mà user đạt được
  const rank = RANKS.slice().reverse().find(r => points >= r.minPoints);
  return rank || RANKS[0];
}

// Hàm cộng điểm
export async function addPoints(userId, actionType) {
  const profile = await getUserProfile(userId);
  if (!profile) return null;

  const pointsToAdd = ACTION_POINTS[actionType] || 0;
  const oldPoints = profile.points || 0;
  const newPoints = oldPoints + pointsToAdd;
  
  const newRankInfo = calculateRank(newPoints);

  // Cập nhật vào DB
  const updatedProfile = await updateUserProfile(userId, {
    points: newPoints,
    rank: newRankInfo.name,
    badgeIcon: newRankInfo.badge
  });

  return {
    added: pointsToAdd,
    newPoints,
    newRank: newRankInfo.name,
    badge: newRankInfo.badge
  };
}

// Hàm đổi quà
export async function redeemReward(userId, rewardId) {
  const profile = await getUserProfile(userId);
  const reward = REWARDS.find(r => r.id === rewardId);
  
  if (!reward) throw new Error('Quà không tồn tại');
  
  const currentPoints = profile.points || 0;
  if (currentPoints < reward.cost) {
    throw new Error(`Bạn cần thêm ${reward.cost - currentPoints} điểm nữa.`);
  }

  // Trừ điểm
  const newPoints = currentPoints - reward.cost;
  
  // Lưu lại (Giữ nguyên rank dù điểm giảm, hoặc tụt rank tùy logic của bạn)
  // Ở đây tôi giữ nguyên rank cũ để user không bị mất danh hiệu
  const updatedProfile = await updateUserProfile(userId, {
    points: newPoints,
  });

  return updatedProfile;
}