import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Home, 
  FileText, 
  BarChart3, 
  CheckCircle, 
  MessageCircle, 
  Settings, 
  User,
  Info,
  Search,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const KeyboardNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { speak } = useAccessibility();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentFocus, setCurrentFocus] = useState(null);

  // Keyboard shortcuts
  const shortcuts = {
    'h': { action: () => navigate('/'), label: 'Go to Home', icon: Home },
    'n': { action: () => navigate('/news'), label: 'Go to News', icon: FileText },
    'a': { action: () => navigate('/analysis'), label: 'Go to Analysis', icon: BarChart3 },
    'f': { action: () => navigate('/fact-check'), label: 'Go to Fact Check', icon: CheckCircle },
    's': { action: () => navigate('/social'), label: 'Go to Social', icon: MessageCircle },
    'g': { action: () => navigate('/settings'), label: 'Go to Settings', icon: Settings },
    'p': { action: () => navigate('/profile'), label: 'Go to Profile', icon: User },
    'i': { action: () => navigate('/about'), label: 'Go to About', icon: Info },
    '/': { action: () => focusSearch(), label: 'Focus Search', icon: Search },
    'm': { action: () => toggleMenu(), label: 'Toggle Menu', icon: Menu },
    'Escape': { action: () => closeModals(), label: 'Close Modals', icon: X },
    'Backspace': { action: () => navigate(-1), label: 'Go Back', icon: ArrowLeft },
    ' ': { action: () => toggleReading(), label: 'Toggle Reading', icon: FileText },
    '?': { action: () => setShowShortcuts(!showShortcuts), label: 'Show Shortcuts', icon: Info }
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Don't handle shortcuts when typing in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      const key = event.key.toLowerCase();
      const shortcut = shortcuts[key] || shortcuts[event.key];

      if (shortcut) {
        event.preventDefault();
        shortcut.action();
        speak(`Executed: ${shortcut.label}`);
        
        // Show visual feedback
        setCurrentFocus(shortcut.label);
        setTimeout(() => setCurrentFocus(null), 2000);
      }

      // Handle arrow key navigation
      handleArrowKeys(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location, shortcuts, speak]);

  // Handle arrow key navigation
  const handleArrowKeys = (event) => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const currentIndex = Array.from(focusableElements).findIndex(el => el === document.activeElement);

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % focusableElements.length;
        focusableElements[nextIndex]?.focus();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
        focusableElements[prevIndex]?.focus();
        break;
    }
  };

  // Focus search input
  const focusSearch = () => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
    if (searchInput) {
      searchInput.focus();
      setCurrentFocus('search');
    }
  };

  // Toggle menu
  const toggleMenu = () => {
    const menuButton = document.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');
    if (menuButton) {
      menuButton.click();
      setCurrentFocus('menu');
    }
  };

  // Close modals
  const closeModals = () => {
    const closeButton = document.querySelector('[aria-label*="close"], [aria-label*="Close"]');
    if (closeButton) {
      closeButton.click();
    }
    setShowShortcuts(false);
  };

  // Toggle reading
  const toggleReading = () => {
    // This will be handled by the ScreenReader component
    const readButton = document.querySelector('[aria-label*="read"], [aria-label*="Read"]');
    if (readButton) {
      readButton.click();
    }
  };

  return (
    <div id="keyboard-navigation">
      {/* Floating Keyboard Shortcuts Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowShortcuts(!showShortcuts)}
        className="fixed top-4 left-4 z-40 bg-gray-800 hover:bg-gray-900 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Show keyboard shortcuts"
        title="Press ? to show keyboard shortcuts"
      >
        <div className="text-xs font-mono">?</div>
      </motion.button>

      {/* Keyboard Shortcuts Help */}
      <AnimatePresence>
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="hover:bg-blue-700 p-1 rounded"
                  aria-label="Close shortcuts help"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(shortcuts).map(([key, shortcut]) => {
                    const Icon = shortcut.icon;
                    return (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded">
                            <Icon className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">
                                {key === ' ' ? 'Space' : key}
                              </kbd>
                              <span className="font-medium text-gray-800">{shortcut.label}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Additional Navigation Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-800 mb-2">Additional Navigation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <p><strong>Tab:</strong> Navigate between interactive elements</p>
                      <p><strong>Shift + Tab:</strong> Navigate backwards</p>
                      <p><strong>Enter/Space:</strong> Activate buttons and links</p>
                    </div>
                    <div>
                      <p><strong>Arrow Keys:</strong> Navigate between focusable elements</p>
                      <p><strong>Escape:</strong> Close modals and dialogs</p>
                      <p><strong>F6:</strong> Cycle through page sections</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Focus Indicator */}
      {currentFocus && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <p className="text-sm">Focused: {currentFocus}</p>
        </motion.div>
      )}

      {/* Skip to Main Content Link */}
      <a
        href="#main-content"
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const mainContent = document.querySelector('main, [role="main"], #main-content');
          if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView();
            speak('Skipped to main content');
          }
        }}
      >
        Skip to main content
      </a>
    </div>
  );
};

export default KeyboardNavigation; 