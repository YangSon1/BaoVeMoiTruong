import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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
    <Tab.Navigator>
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
