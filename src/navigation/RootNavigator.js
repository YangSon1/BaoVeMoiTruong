// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useUser } from '../store/userContext';
import PostDetailScreen from '../screens/Community/PostDetailScreen';
import RewardScreen from '../screens/Gamification/RewardScreen';
import LibraryScreen from '../screens/Learning/LibraryScreen';
import QuizScreen from '../screens/Learning/QuizScreen';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { user } = useUser();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {/* Màn chính có tab */}
          <Stack.Screen name="Main" component={MainTabNavigator} />

          {/* Màn mở chi tiết bài viết */}
          <Stack.Screen
            name="PostDetail"
            component={PostDetailScreen}
            options={{ headerShown: true, title: 'Bài viết' }}
          />

          <Stack.Screen 
            name="Rewards" 
            component={RewardScreen} 
            options={{ headerShown: true, title: 'Đổi quà & Huy hiệu' }} 
          />

          <Stack.Screen 
            name="Library" 
            component={LibraryScreen} 
            options={{ 
              headerShown: true, 
              title: 'Thư viện Kiến thức',
              headerStyle: { backgroundColor: '#0288D1' },
              headerTintColor: '#fff',
            }} 
          />

          <Stack.Screen 
            name="Quiz" 
            component={QuizScreen} 
            options={{ title: 'Trắc nghiệm vui', headerShown: true }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}
