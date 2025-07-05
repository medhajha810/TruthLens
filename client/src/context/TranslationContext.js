import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const TranslationContext = createContext();

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

// Free translation API (MyMemory API)
const TRANSLATION_API_URL = 'https://api.mymemory.translated.net/get';

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' }
];

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache, setTranslationCache] = useState({});
  const [autoTranslate, setAutoTranslate] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // Rate limiting
  const requestQueue = useRef([]);
  const isProcessingQueue = useRef(false);
  const lastRequestTime = useRef(0);
  const MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  const pendingTranslations = useRef(new Set());

  // Detect user's preferred language
  useEffect(() => {
    const savedLanguage = localStorage.getItem('truthlens-language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    } else {
      const browserLanguage = navigator.language.split('-')[0];
      const supportedLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === browserLanguage);
      if (supportedLanguage) {
        setCurrentLanguage(browserLanguage);
      }
    }
  }, []);

  // Save language preference and force re-render
  useEffect(() => {
    localStorage.setItem('truthlens-language', currentLanguage);
    setForceUpdate(prev => prev + 1);
  }, [currentLanguage]);

  // Actual API call function
  const makeApiCall = useCallback(async (text, targetLang) => {
    try {
      const response = await axios.get(TRANSLATION_API_URL, {
        params: {
          q: text,
          langpair: `en|${targetLang}`,
          de: 'truthlens@example.com'
        },
        timeout: 10000
      });

      if (response.data && response.data.responseData) {
        const translatedText = response.data.responseData.translatedText;
        return translatedText;
      } else {
        console.warn('Translation API response format unexpected:', response.data);
        return text;
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  }, []);

  // Process translation queue
  const processQueue = useCallback(async () => {
    if (isProcessingQueue.current || requestQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    setIsLoading(true);

    while (requestQueue.current.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;

      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
      }

      const { text, targetLang, resolve, reject } = requestQueue.current.shift();
      lastRequestTime.current = Date.now();

      try {
        const translatedText = await makeApiCall(text, targetLang);
        resolve(translatedText);
      } catch (error) {
        reject(error);
      }
    }

    isProcessingQueue.current = false;
    setIsLoading(false);
  }, [makeApiCall]);

  // Queue translation request
  const queueTranslation = useCallback((text, targetLang) => {
    const cacheKey = `${text}_${targetLang}`;
    
    // Don't queue if already cached or pending
    const cachedValue = translationCache && translationCache[cacheKey];
    if (cachedValue || pendingTranslations.current.has(cacheKey)) {
      return Promise.resolve(cachedValue || text);
    }

    pendingTranslations.current.add(cacheKey);

    return new Promise((resolve, reject) => {
      requestQueue.current.push({ 
        text, 
        targetLang, 
        resolve: (translated) => {
          pendingTranslations.current.delete(cacheKey);
          resolve(translated);
        }, 
        reject: (error) => {
          pendingTranslations.current.delete(cacheKey);
          reject(error);
        }
      });
      processQueue();
    });
  }, [translationCache, processQueue]);

  // Synchronous translation function (only returns cached or original text)
  const t = useCallback((text) => {
    if (!text || currentLanguage === 'en') {
      return text;
    }
    const cacheKey = `${text}_${currentLanguage}`;
    // Always return a string, never undefined
    if (translationCache && typeof translationCache[cacheKey] === 'string') {
      return translationCache[cacheKey];
    }
    return text;
  }, [currentLanguage, translationCache]);

  // Function to request translation (to be used in useEffect)
  const requestTranslation = useCallback((text, targetLang = currentLanguage) => {
    if (!text || targetLang === 'en') {
      return Promise.resolve(text);
    }

    const cacheKey = `${text}_${targetLang}`;
    const cachedValue = translationCache && translationCache[cacheKey];
    
    if (cachedValue && typeof cachedValue === 'string') {
      return Promise.resolve(cachedValue);
    }

    return queueTranslation(text, targetLang).then(translated => {
      if (translated !== text && typeof translated === 'string') {
        setTranslationCache(prev => ({
          ...prev,
          [cacheKey]: translated
        }));
        setForceUpdate(prev => prev + 1);
      }
      return translated;
    });
  }, [currentLanguage, translationCache, queueTranslation]);

  // Translate multiple texts
  const translateMultiple = useCallback(async (texts, targetLang = currentLanguage) => {
    if (!autoTranslate || targetLang === 'en') {
      return texts;
    }

    const results = {};
    for (const [key, text] of Object.entries(texts)) {
      results[key] = await requestTranslation(text, targetLang);
    }
    return results;
  }, [autoTranslate, currentLanguage, requestTranslation]);

  // Translate object with nested structure
  const translateObject = useCallback(async (obj, targetLang = currentLanguage) => {
    if (!autoTranslate || targetLang === 'en') {
      return obj;
    }

    const translated = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        translated[key] = await requestTranslation(value, targetLang);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await translateObject(value, targetLang);
      } else {
        translated[key] = value;
      }
    }
    return translated;
  }, [autoTranslate, currentLanguage, requestTranslation]);

  // Clear translation cache
  const clearCache = useCallback(() => {
    setTranslationCache({});
    pendingTranslations.current.clear();
  }, []);

  // Get language info
  const getLanguageInfo = useCallback((code) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }, []);

  const value = {
    currentLanguage,
    setCurrentLanguage,
    isLoading,
    autoTranslate,
    setAutoTranslate,
    requestTranslation,
    translateMultiple,
    translateObject,
    t,
    clearCache,
    getLanguageInfo,
    supportedLanguages: SUPPORTED_LANGUAGES,
    forceUpdate
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}; 