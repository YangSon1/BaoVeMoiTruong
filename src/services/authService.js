// src/services/authService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserProfile } from './userService';

const USERS_KEY = 'ENV_APP_USERS'; // danh sách account đăng ký

async function getAllUsers() {
  const json = await AsyncStorage.getItem(USERS_KEY);
  return json ? JSON.parse(json) : [];
}

async function saveAllUsers(users) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Đăng ký
export async function register(email, password) {
  const users = await getAllUsers();
  const existed = users.find(u => u.email === email);
  if (existed) {
    throw new Error('Email đã được đăng ký');
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password, // demo: thực tế nên mã hóa
  };

  users.push(newUser);
  await saveAllUsers(users);

  // tạo hồ sơ mặc định
  await saveUserProfile(newUser.id, {
    id: newUser.id,
    email: newUser.email,
    name: 'Người dùng mới',
    avatar: null,
    defaultLocation: null,
    phone: '',
    historyReports: [],
    historyChats: [],
    allowLocation: false,
  });

  return newUser;
}

// Đăng nhập
export async function login(email, password) {
  const users = await getAllUsers();
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) {
    throw new Error('Sai email hoặc mật khẩu');
  }
  return found;
}

// Quên mật khẩu (mock)
export async function resetPassword(email) {
  const users = await getAllUsers();
  const found = users.find(u => u.email === email);
  if (!found) {
    throw new Error('Email chưa được đăng ký');
  }
  // Demo: coi như đã gửi mail
  return true;
}

// 🔥 HÀM MỚI: xóa account đăng nhập (email + password)
export async function deleteAuthUserById(userId) {
  const users = await getAllUsers();
  const filtered = users.filter(u => u.id !== userId);
  await saveAllUsers(filtered);
}
