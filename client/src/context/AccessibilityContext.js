import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Colorblind-friendly themes
const COLORBLIND_THEMES = {
  deuteranopia: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#059669',
    text: '#111827',
    background: '#f9fafb',
    surface: '#ffffff',
    error: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    info: '#2563eb'
  },
  protanopia: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#7c3aed',
    text: '#111827',
    background: '#f9fafb',
    surface: '#ffffff',
    error: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    info: '#2563eb'
  },
  tritanopia: {
    primary: '#1f2937',
    secondary: '#374151',
    accent: '#dc2626',
    text: '#111827',
    background: '#f9fafb',
    surface: '#ffffff',
    error: '#dc2626',
    warning: '#d97706',
    success: '#059669',
    info: '#2563eb'
  },
  achromatopsia: {
    primary: '#666666',
    secondary: '#999999',
    accent: '#333333',
    text: '#000000',
    background: '#ffffff',
    surface: '#f5f5f5',
    error: '#000000',
    warning: '#666666',
    success: '#333333',
    info: '#666666'
  }
};

// Voice commands
const VOICE_COMMANDS = {
  'go home': '/',
  'home': '/',
  'go to news': '/news',
  'news': '/news',
  'go to analysis': '/analysis',
  'analysis': '/analysis',
  'go to fact check': '/fact-check',
  'fact check': '/fact-check',
  'go to social': '/social',
  'social': '/social',
  'go to settings': '/settings',
  'settings': '/settings',
  'go to profile': '/profile',
  'profile': '/profile',
  'go to about': '/about',
  'about': '/about',
  'search': 'focus-search',
  'focus search': 'focus-search',
  'menu': 'toggle-menu',
  'toggle menu': 'toggle-menu',
  'close': 'close-modal',
  'close modal': 'close-modal',
  'back': 'go-back',
  'go back': 'go-back',
  'forward': 'go-forward',
  'go forward': 'go-forward',
  'refresh': 'refresh-page',
  'refresh page': 'refresh-page',
  'scroll up': 'scroll-up',
  'scroll down': 'scroll-down',
  'read page': 'read-page',
  'read': 'read-page',
  'stop reading': 'stop-reading',
  'stop': 'stop-reading',
  'increase font': 'increase-font',
  'decrease font': 'decrease-font',
  'toggle high contrast': 'toggle-high-contrast',
  'high contrast': 'toggle-high-contrast',
  'toggle colorblind mode': 'toggle-colorblind',
  'colorblind': 'toggle-colorblind',
  'toggle voice navigation': 'toggle-voice-nav',
  'voice navigation': 'toggle-voice-nav'
};

