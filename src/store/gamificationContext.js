// src/store/gamificationContext.js
import React, { createContext, useContext, useState } from 'react';

const GamificationContext = createContext(null);

export function GamificationProvider({ children }) {
  const [points, setPoints] = useState(0);
  const [badges, setBadges] = useState([]); // danh sách huy hiệu

  const value = { points, setPoints, badges, setBadges };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  return useContext(GamificationContext);
}
