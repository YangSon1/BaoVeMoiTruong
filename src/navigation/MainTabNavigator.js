import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/Home/HomeScreen';
import AQIScreen from '../screens/AQI/AQIScreen';
import WasteGuideScreen from '../screens/Waste/WasteGuideScreen';
import ReportListScreen from '../screens/Report/ReportListScreen';
import CommunityScreen from '../screens/Community/CommunityScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import MapScreen from '../screens/Map/MapScreen';
import ChatbotScreen from '../screens/Chatbot/ChatbotScreen';


const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
        //headerShown: false, // Ẩn header mặc định
        tabBarActiveTintColor: '#2E7D32', // Màu xanh khi chọn
        tabBarInactiveTintColor: '#888',  // Màu xám khi không chọn
        tabBarLabelStyle: {
          fontSize: 9, // Chữ nhỏ để vừa 9 mục
          marginBottom: 3,
          fontWeight: '600',
        },
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70, // Tăng chiều cao thanh Tab
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 8,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          elevation: 8,
        },
        // Cấu hình Icon động theo tên màn hình
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'AQI':
              iconName = focused ? 'cloud' : 'cloud-outline';
              break;
            case 'Waste':
              iconName = focused ? 'leaf' : 'leaf-outline';
              break;
            case 'Map':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'Report':
              iconName = focused ? 'alert-circle' : 'alert-circle-outline';
              break;
            case 'Chatbot':
              iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              break;
            case 'Community':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          // Giảm kích thước icon chút xíu để đỡ chật
          return <Ionicons name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trang chủ' }} />
      <Tab.Screen name="AQI" component={AQIScreen} options={{ title: 'Không khí' }} />
      <Tab.Screen name="Waste" component={WasteGuideScreen} options={{ title: 'Rác thải' }} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Bản đồ' }} />
      <Tab.Screen name="Report" component={ReportListScreen} options={{ title: 'Báo cáo' }} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} options={{ title: 'Chatbot' }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Cộng đồng' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}
