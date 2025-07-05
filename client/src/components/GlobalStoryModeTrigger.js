import React, { useState, useEffect } from 'react';
import { BookOpen, X } from 'lucide-react';
import { useStoryMode } from '../context/StoryModeContext';

const GlobalStoryModeTrigger = () => {
  const { isOpen, hasSeenStoryMode, openStoryMode } = useStoryMode();
  const [isVisible, setIsVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Show trigger after a delay, and show tooltip for first-time users
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      if (!hasSeenStoryMode) {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [hasSeenStoryMode]);

  if (isOpen || !isVisible) return null;

  return (
    <>
      {/* Floating Story Mode Button */}
      <button
        onClick={openStoryMode}
        className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-full shadow-2xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 flex items-center gap-3 group"
        aria-label="Start Story Mode - Guided Tour"
        style={{ 
          fontWeight: 700, 
          fontSize: '1.1rem',
          animation: !hasSeenStoryMode ? 'bounce 2s infinite' : 'none'
        }}
      >
        <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span>Story Mode</span>
        {!hasSeenStoryMode && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
            !
          </span>
        )}
      </button>

      {/* Tooltip for first-time users */}
      {showTooltip && (
        <div className="fixed bottom-24 right-8 z-50 bg-white dark:bg-slate-800 rounded-lg shadow-xl p-4 max-w-xs border-2 border-blue-400 dark:border-yellow-400 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-yellow-200 flex items-center justify-center">
                <span role="img" aria-label="Guide">🧑‍🏫</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-900 dark:text-yellow-300 mb-1">
                New to TruthLens?
              </div>
              <div className="text-sm text-gray-600 dark:text-yellow-100">
                Click "Story Mode" for a guided tour of all our features!
              </div>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition"
              aria-label="Close tooltip"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default GlobalStoryModeTrigger; 