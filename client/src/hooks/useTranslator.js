import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export const useTranslator = () => {
  const { 
    currentLanguage, 
    t, 
    isLoading, 
    autoTranslate, 
    forceUpdate,
    setCurrentLanguage,
    supportedLanguages,
    translationCache,
    clearCache,
    getLanguageInfo,
    requestTranslation
  } = useTranslation();

  // Clear local cache when language changes
  useEffect(() => {
    // This will trigger re-render when forceUpdate changes
  }, [forceUpdate]);

  // Translate a single text - use t() function which is already defensive
  const translate = (text, key = null) => {
    if (!text || typeof text !== 'string') {
      return text;
    }

    // Use the t function from context directly - it's already defensive
    return t(text);
  };

  // Hook to request translation for a text (use in useEffect)
  const useTranslateText = (text) => {
    const [translatedText, setTranslatedText] = useState(text);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
      if (!text || currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      // First try to get from cache using t() function
      const cachedText = t(text);
      if (cachedText !== text) {
        setTranslatedText(cachedText);
        return;
      }

      // Request translation if not cached
      setIsTranslating(true);
      requestTranslation(text, currentLanguage)
        .then(translated => {
          // Ensure result is a string
          setTranslatedText(typeof translated === 'string' ? translated : text);
        })
        .catch(error => {
          console.error('Translation error:', error);
          setTranslatedText(text);
        })
        .finally(() => {
          setIsTranslating(false);
        });
    }, [text, currentLanguage, t, requestTranslation]);

    return { translatedText, isTranslating };
  };

  // Translate multiple texts
  const translateMultiple = (texts) => {
    const translated = {};
    Object.entries(texts).forEach(([key, text]) => {
      translated[key] = translate(text, key);
    });
    return translated;
  };

  // Translate object with nested structure
  const translateObject = (obj) => {
    if (typeof obj !== 'object' || obj === null) {
      return translate(obj);
    }

    const translated = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string') {
        translated[key] = translate(value, key);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = translateObject(value);
      } else {
        translated[key] = value;
      }
    });
    return translated;
  };

  return {
    translate,
    translateMultiple,
    translateObject,
    useTranslateText,
    requestTranslation,
    currentLanguage,
    setCurrentLanguage,
    supportedLanguages,
    translationCache,
    clearCache,
    getLanguageInfo,
    isLoading,
    autoTranslate,
    forceUpdate
  };
}; 