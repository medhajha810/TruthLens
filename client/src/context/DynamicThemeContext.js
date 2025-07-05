import React, { createContext, useContext, useState, useEffect } from 'react';

const DynamicThemeContext = createContext();

export const useDynamicTheme = () => {
  const context = useContext(DynamicThemeContext);
  if (!context) {
    throw new Error('useDynamicTheme must be used within a DynamicThemeProvider');
  }
  return context;
};

export const DynamicThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [weatherData, setWeatherData] = useState(null);
  const [newsSentiment, setNewsSentiment] = useState('neutral');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(0);

  // Theme configurations based on different conditions
  const themeConfigs = {
    default: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'from-gray-500 to-gray-600',
      background: 'from-slate-50 via-blue-50 to-indigo-100',
      card: 'bg-white',
      text: 'text-gray-900',
      accent: 'text-blue-600'
    },
    sunny: {
      primary: 'from-yellow-500 to-orange-500',
      secondary: 'from-orange-400 to-red-500',
      background: 'from-yellow-50 via-orange-50 to-red-50',
      card: 'bg-white/90 backdrop-blur-sm',
      text: 'text-gray-900',
      accent: 'text-orange-600'
    },
    rainy: {
      primary: 'from-blue-600 to-indigo-700',
      secondary: 'from-gray-600 to-gray-700',
      background: 'from-gray-100 via-blue-100 to-indigo-200',
      card: 'bg-white/95 backdrop-blur-sm',
      text: 'text-gray-800',
      accent: 'text-blue-700'
    },
    cloudy: {
      primary: 'from-gray-500 to-gray-600',
      secondary: 'from-blue-400 to-blue-500',
      background: 'from-gray-50 via-blue-50 to-gray-100',
      card: 'bg-white/90',
      text: 'text-gray-800',
      accent: 'text-gray-600'
    },
    night: {
      primary: 'from-indigo-600 to-purple-700',
      secondary: 'from-purple-500 to-pink-600',
      background: 'from-gray-900 via-indigo-900 to-purple-900',
      card: 'bg-gray-800/90 backdrop-blur-sm',
      text: 'text-gray-100',
      accent: 'text-purple-400'
    },
    positive: {
      primary: 'from-green-500 to-emerald-600',
      secondary: 'from-emerald-400 to-teal-500',
      background: 'from-green-50 via-emerald-50 to-teal-50',
      card: 'bg-white/95',
      text: 'text-gray-900',
      accent: 'text-green-600'
    },
    negative: {
      primary: 'from-red-500 to-pink-600',
      secondary: 'from-pink-400 to-red-500',
      background: 'from-red-50 via-pink-50 to-red-100',
      card: 'bg-white/95',
      text: 'text-gray-900',
      accent: 'text-red-600'
    },
    breaking: {
      primary: 'from-red-600 to-orange-600',
      secondary: 'from-orange-500 to-red-500',
      background: 'from-red-100 via-orange-100 to-red-50',
      card: 'bg-white/95 backdrop-blur-sm',
      text: 'text-gray-900',
      accent: 'text-red-600'
    }
  };

  // Get weather data from OpenWeatherMap API
  const fetchWeatherData = async () => {
    try {
      // Using a free weather API (OpenMeteo) that doesn't require API key
      // Using London coordinates for more realistic weather data
      const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true&hourly=temperature_2m,precipitation_probability,weathercode');
      const data = await response.json();
      
      if (data.current_weather) {
        const weatherCode = data.current_weather.weathercode;
        const temperature = data.current_weather.temperature;
        
        // Map weather codes to conditions
        let condition = 'default';
        if (weatherCode >= 0 && weatherCode <= 3) condition = 'sunny';
        else if (weatherCode >= 51 && weatherCode <= 67) condition = 'rainy';
        else if (weatherCode >= 71 && weatherCode <= 77) condition = 'rainy';
        else if (weatherCode >= 80 && weatherCode <= 82) condition = 'rainy';
        else if (weatherCode >= 95 && weatherCode <= 99) condition = 'rainy';
        else if (weatherCode >= 1 && weatherCode <= 48) condition = 'cloudy';
        
        setWeatherData({
          condition,
          temperature,
          weatherCode
        });
        
        return condition;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
    return 'default';
  };

  // Get time-based theme
  const getTimeBasedTheme = () => {
    const hour = new Date().getHours();
    
    if (hour >= 6 && hour < 18) {
      return 'default'; // Day time
    } else {
      return 'night'; // Night time (6 PM to 6 AM)
    }
  };

  // Get news sentiment for theme
  const fetchNewsSentiment = async () => {
    try {
      // Simulate sentiment analysis based on recent news
      const response = await fetch('/api/news/aggregate?topic=general&limit=5');
      
      if (!response.ok) {
        if (response.status === 429) {
          console.log('Rate limited, using default sentiment');
          return 'neutral';
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        // Simple sentiment analysis based on keywords
        const articles = data.articles;
        let positiveCount = 0;
        let negativeCount = 0;
        
        articles.forEach(article => {
          const text = `${article.title} ${article.description}`.toLowerCase();
          const positiveWords = ['good', 'great', 'positive', 'success', 'win', 'improve', 'growth'];
          const negativeWords = ['bad', 'terrible', 'negative', 'crisis', 'loss', 'decline', 'problem'];
          
          positiveWords.forEach(word => {
            if (text.includes(word)) positiveCount++;
          });
          
          negativeWords.forEach(word => {
            if (text.includes(word)) negativeCount++;
          });
        });
        
        if (positiveCount > negativeCount) {
          setNewsSentiment('positive');
          return 'positive';
        } else if (negativeCount > positiveCount) {
          setNewsSentiment('negative');
          return 'negative';
        } else {
          setNewsSentiment('neutral');
          return 'neutral';
        }
      }
    } catch (error) {
      console.error('Error fetching news sentiment:', error);
    }
    return 'neutral';
  };

  // Update theme based on multiple factors
  const updateTheme = async () => {
    setIsLoading(true);
    
    try {
      const [weatherTheme, timeTheme, sentimentTheme] = await Promise.allSettled([
        fetchWeatherData(),
        Promise.resolve(getTimeBasedTheme()),
        fetchNewsSentiment()
      ]);
      
      // Priority: Time > Weather > Sentiment
      let finalTheme = 'default';
      
      // First check time-based theme
      if (timeTheme.status === 'fulfilled') {
        finalTheme = timeTheme.value;
        console.log('Time-based theme:', timeTheme.value);
      }
      
      // Override with weather theme only during daytime
      if (weatherTheme.status === 'fulfilled' && timeTheme.status === 'fulfilled' && timeTheme.value === 'default') {
        if (weatherTheme.value !== 'default') {
          finalTheme = weatherTheme.value;
          console.log('Weather theme applied:', weatherTheme.value);
        }
      }
      
      // Override with sentiment for breaking news (only if sentiment fetch succeeded)
      if (sentimentTheme.status === 'fulfilled' && sentimentTheme.value === 'negative' && Math.random() > 0.7) {
        finalTheme = 'breaking';
        console.log('Breaking news theme applied');
      }
      
      console.log('Final theme selected:', finalTheme);
      setCurrentTheme(finalTheme);
      setLastUpdate(Date.now());
      
      // Cache the theme data
      localStorage.setItem('truthlens-theme-cache', JSON.stringify({
        theme: finalTheme,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error updating theme:', error);
      setCurrentTheme('default');
      
      // Cache the fallback theme to prevent repeated failed calls
      localStorage.setItem('truthlens-theme-cache', JSON.stringify({
        theme: 'default',
        timestamp: Date.now()
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Update theme every 2 hours instead of 30 minutes to reduce API calls
  useEffect(() => {
    const now = Date.now();
    const twoHours = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
    
    // Check localStorage for cached theme data
    const cachedTheme = localStorage.getItem('truthlens-theme-cache');
    if (cachedTheme) {
      try {
        const { theme, timestamp } = JSON.parse(cachedTheme);
        if (now - timestamp < twoHours) {
          setCurrentTheme(theme);
          setLastUpdate(timestamp);
          return; // Use cached theme, don't make API calls
        }
      } catch (error) {
        console.error('Error parsing cached theme:', error);
      }
    }
    
    // Set initial theme based on current time
    const currentHour = new Date().getHours();
    const initialTheme = (currentHour >= 6 && currentHour < 18) ? 'default' : 'night';
    
    setCurrentTheme(initialTheme);
    setLastUpdate(now);
    
    // Cache the initial theme
    localStorage.setItem('truthlens-theme-cache', JSON.stringify({
      theme: initialTheme,
      timestamp: now
    }));
  }, []); // Remove dependencies to prevent re-runs

  // Get current theme configuration
  const getThemeConfig = () => {
    return themeConfigs[currentTheme] || themeConfigs.default;
  };

  // Get theme description
  const getThemeDescription = () => {
    const descriptions = {
      default: 'Standard daytime theme',
      sunny: 'Bright and warm sunny weather theme',
      rainy: 'Cool and calming rainy weather theme',
      cloudy: 'Soft and neutral cloudy weather theme',
      night: 'Dark and elegant night theme',
      positive: 'Optimistic positive news theme',
      negative: 'Alert negative news theme',
      breaking: 'Urgent breaking news theme'
    };
    
    return descriptions[currentTheme] || descriptions.default;
  };

  const value = {
    currentTheme,
    themeConfig: getThemeConfig(),
    weatherData,
    newsSentiment,
    isLoading,
    updateTheme,
    getThemeDescription,
    // Add a test function to manually trigger theme update
    testTheme: () => {
      console.log('Testing theme update...');
      updateTheme();
    }
  };

  return (
    <DynamicThemeContext.Provider value={value}>
      {children}
    </DynamicThemeContext.Provider>
  );
}; 