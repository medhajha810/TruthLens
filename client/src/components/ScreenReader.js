import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  RotateCcw
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const ScreenReader = () => {
  const {
    isScreenReaderEnabled,
    isReading,
    currentReadingText,
    speak,
    readCurrentPage,
    stopReading
  } = useAccessibility();

  const [readingSpeed, setReadingSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentReadingSection, setCurrentReadingSection] = useState('');
  const [totalSections, setTotalSections] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const speechSynthesis = useRef(null);
  const currentUtterance = useRef(null);
  const readingSections = useRef([]);
  const readingInterval = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // Extract readable content from the page
  const extractPageContent = () => {
    const mainContent = document.querySelector('main, [role="main"], .main-content, #main-content');
    if (!mainContent) {
      return document.body.textContent || document.body.innerText;
    }

    // Get all text content from main content area
    const textContent = mainContent.textContent || mainContent.innerText;
    
    // Clean up the text
    const cleanText = textContent
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim()
      .split(/[.!?]+/)
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => sentence.trim() + '.');

    return cleanText;
  };

  // Read content in sections for better control
  const readContentInSections = useCallback((content) => {
    if (!speechSynthesis.current) return;

    // Stop any current speech
    speechSynthesis.current.cancel();

    // Split content into manageable sections
    const sections = content.split(/[.!?]+/).filter(section => section.trim().length > 0);
    readingSections.current = sections;
    setTotalSections(sections.length);
    setCurrentSectionIndex(0);

    // Start reading first section
    readNextSection();
  }, []);

  // Read next section
  const readNextSection = useCallback(() => {
    if (!speechSynthesis.current || currentSectionIndex >= readingSections.current.length) {
      // Finished reading
      stopReading();
      setReadingProgress(100);
      setCurrentSectionIndex(0);
      setCurrentReadingSection('');
      return;
    }

    const section = readingSections.current[currentSectionIndex];
    setCurrentReadingSection(section);

    // Create utterance for this section
    const utterance = new SpeechSynthesisUtterance(section);
    utterance.rate = readingSpeed;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';

    utterance.onstart = () => {
      setReadingProgress((currentSectionIndex / readingSections.current.length) * 100);
    };

    utterance.onend = () => {
      // Move to next section
      setCurrentSectionIndex(prev => prev + 1);
      setTimeout(() => {
        if (!isPaused) {
          readNextSection();
        }
      }, 200); // Small pause between sections
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      // Continue with next section even if there's an error
      setCurrentSectionIndex(prev => prev + 1);
      setTimeout(() => {
        if (!isPaused) {
          readNextSection();
        }
      }, 200);
    };

    currentUtterance.current = utterance;
    speechSynthesis.current.speak(utterance);
  }, [currentSectionIndex, readingSpeed, isPaused, stopReading]);

  // Handle reading state changes
  useEffect(() => {
    if (isReading && !isPaused && readingSections.current.length > 0) {
      readNextSection();
    }
  }, [isReading, isPaused, readNextSection]);

  // Handle reading speed changes
  useEffect(() => {
    if (isReading && currentUtterance.current) {
      // Stop current utterance and restart with new speed
      speechSynthesis.current?.cancel();
      setTimeout(() => {
        if (!isPaused) {
          readNextSection();
        }
      }, 100);
    }
  }, [readingSpeed, readNextSection]);

  const handlePlayPause = () => {
    if (isReading) {
      if (isPaused) {
        setIsPaused(false);
        speak('Resuming reading');
        // Resume reading from current section
        setTimeout(() => {
          readNextSection();
        }, 100);
      } else {
        setIsPaused(true);
        speak('Reading paused');
        speechSynthesis.current?.pause();
      }
    } else {
      // Start reading
      const content = extractPageContent();
      if (content) {
        readContentInSections(content);
        speak('Starting to read page content');
      } else {
        speak('No readable content found on this page');
      }
    }
  };

  const handleStop = () => {
    stopReading();
    setIsPaused(false);
    setCurrentSectionIndex(0);
    setReadingProgress(0);
    setCurrentReadingSection('');
    setTotalSections(0);
    speechSynthesis.current?.cancel();
    currentUtterance.current = null;
    speak('Reading stopped');
  };

  const handleSkipBack = () => {
    const newIndex = Math.max(0, currentSectionIndex - 5);
    setCurrentSectionIndex(newIndex);
    speechSynthesis.current?.cancel();
    setTimeout(() => {
      if (!isPaused) {
        readNextSection();
      }
    }, 100);
    speak('Skipped back 5 sections');
  };

  const handleSkipForward = () => {
    const newIndex = Math.min(readingSections.current.length - 1, currentSectionIndex + 5);
    setCurrentSectionIndex(newIndex);
    speechSynthesis.current?.cancel();
    setTimeout(() => {
      if (!isPaused) {
        readNextSection();
      }
    }, 100);
    speak('Skipped forward 5 sections');
  };

  const handleSpeedChange = (newSpeed) => {
    setReadingSpeed(newSpeed);
    speak(`Reading speed set to ${newSpeed}x`);
  };

  const handleRestart = () => {
    setCurrentSectionIndex(0);
    setReadingProgress(0);
    speechSynthesis.current?.cancel();
    setTimeout(() => {
      if (!isPaused) {
        readNextSection();
      }
    }, 100);
    speak('Restarted reading from beginning');
  };

  // Enhanced reading function that reads entire content
  const readEntirePage = () => {
    const content = extractPageContent();
    if (content) {
      // Read the entire content as one piece for better flow
      const utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = readingSpeed;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        setReadingProgress(0);
        setCurrentReadingSection('Reading entire page...');
      };

      utterance.onend = () => {
        setReadingProgress(100);
        setCurrentReadingSection('');
        stopReading();
        speak('Finished reading page content');
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        speak('Error occurred while reading');
        stopReading();
      };

      currentUtterance.current = utterance;
      speechSynthesis.current?.speak(utterance);
    } else {
      speak('No readable content found on this page');
    }
  };

  if (!isScreenReaderEnabled) {
    return null;
  }

  return (
    <div id="screen-reader">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200 z-40">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: 0 }}
          animate={{ width: `${readingProgress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Screen Reader Controls */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col space-y-2">
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4"
        >
          <div className="flex items-center space-x-4">
            {/* Play/Pause Button */}
            <button
              onClick={handlePlayPause}
              className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              aria-label={isReading && !isPaused ? 'Pause reading' : 'Start reading'}
            >
              {isReading && !isPaused ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            {/* Stop Button */}
            <button
              onClick={handleStop}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
              aria-label="Stop reading"
            >
              <Square className="w-5 h-5" />
            </button>

            {/* Skip Back */}
            <button
              onClick={handleSkipBack}
              className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Skip back 5 sections"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={handleSkipForward}
              className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Skip forward 5 sections"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Restart */}
            <button
              onClick={handleRestart}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              aria-label="Restart reading"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {/* Speed Control */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Speed:</span>
              <select
                value={readingSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>

            {/* Progress Display */}
            <div className="text-sm text-gray-600">
              {currentSectionIndex + 1} / {totalSections} sections
            </div>
          </div>

          {/* Current Reading Section Display */}
          {isReading && currentReadingSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-center"
            >
              <span className="text-sm text-gray-500">Currently reading:</span>
              <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded max-w-md mx-auto">
                {currentReadingSection.length > 100 
                  ? currentReadingSection.substring(0, 100) + '...' 
                  : currentReadingSection}
              </div>
            </motion.div>
          )}

          {/* Reading Mode Toggle */}
          <div className="mt-2 flex justify-center">
            <button
              onClick={readEntirePage}
              className="text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
              aria-label="Read entire page as one piece"
            >
              Read Entire Page
            </button>
          </div>
        </motion.div>

        {/* Reading Status Indicator */}
        <AnimatePresence>
          {isReading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed top-4 right-4 z-50 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">
                {isPaused ? 'Reading Paused' : 'Reading...'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reading Instructions */}
        {isScreenReaderEnabled && !isReading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-20 right-4 z-50 bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs"
          >
            <p className="text-sm text-blue-800">
              Screen reader is enabled. Click the play button to start reading the page content.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScreenReader; 