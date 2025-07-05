import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, BookOpen, X, Menu } from 'lucide-react';
import { useStoryMode } from '../../context/StoryModeContext';
import LanguageSelector from '../LanguageSelector';
import ThemeToggle from '../ThemeToggle';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openStoryMode } = useStoryMode();

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">TruthLens</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/news"
                id="news-section"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                News
              </Link>
              <Link
                to="/analysis"
                id="analysis-section"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Analysis
              </Link>
              <Link
                to="/fact-check"
                id="fact-check-section"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Fact Check
              </Link>
              <Link
                to="/social"
                id="social-section"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Social
              </Link>
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Story Mode Button */}
            <button
              onClick={openStoryMode}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg"
              aria-label="Start Story Mode"
            >
              <BookOpen className="w-4 h-4" />
              Story Mode
            </button>

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/news"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link
              to="/analysis"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Analysis
            </Link>
            <Link
              to="/fact-check"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Fact Check
            </Link>
            <Link
              to="/social"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Social
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            {/* Mobile Story Mode Button */}
            <button
              onClick={() => {
                openStoryMode();
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium"
            >
              📖 Story Mode
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation; 