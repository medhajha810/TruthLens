import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newSystemTheme = e.matches ? 'dark' : 'light';
      setSystemTheme(newSystemTheme);
      
      // If user hasn't set a preference, follow system
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        setTheme(newSystemTheme);
      }
    };

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      if (savedTheme === 'system') {
        setTheme(systemTheme);
      } else {
        setTheme(savedTheme);
      }
    } else {
      // Default to system preference
      setTheme(systemTheme);
    }
  }, [systemTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setThemeMode = (mode) => {
    if (mode === 'system') {
      setTheme(systemTheme);
      localStorage.setItem('theme', 'system');
    } else {
      setTheme(mode);
      localStorage.setItem('theme', mode);
    }
  };

  const value = {
    theme,
    systemTheme,
    toggleTheme,
    setThemeMode,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 