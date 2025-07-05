import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDynamicTheme } from '../context/DynamicThemeContext';
import ThemeIndicator from './ThemeIndicator';

// Helper function to convert Tailwind gradient classes to CSS colors
const getGradientColors = (backgroundClass) => {
  const colorMap = {
    'slate-50': '#f8fafc',
    'blue-50': '#eff6ff',
    'indigo-100': '#e0e7ff',
    'yellow-50': '#fefce8',
    'orange-50': '#fff7ed',
    'red-50': '#fef2f2',
    'gray-50': '#f9fafb',
    'gray-100': '#f3f4f6',
    'gray-900': '#111827',
    'indigo-900': '#312e81',
    'purple-900': '#581c87',
    'green-50': '#f0fdf4',
    'emerald-50': '#ecfdf5',
    'teal-50': '#f0fdfa',
    'pink-50': '#fdf2f8',
    'red-100': '#fee2e2'
  };

  if (backgroundClass.includes('from-slate-50 via-blue-50 to-indigo-100')) {
    return `${colorMap['slate-50']}, ${colorMap['blue-50']}, ${colorMap['indigo-100']}`;
  } else if (backgroundClass.includes('from-yellow-50 via-orange-50 to-red-50')) {
    return `${colorMap['yellow-50']}, ${colorMap['orange-50']}, ${colorMap['red-50']}`;
  } else if (backgroundClass.includes('from-gray-100 via-blue-100 to-indigo-200')) {
    return `${colorMap['gray-100']}, ${colorMap['blue-50']}, ${colorMap['indigo-100']}`;
  } else if (backgroundClass.includes('from-gray-50 via-blue-50 to-gray-100')) {
    return `${colorMap['gray-50']}, ${colorMap['blue-50']}, ${colorMap['gray-100']}`;
  } else if (backgroundClass.includes('from-gray-900 via-indigo-900 to-purple-900')) {
    return `${colorMap['gray-900']}, ${colorMap['indigo-900']}, ${colorMap['purple-900']}`;
  } else if (backgroundClass.includes('from-green-50 via-emerald-50 to-teal-50')) {
    return `${colorMap['green-50']}, ${colorMap['emerald-50']}, ${colorMap['teal-50']}`;
  } else if (backgroundClass.includes('from-red-50 via-pink-50 to-red-100')) {
    return `${colorMap['red-50']}, ${colorMap['pink-50']}, ${colorMap['red-100']}`;
  }
  
  // Default fallback
  return `${colorMap['slate-50']}, ${colorMap['blue-50']}, ${colorMap['indigo-100']}`;
};

const DynamicThemeWrapper = ({ children }) => {
  const { themeConfig, isLoading } = useDynamicTheme();

  // Debug logging
  console.log('DynamicThemeWrapper - Current theme config:', themeConfig);
  console.log('DynamicThemeWrapper - Background class:', themeConfig.background);

  return (
    <motion.div
      className={`min-h-screen transition-all duration-1000 ease-in-out bg-gradient-to-br ${themeConfig.background} dynamic-theme-wrapper`}
      style={{
        background: `linear-gradient(135deg, ${getGradientColors(themeConfig.background)})`
      }}
      transition={{ duration: 1 }}
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-4 h-4 rounded-full bg-current opacity-20"
          style={{ color: themeConfig.accent }}
        />
        
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -15, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-20 w-3 h-3 rounded-full bg-current opacity-20"
          style={{ color: themeConfig.accent }}
        />
        
        <motion.div
          animate={{
            y: [0, -25, 0],
            x: [0, 20, 0],
            opacity: [0.1, 0.25, 0.1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-20 left-20 w-5 h-5 rounded-full bg-current opacity-20"
          style={{ color: themeConfig.accent }}
        />
      </div>

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className={`w-12 h-12 border-4 border-t-transparent rounded-full ${themeConfig.accent.replace('text-', 'border-')}`}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Theme indicator */}
      <ThemeIndicator />
    </motion.div>
  );
};

export default DynamicThemeWrapper; 