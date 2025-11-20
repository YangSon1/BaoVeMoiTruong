// src/navigation/RootNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import MainTabNavigator from './MainTabNavigator';
import { useUser } from '../store/userContext';
import PostDetailScreen from '../screens/Community/PostDetailScreen';

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
        </>
      )}
    </Stack.Navigator>
  );
}
