import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  Moon, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Thermometer,
  Clock,
  Newspaper,
  Zap,
  Palette
} from 'lucide-react';
import { useDynamicTheme } from '../context/DynamicThemeContext';

const DynamicThemeDemo = () => {
  const { 
    currentTheme, 
    themeConfig, 
    weatherData, 
    newsSentiment, 
    isLoading, 
    updateTheme,
    getThemeDescription 
  } = useDynamicTheme();

  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'sunny': return <Sun className="w-6 h-6" />;
      case 'rainy': return <CloudRain className="w-6 h-6" />;
      case 'cloudy': return <Cloud className="w-6 h-6" />;
      case 'night': return <Moon className="w-6 h-6" />;
      case 'positive': return <TrendingUp className="w-6 h-6" />;
      case 'negative': return <TrendingDown className="w-6 h-6" />;
      case 'breaking': return <AlertTriangle className="w-6 h-6" />;
      default: return <Palette className="w-6 h-6" />;
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Newspaper className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl shadow-lg backdrop-blur-sm ${themeConfig.card} border border-gray-200/50`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center space-x-2">
          <Zap className="w-5 h-5" />
          <span>Dynamic Theme</span>
        </h2>
        <div className={`p-2 rounded-full ${themeConfig.accent.replace('text-', 'bg-')} bg-opacity-20`}>
          {getThemeIcon(currentTheme)}
        </div>
      </div>

      <div className="space-y-4">
        {/* Current Theme Info */}
        <div className="p-4 rounded-lg bg-gray-50/50">
          <h3 className="font-semibold mb-2">Current Theme</h3>
          <div className="flex items-center justify-between">
            <span className="capitalize font-medium">{currentTheme}</span>
            <span className="text-sm text-gray-600">{getThemeDescription()}</span>
          </div>
        </div>

        {/* Weather Data */}
        {weatherData && (
          <div className="p-4 rounded-lg bg-blue-50/50">
            <h3 className="font-semibold mb-2 flex items-center space-x-2">
              <Thermometer className="w-4 h-4" />
              <span>Weather</span>
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Temperature:</span>
                <span className="ml-2 font-medium">{weatherData.temperature}°C</span>
              </div>
              <div>
                <span className="text-gray-600">Condition:</span>
                <span className="ml-2 font-medium capitalize">{weatherData.condition}</span>
              </div>
            </div>
          </div>
        )}

        {/* Time Data */}
        <div className="p-4 rounded-lg bg-purple-50/50">
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Time</span>
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Current:</span>
              <span className="ml-2 font-medium">{new Date().toLocaleTimeString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Date:</span>
              <span className="ml-2 font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* News Sentiment */}
        <div className="p-4 rounded-lg bg-green-50/50">
          <h3 className="font-semibold mb-2 flex items-center space-x-2">
            {getSentimentIcon(newsSentiment)}
            <span>News Sentiment</span>
          </h3>
          <div className="flex items-center justify-between">
            <span className="capitalize font-medium">{newsSentiment}</span>
            <span className="text-sm text-gray-600">
              {newsSentiment === 'positive' ? 'Optimistic news detected' :
               newsSentiment === 'negative' ? 'Alert news detected' :
               'Neutral news tone'}
            </span>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="p-4 rounded-lg bg-orange-50/50">
          <h3 className="font-semibold mb-2">Theme Controls</h3>
          <button
            onClick={updateTheme}
            disabled={isLoading}
            className={`w-full px-4 py-2 rounded-lg font-medium bg-gradient-to-r ${themeConfig.primary} text-white flex items-center justify-center space-x-2 disabled:opacity-50`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Refresh Theme</span>
              </>
            )}
          </button>
        </div>

        {/* Theme Preview */}
        <div className="p-4 rounded-lg bg-gray-50/50">
          <h3 className="font-semibold mb-2">Theme Preview</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${themeConfig.primary} text-white text-center text-sm`}>
              Primary
            </div>
            <div className={`p-3 rounded-lg bg-gradient-to-r ${themeConfig.secondary} text-white text-center text-sm`}>
              Secondary
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DynamicThemeDemo; 