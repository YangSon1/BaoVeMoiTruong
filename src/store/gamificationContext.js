// src/store/GamificationContext.js
import React, { createContext, useContext } from 'react';
import { Alert } from 'react-native';
import { useUser } from './userContext';
import { addPoints as serviceAddPoints, redeemReward as serviceRedeemReward, REWARDS } from '../services/gamificationService';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const { user, updateProfileInfo } = useUser();

  // Hàm gọi khi user làm việc tốt (Báo cáo, v.v.)
  const earnPoints = async (actionType) => {
    if (!user || user.isGuest) return;

    try {
      const result = await serviceAddPoints(user.id, actionType);
      
      // Cập nhật ngay lên giao diện
      if (result) {
        await updateProfileInfo({ 
          points: result.newPoints, 
          rank: result.newRank, 
          badgeIcon: result.badge 
        });
        
        Alert.alert('Thưởng điểm 🎉', `+${result.added} điểm!\nDanh hiệu: ${result.newRank}`);
      }
    } catch (error) {
      console.log('Lỗi cộng điểm:', error);
    }
  };

  // Hàm gọi khi user đổi quà
  const exchangeGift = async (reward) => {
    if (!user) return;
    try {
      const updated = await serviceRedeemReward(user.id, reward.id);
      
      // Cập nhật điểm mới lên giao diện
      await updateProfileInfo({ points: updated.points });
      
      Alert.alert('Thành công', `Đã đổi quà: ${reward.name}. Mã voucher đã gửi về email.`);
    } catch (error) {
      Alert.alert('Không thành công', error.message);
    }
  };

  return (
    <GamificationContext.Provider value={{ rewards: REWARDS, earnPoints, exchangeGift }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}