export const AccessibilityProvider = ({ children, navigateRef }) => {
  const [isVoiceNavigationEnabled, setIsVoiceNavigationEnabled] = useState(false);
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);
  const [isColorblindModeEnabled, setIsColorblindModeEnabled] = useState(false);
  const [colorblindType, setColorblindType] = useState('deuteranopia');
  const [isHighContrastEnabled, setIsHighContrastEnabled] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [isReading, setIsReading] = useState(false);
  const [currentReadingText, setCurrentReadingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState('');

  // Refs for speech synthesis and recognition
  const speechSynthesis = useRef(null);
  const speechRecognition = useRef(null);
  const readingUtterance = useRef(null);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // Initialize speech recognition (only once)
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    console.log('SpeechRecognition support:', SR);
    if (!SR) {
      alert('Your browser does not support speech recognition. Please use Chrome or Edge.');
      return;
    }
    if (!speechRecognition.current) {
      speechRecognition.current = new SR();
      speechRecognition.current.continuous = false;
      speechRecognition.current.interimResults = false;
      speechRecognition.current.lang = 'en-US';
      console.log('SpeechRecognition instance created:', speechRecognition.current);

      speechRecognition.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
        console.log('Voice command received:', transcript);
        handleVoiceCommand(transcript);
      };

      speechRecognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed' || event.error === 'denied') {
          alert('Microphone access denied. Please allow microphone permissions for voice navigation.');
        }
      };

      speechRecognition.current.onend = () => {
        setIsListening(false);
        console.log('Speech recognition ended. isVoiceNavigationEnabled:', isVoiceNavigationEnabled);
        if (isVoiceNavigationEnabled) {
          setTimeout(() => {
            if (isVoiceNavigationEnabled) {
              startListening();
            }
          }, 100);
        }
      };
    }
  }, []);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command) => {
    console.log('Processing voice command:', command);
    
    // Find matching command
    const matchedCommand = Object.keys(VOICE_COMMANDS).find(key => 
      command.includes(key) || key.includes(command)
    );

    if (matchedCommand) {
      const action = VOICE_COMMANDS[matchedCommand];
      executeVoiceAction(action);
      speak(`Executing ${matchedCommand}`);
    } else {
      speak(`Command not recognized: ${command}`);
    }
  }, []);

  // Execute voice actions
  const executeVoiceAction = useCallback((action) => {
    console.log('Executing action:', action);
    
    switch (action) {
      case '/':
        if (navigateRef.current) navigateRef.current('/');
        break;
      case '/news':
        if (navigateRef.current) navigateRef.current('/news');
        break;
      case '/analysis':
        if (navigateRef.current) navigateRef.current('/analysis');
        break;
      case '/fact-check':
        if (navigateRef.current) navigateRef.current('/fact-check');
        break;
      case '/social':
        if (navigateRef.current) navigateRef.current('/social');
        break;
      case '/settings':
        if (navigateRef.current) navigateRef.current('/settings');
        break;
      case '/profile':
        if (navigateRef.current) navigateRef.current('/profile');
        break;
      case '/about':
        if (navigateRef.current) navigateRef.current('/about');
        break;
      case 'focus-search':
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
        if (searchInput) searchInput.focus();
        break;
      case 'toggle-menu':
        const menuButton = document.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');
        if (menuButton) menuButton.click();
        break;
      case 'close-modal':
        const closeButton = document.querySelector('[aria-label*="close"], [aria-label*="Close"]');
        if (closeButton) closeButton.click();
        break;
      case 'go-back':
        window.history.back();
        break;
      case 'go-forward':
        window.history.forward();
        break;
      case 'refresh-page':
        window.location.reload();
        break;
      case 'scroll-up':
        window.scrollBy(0, -100);
        break;
      case 'scroll-down':
        window.scrollBy(0, 100);
        break;
      case 'read-page':
        readCurrentPage();
        break;
      case 'stop-reading':
        stopReading();
        break;
      case 'increase-font':
        setFontSize(prev => Math.min(prev + 2, 24));
        break;
      case 'decrease-font':
        setFontSize(prev => Math.max(prev - 2, 12));
        break;
      case 'toggle-high-contrast':
        setIsHighContrastEnabled(prev => !prev);
        break;
      case 'toggle-colorblind':
        setIsColorblindModeEnabled(prev => !prev);
        break;
      case 'toggle-voice-nav':
        setIsVoiceNavigationEnabled(prev => !prev);
        break;
      default:
        console.log('Unknown action:', action);
    }
  }, []);

  // Speak text using speech synthesis
  const speak = useCallback((text, options = {}) => {
    if (!speechSynthesis.current) return;
    speechSynthesis.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    utterance.lang = options.lang || 'en-US';
    utterance.onstart = () => setLastSpokenText(text);
    utterance.onend = () => setLastSpokenText('');
    speechSynthesis.current.speak(utterance);
  }, []);

  // Start listening for voice commands
  const startListening = useCallback(() => {
    if (speechRecognition.current && isVoiceNavigationEnabled) {
      try {
        console.log('Attempting to start speech recognition...');
        speechRecognition.current.start();
        setIsListening(true);
        speak('Voice navigation activated. Say a command.');
        console.log('Speech recognition started.');
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
        alert('Could not start voice recognition. Please check your microphone permissions and browser support.');
      }
    } else {
      console.log('Speech recognition not started. Current:', speechRecognition.current, 'isVoiceNavigationEnabled:', isVoiceNavigationEnabled);
    }
  }, [isVoiceNavigationEnabled, speak]);

  // Stop listening for voice commands
  const stopListening = useCallback(() => {
    if (speechRecognition.current) {
      try {
        speechRecognition.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
      setIsListening(false);
    }
  }, []);

  // Toggle voice navigation
  const toggleVoiceNavigation = useCallback(() => {
    setIsVoiceNavigationEnabled((prev) => !prev);
  }, []);

  // React to changes in isVoiceNavigationEnabled
  useEffect(() => {
    if (isVoiceNavigationEnabled) {
      startListening();
      speak('Voice navigation enabled');
    } else {
      stopListening();
      speak('Voice navigation disabled');
    }
  }, [isVoiceNavigationEnabled, startListening, stopListening, speak]);

  // Stop reading
  const stopReading = useCallback(() => {
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
    setIsReading(false);
    setCurrentReadingText('');
  }, []);

  // Read current page content - COMPLETELY REWRITTEN for better performance
  const readCurrentPage = useCallback(() => {
    if (isReading) {
      console.log('Already reading, stopping current reading');
      stopReading();
      return;
    }

    // Get all readable content from the page
    const getPageContent = () => {
      // Try to get main content first
      const mainContent = document.querySelector('main, [role="main"], .main-content, #main-content');
      let content = '';
      
      if (mainContent) {
        // Get all text content from main content
        const walker = document.createTreeWalker(
          mainContent,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // Skip script and style content
              const parent = node.parentElement;
              if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE')) {
                return NodeFilter.FILTER_REJECT;
              }
              // Skip empty text nodes
              if (!node.textContent.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
          textNodes.push(node.textContent.trim());
        }
        
        content = textNodes.join(' ');
      } else {
        // Fallback to body content, excluding navigation and footer
        const body = document.body;
        const walker = document.createTreeWalker(
          body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              const parent = node.parentElement;
              if (!parent) return NodeFilter.FILTER_REJECT;
              
              // Skip navigation, footer, and other non-content areas
              if (parent.closest('nav, header, footer, .navigation, .footer, .header')) {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip script and style content
              if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
                return NodeFilter.FILTER_REJECT;
              }
              
              // Skip empty text nodes
              if (!node.textContent.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              
              return NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
          textNodes.push(node.textContent.trim());
        }
        
        content = textNodes.join(' ');
      }

      return content;
    };

    const rawContent = getPageContent();
    
    if (!rawContent || rawContent.trim().length < 10) {
      speak('No readable content found on this page');
      return;
    }

    // Clean and format the content
    const cleanContent = rawContent
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .replace(/\t+/g, ' ') // Replace tabs with spaces
      .trim()
      .split(/[.!?]+/) // Split into sentences
      .filter(sentence => sentence.trim().length > 0) // Remove empty sentences
      .map(sentence => sentence.trim() + '.') // Add periods back
      .join(' '); // Join sentences with spaces

    if (cleanContent.length < 10) {
      speak('No readable content found on this page');
      return;
    }

    setIsReading(true);
    setCurrentReadingText(cleanContent);
    
    // Create utterance for the entire content
    const utterance = new SpeechSynthesisUtterance(cleanContent);
    utterance.rate = 0.9; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.lang = 'en-US';
    
    // Set voice if available
    if (speechSynthesis.current && speechSynthesis.current.getVoices) {
      const voices = speechSynthesis.current.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.default
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    }
    
    utterance.onstart = () => {
      console.log('Started reading page content:', cleanContent.length, 'characters');
      speak('Started reading page content');
    };

    utterance.onend = () => {
      console.log('Finished reading page content');
      setIsReading(false);
      setCurrentReadingText('');
      speak('Finished reading page content');
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsReading(false);
      setCurrentReadingText('');
      speak('Error occurred while reading page content');
    };

    utterance.onpause = () => {
      console.log('Reading paused');
    };

    utterance.onresume = () => {
      console.log('Reading resumed');
    };

    readingUtterance.current = utterance;
    
    // Cancel any existing speech before starting new one
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
      
      // Small delay to ensure cancellation is processed
      setTimeout(() => {
        try {
          speechSynthesis.current.speak(utterance);
        } catch (error) {
          console.error('Error starting speech synthesis:', error);
          setIsReading(false);
          setCurrentReadingText('');
          speak('Error starting speech synthesis');
        }
      }, 100);
    } else {
      speak('Speech synthesis not available');
      setIsReading(false);
      setCurrentReadingText('');
    }
  }, [isReading, speak, stopReading]);

  // Toggle screen reader
  const toggleScreenReader = useCallback(() => {
    const newState = !isScreenReaderEnabled;
    setIsScreenReaderEnabled(newState);
    speak(newState ? 'Screen reader enabled' : 'Screen reader disabled');
  }, [isScreenReaderEnabled, speak]);

  // Toggle colorblind mode
  const toggleColorblindMode = useCallback(() => {
    const newState = !isColorblindModeEnabled;
    setIsColorblindModeEnabled(newState);
    speak(newState ? 'Colorblind mode enabled' : 'Colorblind mode disabled');
  }, [isColorblindModeEnabled, speak]);

  // Toggle high contrast
  const toggleHighContrast = useCallback(() => {
    const newState = !isHighContrastEnabled;
    setIsHighContrastEnabled(newState);
    speak(newState ? 'High contrast enabled' : 'High contrast disabled');
  }, [isHighContrastEnabled, speak]);

  // Apply accessibility styles
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Apply font size
    root.style.setProperty('--accessibility-font-size', `${fontSize}px`);
    
    // Apply high contrast
    if (isHighContrastEnabled) {
      body.classList.add('high-contrast-mode');
    } else {
      body.classList.remove('high-contrast-mode');
    }
    
    // Apply colorblind theme
    if (isColorblindModeEnabled) {
      body.classList.add('colorblind-mode', colorblindType);
    } else {
      body.classList.remove('colorblind-mode', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia');
    }
  }, [fontSize, isHighContrastEnabled, isColorblindModeEnabled, colorblindType]);

  // Save preferences to localStorage
  useEffect(() => {
    const preferences = {
      isVoiceNavigationEnabled,
      isScreenReaderEnabled,
      isColorblindModeEnabled,
      colorblindType,
      isHighContrastEnabled,
      fontSize
    };
    localStorage.setItem('accessibility-preferences', JSON.stringify(preferences));
  }, [isVoiceNavigationEnabled, isScreenReaderEnabled, isColorblindModeEnabled, colorblindType, isHighContrastEnabled, fontSize]);

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-preferences');
    if (saved) {
      try {
        const preferences = JSON.parse(saved);
        setIsVoiceNavigationEnabled(preferences.isVoiceNavigationEnabled || false);
        setIsScreenReaderEnabled(preferences.isScreenReaderEnabled || false);
        setIsColorblindModeEnabled(preferences.isColorblindModeEnabled || false);
        setColorblindType(preferences.colorblindType || 'deuteranopia');
        setIsHighContrastEnabled(preferences.isHighContrastEnabled || false);
        setFontSize(preferences.fontSize || 16);
      } catch (error) {
        console.error('Error loading accessibility preferences:', error);
      }
    }
  }, []);

  const value = {
    // State
    isVoiceNavigationEnabled,
    isScreenReaderEnabled,
    isColorblindModeEnabled,
    colorblindType,
    isHighContrastEnabled,
    fontSize,
    isReading,
    currentReadingText,
    isListening,
    lastSpokenText,
    
    // Actions
    toggleVoiceNavigation,
    toggleScreenReader,
    toggleColorblindMode,
    toggleHighContrast,
    setColorblindType,
    setFontSize,
    speak,
    readCurrentPage,
    stopReading,
    startListening,
    stopListening,
    
    // Constants
    COLORBLIND_THEMES,
    VOICE_COMMANDS
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}; 