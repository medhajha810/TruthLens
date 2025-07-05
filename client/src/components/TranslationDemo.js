import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Languages, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';

import { useTranslator } from '../hooks/useTranslator';

const TranslationDemo = () => {
  const { translate, currentLanguage, supportedLanguages, setCurrentLanguage, autoTranslate, translationCache, isLoading, forceUpdate } = useTranslator();
  const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage || 'en');

  // Safety check for supportedLanguages
  const languages = supportedLanguages || [];

  try {
    // Show loading state if context is not ready
    if (!languages.length) {
      return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-6">
                <Languages className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Loading Translation System...
              </h2>
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        </section>
      );
    }

    const demoTexts = [
      {
        key: 'welcome',
        english: 'Welcome to TruthLens',
        description: 'Main greeting text'
      },
      {
        key: 'description',
        english: 'Your trusted source for unbiased news analysis',
        description: 'Platform description'
      },
      {
        key: 'features',
        english: 'Advanced features for comprehensive news analysis',
        description: 'Features description'
      },
      {
        key: 'cta',
        english: 'Start exploring now',
        description: 'Call to action'
      }
    ];

    const handleLanguageChange = (langCode) => {
      setSelectedLanguage(langCode);
      if (setCurrentLanguage) {
        setCurrentLanguage(langCode);
      }
    };

    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-6"
            >
              <Languages className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {translate('Multilingual Support')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto"
            >
              {translate('Experience TruthLens in your preferred language with real-time API-based translation.')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Language Selector */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {translate('Choose Your Language')}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                      selectedLanguage === lang.code
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-slate-600 hover:border-primary-300 dark:hover:border-primary-600 text-gray-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {selectedLanguage === lang.code && (
                      <CheckCircle className="w-4 h-4 text-primary-600 dark:text-primary-400 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-slate-300">
                  <MessageSquare className="w-4 h-4" />
                  <span>{translate('Powered by real-time translation API')}</span>
                </div>
              </div>
            </motion.div>

            {/* Translation Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft"
            >
              <div className="flex items-center space-x-3 mb-6">
                <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {translate('Live Translation Preview')}
                </h3>
              </div>

              <div className="space-y-4">
                {demoTexts.map((text, index) => (
                  <motion.div
                    key={text.key}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                        {text.description}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-slate-500">
                        {selectedLanguage.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mb-2">
                      <strong>{translate('English')}:</strong> {text.english}
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      <strong>{translate('Translated')}:</strong> {translate(text.english)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <div className="flex items-center space-x-2 text-sm text-primary-700 dark:text-primary-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>{translate('All text content is automatically translated in real-time')}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {translate('16 Languages')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {translate('Support for major world languages including English, Spanish, French, German, and more')}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {translate('Real-time Translation')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {translate('Instant translation using advanced API technology with intelligent caching')}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 text-center shadow-soft">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {translate('Smart Caching')}
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-300">
                {translate('Efficient caching system reduces API calls and improves performance')}
              </p>
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-soft max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {translate('Experience Multilingual TruthLens')}
              </h3>
              <p className="text-gray-600 dark:text-slate-300 mb-6">
                {translate('Switch languages and see how the entire interface adapts to your preferred language instantly.')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => handleLanguageChange('es')}
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  🇪🇸 {translate('Try Spanish')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <button
                  onClick={() => handleLanguageChange('fr')}
                  className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
                >
                  🇫🇷 {translate('Try French')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Debug Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 text-center"
          >
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-soft max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {translate('Translation Debug Info')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="text-left">
                  <p><strong>{translate('Current Language')}:</strong> {(currentLanguage || 'en').toUpperCase()}</p>
                  <p><strong>{translate('Auto Translate')}:</strong> {autoTranslate ? translate('Enabled') : translate('Disabled')}</p>
                  <p><strong>{translate('Cache Size')}:</strong> {translationCache ? Object.keys(translationCache).length : 0}</p>
                </div>
                <div className="text-left">
                  <p><strong>{translate('Force Update Count')}:</strong> {forceUpdate || 0}</p>
                  <p><strong>{translate('Loading')}:</strong> {isLoading ? translate('Yes') : translate('No')}</p>
                  <p><strong>{translate('Supported Languages')}:</strong> {languages.length}</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <p className="text-xs text-gray-600 dark:text-slate-300">
                  {translate('This section shows the current state of the translation system. When you change languages, these values should update automatically.')}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  } catch (error) {
    console.error('Error in TranslationDemo component:', error);
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-6">
              <Languages className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Error Loading Translation System
            </h2>
            <p className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
              An error occurred while loading the translation system. Please try again later.
            </p>
          </div>
        </div>
      </section>
    );
  }
};

export default TranslationDemo; 