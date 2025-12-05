// src/navigation/AuthNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import GuestScreen from '../screens/Auth/GuestScreen';
import MockSocialLoginScreen from '../screens/Auth/MockSocialLoginScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Đăng nhập' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Đăng ký' }}
      />
      <Stack.Screen
        name="Guest"
        component={GuestScreen}
        options={{ title: 'Chế độ khách' }}
      />
      <Stack.Screen 
        name="MockSocialLogin" 
        component={MockSocialLoginScreen} 
        options={{ headerShown: false }} // Ẩn header mặc định để dùng header fake của ta
      />
    </Stack.Navigator>
  );
}
