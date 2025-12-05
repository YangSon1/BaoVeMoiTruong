// src/store/AppProvider.js
import React from 'react';
import { UserProvider } from './userContext';
import { AQIProvider } from './aqiContext';
import { GamificationProvider } from './GamificationContext';

export function AppProvider({ children }) {
  return (
    <UserProvider>
      <AQIProvider>
        <GamificationProvider>
          {children}
        </GamificationProvider>
      </AQIProvider>
    </UserProvider>
  );
}
