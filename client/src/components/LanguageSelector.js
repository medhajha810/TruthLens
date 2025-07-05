import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../context/TranslationContext';
import { useTranslator } from '../hooks/useTranslator';

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage, isLoading, getLanguageInfo } = useTranslation();
  const { supportedLanguages } = useTranslator();
  const [isOpen, setIsOpen] = useState(false);

  const currentLangInfo = getLanguageInfo(currentLanguage);

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setCurrentLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center space-x-3 px-4 py-3 text-gray-800 dark:text-slate-100 hover:text-blue-700 dark:hover:text-yellow-300 hover:bg-blue-100 dark:hover:bg-slate-700 rounded-xl transition-colors text-lg font-semibold shadow-md border border-gray-200 dark:border-slate-600"
        style={{ minWidth: '180px' }}
      >
        <Globe className="w-7 h-7 text-blue-600 dark:text-yellow-300" />
        {isLoading && (
          <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
        )}
        <span className="text-lg font-bold">
          {currentLangInfo?.flag} {currentLangInfo?.name}
        </span>
        <ChevronDown className={`w-7 h-7 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border-2 border-blue-400 dark:border-yellow-400 z-20 max-h-96 overflow-y-auto"
            >
              <div className="py-3">
                <div className="px-5 py-2 text-xs font-bold text-blue-700 dark:text-yellow-300 uppercase tracking-wider bg-blue-50 dark:bg-slate-800 rounded-t-xl">
                  Select Language
                </div>
                <select
                  value={currentLanguage}
                  onChange={handleLanguageChange}
                  className="w-full bg-transparent border-none text-lg font-semibold text-gray-900 dark:text-yellow-200 focus:outline-none focus:ring-0 cursor-pointer py-3 px-4"
                  size={supportedLanguages.length > 8 ? 8 : supportedLanguages.length}
                  style={{ minHeight: '200px' }}
                >
                  {supportedLanguages.map((language) => (
                    <option key={language.code} value={language.code} className="py-2 px-3 text-lg font-semibold">
                      {language.flag} {language.name}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector; 