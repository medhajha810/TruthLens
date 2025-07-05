import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const VoiceNavigation = () => {
  const {
    isVoiceNavigationEnabled,
    isScreenReaderEnabled,
    isListening,
    lastSpokenText,
    speak,
    toggleVoiceNavigation,
    toggleScreenReader,
    VOICE_COMMANDS
  } = useAccessibility();

  const [showCommands, setShowCommands] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);

  // Add spoken text to command history
  useEffect(() => {
    if (lastSpokenText) {
      setCommandHistory(prev => [...prev.slice(-4), lastSpokenText]);
    }
  }, [lastSpokenText]);

  const handleVoiceToggle = () => {
    console.log('Voice toggle clicked, current state:', isVoiceNavigationEnabled);
    toggleVoiceNavigation();
    speak(isVoiceNavigationEnabled ? 'Voice navigation disabled' : 'Voice navigation enabled');
  };

  const handleReaderToggle = () => {
    console.log('Reader toggle clicked, current state:', isScreenReaderEnabled);
    toggleScreenReader();
    speak(isScreenReaderEnabled ? 'Screen reader disabled' : 'Screen reader enabled');
  };

  const speakCommands = () => {
    const commands = Object.keys(VOICE_COMMANDS).join(', ');
    console.log('Speaking commands:', commands);
    speak(`Available commands: ${commands}`);
  };

  // Debug info
  useEffect(() => {
    console.log('VoiceNavigation component state:', {
      isVoiceNavigationEnabled,
      isScreenReaderEnabled,
      isListening,
      lastSpokenText
    });
  }, [isVoiceNavigationEnabled, isScreenReaderEnabled, isListening, lastSpokenText]);

  return (
    <div id="voice-navigation" className="fixed bottom-4 left-4 z-40">
      {/* Voice Navigation Controls */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col space-y-2">
        {/* Voice Navigation Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleVoiceToggle}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isVoiceNavigationEnabled
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          aria-label={isVoiceNavigationEnabled ? 'Disable voice navigation' : 'Enable voice navigation'}
        >
          {isVoiceNavigationEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </motion.button>

        {/* Screen Reader Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleReaderToggle}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isScreenReaderEnabled
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-500 hover:bg-gray-600 text-white'
          }`}
          aria-label={isScreenReaderEnabled ? 'Disable screen reader' : 'Enable screen reader'}
        >
          {isScreenReaderEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        </motion.button>

        {/* Commands Help */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCommands(!showCommands)}
          className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200"
          aria-label="Show voice commands"
        >
          <span className="text-lg font-bold">?</span>
        </motion.button>
      </div>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
          >
            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Listening for commands...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Last Spoken Text */}
      <AnimatePresence>
        {lastSpokenText && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs"
          >
            <p className="text-sm font-medium">Voice Feedback:</p>
            <p className="text-sm">{lastSpokenText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Commands Help Panel */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommands(false)}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Voice Commands</h2>
                <button
                  onClick={() => setShowCommands(false)}
                  className="hover:bg-blue-700 p-1 rounded"
                  aria-label="Close commands help"
                >
                  ×
                </button>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    Say these commands to navigate and control the app:
                  </p>
                  <button
                    onClick={speakCommands}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Hear All Commands
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Navigation Commands */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Navigation</h3>
                    <div className="space-y-2">
                      {Object.entries(VOICE_COMMANDS)
                        .filter(([_, action]) => action.startsWith('/'))
                        .map(([command, action]) => (
                          <div key={command} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium text-gray-800">"{command}"</p>
                            <p className="text-sm text-gray-600">Go to {action.slice(1)}</p>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Control Commands */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Controls</h3>
                    <div className="space-y-2">
                      {Object.entries(VOICE_COMMANDS)
                        .filter(([_, action]) => !action.startsWith('/'))
                        .map(([command, action]) => (
                          <div key={command} className="bg-gray-50 p-3 rounded">
                            <p className="font-medium text-gray-800">"{command}"</p>
                            <p className="text-sm text-gray-600">{action}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Command History */}
                {commandHistory.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Recent Commands</h3>
                    <div className="space-y-1">
                      {commandHistory.map((command, index) => (
                        <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {command}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Progress Bar */}
      {isScreenReaderEnabled && (
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-40">
          <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: '0%' }}></div>
        </div>
      )}
    </div>
  );
};

export default VoiceNavigation; 