import { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

export const useTranslatedText = (text, dependencies = []) => {
  const { t, requestTranslation, currentLanguage, autoTranslate } = useTranslation();
  const [translatedText, setTranslatedText] = useState(text);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!text || !autoTranslate || currentLanguage === 'en') {
        setTranslatedText(text);
        return;
      }

      // First, try to get from cache using t() function
      const cachedText = t(text);
      if (cachedText !== text) {
        setTranslatedText(cachedText);
        return;
      }

      // If not cached, request translation
      setIsTranslating(true);
      try {
        const result = await requestTranslation(text, currentLanguage);
        setTranslatedText(typeof result === 'string' ? result : text);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(text);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [text, currentLanguage, autoTranslate, t, requestTranslation, ...dependencies]);

  return { translatedText, isTranslating };
};

export const useTranslatedObject = (object, dependencies = []) => {
  const { requestTranslation, currentLanguage, autoTranslate } = useTranslation();
  const [translatedObject, setTranslatedObject] = useState(object);
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const translate = async () => {
      if (!object || !autoTranslate || currentLanguage === 'en') {
        setTranslatedObject(object);
        return;
      }

      setIsTranslating(true);
      try {
        // Recursively translate object
        const translateRecursive = async (obj) => {
          if (typeof obj === 'string') {
            const result = await requestTranslation(obj, currentLanguage);
            return typeof result === 'string' ? result : obj;
          } else if (typeof obj === 'object' && obj !== null) {
            const translated = {};
            for (const [key, value] of Object.entries(obj)) {
              translated[key] = await translateRecursive(value);
            }
            return translated;
          }
          return obj;
        };

        const result = await translateRecursive(object);
        setTranslatedObject(result);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedObject(object);
      } finally {
        setIsTranslating(false);
      }
    };

    translate();
  }, [object, currentLanguage, autoTranslate, requestTranslation, ...dependencies]);

  return { translatedObject, isTranslating };
}; 