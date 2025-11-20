// src/store/userContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as authLogin, register as authRegister, resetPassword, deleteAuthUserById } from '../services/authService';
import { getUserProfile, updateUserProfile, deleteUserAccount } from '../services/userService';

const UserContext = createContext(null);
const CURRENT_USER_KEY = 'ENV_APP_CURRENT_USER';

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);        // thông tin account (id, email, isGuest...)
  const [profile, setProfile] = useState(null);  // thông tin hồ sơ (name, avatar, location...)
  const [loading, setLoading] = useState(true);

  // Load user hiện tại từ AsyncStorage khi mở app
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const json = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (json) {
          const savedUser = JSON.parse(json);
          setUser(savedUser);
          // nếu không phải guest thì load profile
          if (!savedUser.isGuest) {
            const p = await getUserProfile(savedUser.id);
            setProfile(p);
          }
        }
      } catch (e) {
        console.warn('Lỗi load user', e);
      } finally {
        setLoading(false);
      }
    };
    loadCurrentUser();
  }, []);

  // Lưu user hiện tại mỗi khi thay đổi
  const persistUser = async (userObj) => {
    if (userObj) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
    } else {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
    }
  };

  // Đăng ký
  const register = async (email, password) => {
    const account = await authRegister(email, password);
    setUser({ id: account.id, email: account.email, isGuest: false });
    const p = await getUserProfile(account.id);
    setProfile(p);
    await persistUser({ id: account.id, email: account.email, isGuest: false });
  };

  // Đăng nhập
  const login = async (email, password) => {
    const account = await authLogin(email, password);
    setUser({ id: account.id, email: account.email, isGuest: false });
    const p = await getUserProfile(account.id);
    setProfile(p);
    await persistUser({ id: account.id, email: account.email, isGuest: false });
  };

  // Đăng nhập guest
  const loginAsGuest = async () => {
    const guest = { id: 'guest', name: 'Khách', isGuest: true };
    setUser(guest);
    setProfile(null); // guest không có profile chi tiết
    await persistUser(guest);
  };

  // Đăng xuất
  const logout = async () => {
    setUser(null);
    setProfile(null);
    await persistUser(null);
  };

  // Quên mật khẩu (mock)
  const requestResetPassword = async (email) => {
    await resetPassword(email);
  };

  // Cập nhật hồ sơ (tên, avatar, liên hệ, khu vực...)
  const updateProfileInfo = async (partial) => {
    if (!user || user.isGuest) return;
    const updated = await updateUserProfile(user.id, partial);
    setProfile(updated);
  };

  // Cập nhật quyền chia sẻ vị trí
  const setAllowLocation = async (allow) => {
    if (!user || user.isGuest) return;
    const updated = await updateUserProfile(user.id, { allowLocation: allow });
    setProfile(updated);
  };

  // Xóa tài khoản
const removeAccount = async () => {
  if (!user || user.isGuest) {
    await logout();
    return;
  }

  // 1. Xóa hồ sơ + dữ liệu gắn với user
  await deleteUserAccount(user.id);

  // 2. Xóa tài khoản đăng nhập (email + password)
  await deleteAuthUserById(user.id);

  // 3. Đăng xuất & xóa user hiện tại khỏi CURRENT_USER_KEY
  await logout();
};

  const value = {
    user,
    profile,
    loading,
    register,
    login,
    loginAsGuest,
    logout,
    requestResetPassword,
    updateProfileInfo,
    setAllowLocation,
    removeAccount,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
