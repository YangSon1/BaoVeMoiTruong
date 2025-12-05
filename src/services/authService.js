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

// Giả lập độ trễ mạng (để loading xoay xoay cho đẹp)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// 5. Đăng nhập Google (Giả lập)
export async function loginWithGoogle() {
  await delay(1500); // Giả lập chờ 1.5s
  
  const googleUser = {
    id: 'google_user_demo_id', // ID cố định cho demo
    email: 'google_user@gmail.com',
    password: '', // Không cần pass
  };

  // Kiểm tra xem user Google này đã có trong DB chưa, nếu chưa thì tạo profile
  const users = await getAllUsers();
  const exists = users.find(u => u.email === googleUser.email);
  
  if (!exists) {
    users.push(googleUser);
    await saveAllUsers(users);
    
    // Tự động tạo profile cho user Google này
    await saveUserProfile(googleUser.id, {
      id: googleUser.id,
      email: googleUser.email,
      name: 'Google User',
      avatar: null, 
      defaultLocation: null,
      phone: '',
      historyReports: [],
      historyChats: [],
      allowLocation: false,
    });
  }

  return googleUser;
}

// 6. Đăng nhập Facebook (Giả lập)
export async function loginWithFacebook() {
  await delay(1500); 

  const fbUser = {
    id: 'fb_user_demo_id',
    email: 'fb_user@facebook.com',
    password: '',
  };

  const users = await getAllUsers();
  const exists = users.find(u => u.email === fbUser.email);

  if (!exists) {
    users.push(fbUser);
    await saveAllUsers(users);

    // Tự động tạo profile cho user Facebook
    await saveUserProfile(fbUser.id, {
      id: fbUser.id,
      email: fbUser.email,
      name: 'Facebook User',
      avatar: null,
      defaultLocation: null,
      phone: '',
      historyReports: [],
      historyChats: [],
      allowLocation: false,
    });
  }

  return fbUser;
}
