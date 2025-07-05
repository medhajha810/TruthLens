import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Import translation files
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import deTranslations from './locales/de/translation.json';
import itTranslations from './locales/it/translation.json';
import ptTranslations from './locales/pt/translation.json';
import ruTranslations from './locales/ru/translation.json';
import zhTranslations from './locales/zh/translation.json';
import jaTranslations from './locales/ja/translation.json';
import arTranslations from './locales/ar/translation.json';

const resources = {
  en: {
    translation: enTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  de: {
    translation: deTranslations
  },
  it: {
    translation: itTranslations
  },
  pt: {
    translation: ptTranslations
  },
  ru: {
    translation: ruTranslations
  },
  zh: {
    translation: zhTranslations
  },
  ja: {
    translation: jaTranslations
  },
  ar: {
    translation: arTranslations
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n; 