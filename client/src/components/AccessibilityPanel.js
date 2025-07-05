import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Accessibility, 
  Volume2, 
  Eye, 
  Palette, 
  Type, 
  Contrast,
  Mic,
  MicOff,
  Play,
  Square,
  Settings,
  X
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const AccessibilityPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('voice');
  
  const {
    isVoiceNavigationEnabled,
    isScreenReaderEnabled,
    isColorblindModeEnabled,
    colorblindType,
    isHighContrastEnabled,
    fontSize,
    isReading,
    isListening,
    lastSpokenText,
    toggleVoiceNavigation,
    toggleScreenReader,
    toggleColorblindMode,
    toggleHighContrast,
    setColorblindType,
    setFontSize,
    speak,
    readCurrentPage,
    stopReading,
    COLORBLIND_THEMES,
    VOICE_COMMANDS
  } = useAccessibility();

  const tabs = [
    { id: 'voice', label: 'Voice Navigation', icon: Mic },
    { id: 'reader', label: 'Screen Reader', icon: Volume2 },
    { id: 'visual', label: 'Visual Aids', icon: Eye },
    { id: 'keyboard', label: 'Keyboard', icon: Settings },
    { id: 'commands', label: 'Voice Commands', icon: Settings }
  ];

  const handleFontSizeChange = (increment) => {
    const newSize = Math.max(12, Math.min(24, fontSize + increment));
    setFontSize(newSize);
    speak(`Font size set to ${newSize} pixels`);
  };

  const handleColorblindTypeChange = (type) => {
    setColorblindType(type);
    speak(`Colorblind mode set to ${type}`);
  };

  return (
    <>
      {/* Floating Accessibility Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Open accessibility panel"
      >
        <Accessibility className="w-5 h-5" />
      </motion.button>

      {/* Voice Navigation Status Indicator */}
      {isListening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 left-4 z-50 bg-red-500 text-white px-3 py-2 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">Listening...</span>
        </motion.div>
      )}

      {/* Last Spoken Text */}
      {lastSpokenText && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-16 right-4 z-50 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs"
        >
          <p className="text-sm">{lastSpokenText}</p>
        </motion.div>
      )}

      {/* Accessibility Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-hidden border-l border-gray-200"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Accessibility className="w-5 h-5" />
                <span>Accessibility</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-blue-700 p-1 rounded"
                aria-label="Close accessibility panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-3 px-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    <span className="block text-xs">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="p-4 overflow-y-auto h-full">
              {/* Voice Navigation Tab */}
              {activeTab === 'voice' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Voice Navigation</h3>
                      <p className="text-sm text-gray-600">Control the app with voice commands</p>
                    </div>
                    <button
                      onClick={toggleVoiceNavigation}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isVoiceNavigationEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isVoiceNavigationEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {isVoiceNavigationEnabled && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        Voice navigation is active. Try saying commands like "go home" or "read page".
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Screen Reader Tab */}
              {activeTab === 'reader' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">Screen Reader</h3>
                      <p className="text-sm text-gray-600">Read page content aloud</p>
                    </div>
                    <button
                      onClick={toggleScreenReader}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isScreenReaderEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isScreenReaderEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={readCurrentPage}
                      disabled={!isScreenReaderEnabled}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {isReading ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      <span>{isReading ? 'Stop Reading' : 'Read Page'}</span>
                    </button>
                  </div>

                  {isReading && (
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        Reading page content...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Visual Aids Tab */}
              {activeTab === 'visual' && (
                <div className="space-y-6">
                  {/* Font Size */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Font Size</h3>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleFontSizeChange(-2)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                        aria-label="Decrease font size"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-medium min-w-[3rem] text-center">
                        {fontSize}px
                      </span>
                      <button
                        onClick={() => handleFontSizeChange(2)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg"
                        aria-label="Increase font size"
                      >
                        <Type className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* High Contrast */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">High Contrast</h3>
                      <p className="text-sm text-gray-600">Increase text contrast</p>
                    </div>
                    <button
                      onClick={toggleHighContrast}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isHighContrastEnabled ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isHighContrastEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Colorblind Mode */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">Colorblind Mode</h3>
                      <button
                        onClick={toggleColorblindMode}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          isColorblindModeEnabled ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isColorblindModeEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                    
                    {isColorblindModeEnabled && (
                      <div className="space-y-2">
                        {Object.keys(COLORBLIND_THEMES).map((type) => (
                          <button
                            key={type}
                            onClick={() => handleColorblindTypeChange(type)}
                            className={`w-full p-2 rounded-lg text-left transition-colors ${
                              colorblindType === type
                                ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            <span className="capitalize font-medium">{type}</span>
                            <p className="text-xs text-gray-600">
                              Optimized for {type} color vision deficiency
                            </p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Keyboard Tab */}
              {activeTab === 'keyboard' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Keyboard Navigation</h3>
                  <p className="text-sm text-gray-600 mb-4">Use keyboard shortcuts to navigate the app</p>
                  
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Navigation Shortcuts</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">H</kbd> Home</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">N</kbd> News</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">A</kbd> Analysis</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">F</kbd> Fact Check</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">S</kbd> Social</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Action Shortcuts</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Space</kbd> Toggle Reading</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">/</kbd> Focus Search</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">?</kbd> Show Shortcuts</span>
                        </div>
                        <div className="flex justify-between">
                          <span><kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Esc</kbd> Close Modals</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Navigation Tips</h4>
                      <div className="space-y-1 text-sm text-blue-700">
                        <p>• Use <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Tab</kbd> to navigate between elements</p>
                        <p>• Use <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Arrow Keys</kbd> to navigate focusable elements</p>
                        <p>• Press <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Enter</kbd> or <kbd className="px-1 py-0.5 bg-blue-200 rounded text-xs">Space</kbd> to activate</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Voice Commands Tab */}
              {activeTab === 'commands' && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-800">Available Voice Commands</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {Object.entries(VOICE_COMMANDS).map(([command, action]) => (
                      <div key={command} className="bg-gray-50 p-3 rounded-lg">
                        <p className="font-medium text-gray-800">"{command}"</p>
                        <p className="text-sm text-gray-600">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityPanel; 