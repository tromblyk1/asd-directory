import React, { createContext, useContext, useState, useEffect } from 'react';

type AccessibilityContextType = {
  darkMode: boolean;
  lowSensoryMode: boolean;
  toggleDarkMode: () => void;
  toggleLowSensoryMode: () => void;
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [lowSensoryMode, setLowSensoryMode] = useState(() => {
    const saved = localStorage.getItem('lowSensoryMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('lowSensoryMode', JSON.stringify(lowSensoryMode));
    if (lowSensoryMode) {
      document.documentElement.classList.add('low-sensory');
    } else {
      document.documentElement.classList.remove('low-sensory');
    }
  }, [lowSensoryMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleLowSensoryMode = () => setLowSensoryMode(!lowSensoryMode);

  return (
    <AccessibilityContext.Provider value={{ darkMode, lowSensoryMode, toggleDarkMode, toggleLowSensoryMode }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
