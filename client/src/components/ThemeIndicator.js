import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Moon, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Info,
  RefreshCw,
  Thermometer,
  Clock,
  Newspaper
} from 'lucide-react';
import { useDynamicTheme } from '../context/DynamicThemeContext';

const ThemeIndicator = () => {
  const { 
    currentTheme, 
    themeConfig, 
    weatherData, 
    newsSentiment, 
    isLoading, 
    updateTheme,
    getThemeDescription 
  } = useDynamicTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'sunny': return <Sun className="w-4 h-4" />;
      case 'rainy': return <CloudRain className="w-4 h-4" />;
      case 'cloudy': return <Cloud className="w-4 h-4" />;
      case 'night': return <Moon className="w-4 h-4" />;
      case 'positive': return <TrendingUp className="w-4 h-4" />;
      case 'negative': return <TrendingDown className="w-4 h-4" />;
      case 'breaking': return <AlertTriangle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'sunny': return 'text-yellow-600 bg-yellow-100';
      case 'rainy': return 'text-blue-600 bg-blue-100';
      case 'cloudy': return 'text-gray-600 bg-gray-100';
      case 'night': return 'text-purple-600 bg-purple-100';
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'breaking': return 'text-orange-600 bg-orange-100';
      default: return 'text-blue-600 bg-blue-100';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`mb-4 p-4 rounded-lg shadow-lg backdrop-blur-sm ${themeConfig.card} border border-gray-200/50`}
            style={{ minWidth: '280px' }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">Dynamic Theme</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getThemeIcon(currentTheme)}
                  <span className="text-sm font-medium capitalize">{currentTheme}</span>
                </div>
                
                <p className="text-xs text-gray-600">{getThemeDescription()}</p>
                
                {weatherData && (
                  <div className="flex items-center space-x-2 text-xs">
                    <Thermometer className="w-3 h-3" />
                    <span>{weatherData.temperature}°C</span>
                    <span className="text-gray-500">•</span>
                    <span className="capitalize">{weatherData.condition}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>{new Date().toLocaleTimeString()}</span>
                  <span className="text-gray-500">•</span>
                  <span className="capitalize">{new Date().toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs">
                  <Newspaper className="w-3 h-3" />
                  <span>News Sentiment: {newsSentiment}</span>
                </div>
              </div>
              
              <button
                onClick={updateTheme}
                disabled={isLoading}
                className={`w-full mt-3 px-3 py-1.5 rounded text-xs font-medium bg-gradient-to-r ${themeConfig.primary} text-white flex items-center justify-center space-x-1 disabled:opacity-50`}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Theme</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`p-3 rounded-full shadow-lg backdrop-blur-sm ${themeConfig.card} border border-gray-200/50 flex items-center justify-center`}
      >
        <div className={`p-2 rounded-full ${getThemeColor(currentTheme)}`}>
          {getThemeIcon(currentTheme)}
        </div>
      </motion.button>
    </div>
  );
};

export default ThemeIndicator; 