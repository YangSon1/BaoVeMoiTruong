// src/services/userService.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY_PREFIX = 'ENV_APP_PROFILE_';

function getProfileKey(userId) {
  return PROFILE_KEY_PREFIX + userId;
}

export async function getUserProfile(userId) {
  const json = await AsyncStorage.getItem(getProfileKey(userId));
  return json ? JSON.parse(json) : null;
}

export async function saveUserProfile(userId, profile) {
  await AsyncStorage.setItem(getProfileKey(userId), JSON.stringify(profile));
}

export async function updateUserProfile(userId, partial) {
  const current = await getUserProfile(userId);
  const updated = { ...(current || {}), ...partial };
  await saveUserProfile(userId, updated);
  return updated;
}

// Xóa hồ sơ user (thông tin cá nhân, lịch sử…)
export async function deleteUserAccount(userId) {
  await AsyncStorage.removeItem(getProfileKey(userId));
  // Sau này nếu có thêm key khác (report, điểm, v.v.) thì xóa ở đây.
}
