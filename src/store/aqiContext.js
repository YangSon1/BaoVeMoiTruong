import React, { createContext, useContext, useState } from 'react';

const AQIContext = createContext(null);

export function AQIProvider({ children }) {
  // currentAQI: { value, level, color, advice }
  const [currentAQI, setCurrentAQI] = useState(null);
  const [threshold, setThreshold] = useState(100); // ngưỡng cảnh báo mặc định

  const value = {
    currentAQI,
    setCurrentAQI,
    threshold,
    setThreshold,
  };

  return <AQIContext.Provider value={value}>{children}</AQIContext.Provider>;
}

export function useAQI() {
  return useContext(AQIContext);
}
