import React, { createContext, useContext, useState, useEffect } from 'react';

const StoryModeContext = createContext();

export const useStoryMode = () => {
  const context = useContext(StoryModeContext);
  if (!context) {
    throw new Error('useStoryMode must be used within a StoryModeProvider');
  }
  return context;
};

export const StoryModeProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSeenStoryMode, setHasSeenStoryMode] = useState(false);

  // Check if user has seen story mode before
  useEffect(() => {
    const seen = localStorage.getItem('truthlens-story-mode-seen');
    setHasSeenStoryMode(!!seen);
  }, []);

  const openStoryMode = () => {
    setIsOpen(true);
    localStorage.setItem('truthlens-story-mode-seen', 'true');
    setHasSeenStoryMode(true);
  };

  const closeStoryMode = () => {
    setIsOpen(false);
  };

  const resetStoryMode = () => {
    localStorage.removeItem('truthlens-story-mode-seen');
    setHasSeenStoryMode(false);
  };

  const value = {
    isOpen,
    hasSeenStoryMode,
    openStoryMode,
    closeStoryMode,
    resetStoryMode
  };

  return (
    <StoryModeContext.Provider value={value}>
      {children}
    </StoryModeContext.Provider>
  );
}; 