import React, { useState, useEffect } from 'react';
import { useTranslation } from '../context/TranslationContext';

const TranslatedText = ({ text, className = '', children }) => {
  const { t, requestTranslation, currentLanguage } = useTranslation();
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

  const displayText = children || translatedText;

  return (
    <span className={className}>
      {isTranslating ? (
        <span className="opacity-70">{displayText}</span>
      ) : (
        displayText
      )}
    </span>
  );
};

export default TranslatedText; 