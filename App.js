// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from './src/store/AppProvider';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}
