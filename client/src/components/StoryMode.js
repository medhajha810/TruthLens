import React, { useState, useEffect, useRef } from 'react';
import { User, ArrowRight, ArrowLeft, X, Volume2, VolumeX, Play, Pause, Globe, Palette, Mic, Keyboard, Eye, Languages, ArrowUp } from 'lucide-react';

const STORY_STEPS = [
  {
    text: "👋 Hi there! I'm Truthy, your friendly guide to TruthLens! I'm here to help you discover all the amazing features that make TruthLens the ultimate platform for news analysis and fact-checking. Ready for an exciting journey?",
    highlight: null,
    speech: "Hi there! I'm Truthy, your friendly guide to TruthLens! I'm here to help you discover all the amazing features that make TruthLens the ultimate platform for news analysis and fact-checking. Ready for an exciting journey?",
    arrowTarget: null
  },
  {
    text: "🎯 This is our powerful mission statement - 'See Through the NOISE'. We believe in helping you find truth in today's complex media landscape. Our platform uses advanced AI to analyze news from multiple perspectives.",
    highlight: '#hero-section',
    speech: "This is our powerful mission statement - See Through the NOISE. We believe in helping you find truth in today's complex media landscape. Our platform uses advanced AI to analyze news from multiple perspectives.",
    arrowTarget: '#hero-section'
  },
  {
    text: "📊 Check out these live statistics! We've analyzed thousands of articles and helped countless users. The numbers keep growing every day as more people discover the power of TruthLens!",
    highlight: '#stats-section',
    speech: "Check out these live statistics! We've analyzed thousands of articles and helped countless users. The numbers keep growing every day as more people discover the power of TruthLens!",
    arrowTarget: '#stats-section'
  },
  {
    text: "🌍 Multilingual Support - TruthLens speaks your language! We support multiple languages and can translate content in real-time. Look for the language selector in the navigation bar to change your preferred language.",
    highlight: 'nav',
    speech: "Multilingual Support - TruthLens speaks your language! We support multiple languages and can translate content in real-time. Look for the language selector in the navigation bar to change your preferred language.",
    arrowTarget: '.language-selector'
  },
  {
    text: "🎨 Dynamic Theming - Our platform adapts to real-time data! The theme changes based on current events, weather, and trending topics. Notice how the colors and atmosphere shift to reflect what's happening in the world.",
    highlight: '#hero-section',
    speech: "Dynamic Theming - Our platform adapts to real-time data! The theme changes based on current events, weather, and trending topics. Notice how the colors and atmosphere shift to reflect what's happening in the world.",
    arrowTarget: '#hero-section'
  },
  {
    text: "♿ Accessibility Panel - This is where the magic happens for inclusive design! You can adjust colors for colorblind users, enable high contrast mode, change font sizes, and activate voice commands. We believe everyone should access truth!",
    highlight: '#accessibility-panel',
    speech: "Accessibility Panel - This is where the magic happens for inclusive design! You can adjust colors for colorblind users, enable high contrast mode, change font sizes, and activate voice commands. We believe everyone should access truth!",
    arrowTarget: '#accessibility-panel'
  },
  {
    text: "🎤 Voice Navigation - Control TruthLens with your voice! Click the microphone icon to activate voice commands. You can say things like 'go to news', 'analyze this', or 'fact check'. It's like having a personal assistant!",
    highlight: '#voice-navigation',
    speech: "Voice Navigation - Control TruthLens with your voice! Click the microphone icon to activate voice commands. You can say things like 'go to news', 'analyze this', or 'fact check'. It's like having a personal assistant!",
    arrowTarget: '#voice-navigation'
  },
  {
    text: "⌨️ Keyboard Navigation - Navigate the entire site using just your keyboard! Use Tab to move between elements, Enter to activate, and arrow keys to navigate. We've made sure everything is accessible without a mouse.",
    highlight: '#keyboard-navigation',
    speech: "Keyboard Navigation - Navigate the entire site using just your keyboard! Use Tab to move between elements, Enter to activate, and arrow keys to navigate. We've made sure everything is accessible without a mouse.",
    arrowTarget: '#keyboard-navigation'
  },
  {
    text: "📖 Screen Reader Support - Our platform works seamlessly with screen readers! Every element is properly labeled and described. Users with visual impairments can navigate and use all features independently.",
    highlight: '#screen-reader',
    speech: "Screen Reader Support - Our platform works seamlessly with screen readers! Every element is properly labeled and described. Users with visual impairments can navigate and use all features independently.",
    arrowTarget: '#screen-reader'
  },
  {
    text: "🔊 Text-to-Speech - Listen to articles and content! Each news article has a text-to-speech button. Perfect for multitasking, commuting, or when you prefer listening over reading. Just click the play button on any article.",
    highlight: '#news-section',
    speech: "Text-to-Speech - Listen to articles and content! Each news article has a text-to-speech button. Perfect for multitasking, commuting, or when you prefer listening over reading. Just click the play button on any article.",
    arrowTarget: '#news-section'
  },
  {
    text: "📰 News Aggregation - We collect articles from multiple trusted sources like BBC, CNN, Reuters, and more. Each article shows bias indicators and fact-checking results. You'll see different perspectives on the same story.",
    highlight: '#news-section',
    speech: "News Aggregation - We collect articles from multiple trusted sources like BBC, CNN, Reuters, and more. Each article shows bias indicators and fact-checking results. You'll see different perspectives on the same story.",
    arrowTarget: 'nav a[href="/news"]'
  },
  {
    text: "🔍 Analysis Tools - Our AI-powered analysis is like having a superpower! You can analyze any text for sentiment, bias, and credibility. Just paste text and get instant insights with detailed breakdowns.",
    highlight: '#analysis-section',
    speech: "Analysis Tools - Our AI-powered analysis is like having a superpower! You can analyze any text for sentiment, bias, and credibility. Just paste text and get instant insights with detailed breakdowns.",
    arrowTarget: 'nav a[href="/analysis"]'
  },
  {
    text: "✅ Fact Checking - Our secret weapon against misinformation! We cross-reference claims with trusted fact-checking organizations like PolitiFact and FactCheck.org. Get verified results and source credibility scores.",
    highlight: '#fact-check-section',
    speech: "Fact Checking - Our secret weapon against misinformation! We cross-reference claims with trusted fact-checking organizations like PolitiFact and FactCheck.org. Get verified results and source credibility scores.",
    arrowTarget: 'nav a[href="/fact-check"]'
  },
  {
    text: "💬 Social Sentiment - See what people are really thinking! We analyze social media reactions to news stories from Twitter, Reddit, and other platforms. Get real-time public opinion and trending discussions.",
    highlight: '#social-section',
    speech: "Social Sentiment - See what people are really thinking! We analyze social media reactions to news stories from Twitter, Reddit, and other platforms. Get real-time public opinion and trending discussions.",
    arrowTarget: 'nav a[href="/social"]'
  },
  {
    text: "🎉 You're all set! You now know your way around TruthLens. From dynamic theming to voice navigation, multilingual support to accessibility features - you have everything you need to navigate the complex world of news with confidence. Happy fact-finding!",
    highlight: null,
    speech: "You're all set! You now know your way around TruthLens. From dynamic theming to voice navigation, multilingual support to accessibility features - you have everything you need to navigate the complex world of news with confidence. Happy fact-finding!",
    arrowTarget: null
  },
];

const StoryMode = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [arrowPosition, setArrowPosition] = useState(null);
  const [dialogPosition, setDialogPosition] = useState('bottom-center');
  const speechRef = useRef(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    const supported = 'speechSynthesis' in window;
    setSpeechSupported(supported);
    if (!supported) {
      setSpeechEnabled(false);
      setAutoPlay(false);
    }
  }, []);

  // Start speaking immediately when component mounts
  useEffect(() => {
    if (speechSupported && speechEnabled && autoPlay) {
      // Start speaking immediately
      setTimeout(() => {
        speakText(STORY_STEPS[0].speech);
      }, 300);
    }
  }, [speechSupported, speechEnabled, autoPlay]);

  const handleNext = () => setStep((s) => Math.min(s + 1, STORY_STEPS.length - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));
  const handleSkip = () => {
    if (speechRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    onClose && onClose();
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechRef.current && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
  };

  const speakText = (text) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    
    try {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }

      speechRef.current = new SpeechSynthesisUtterance(text);
      speechRef.current.rate = 0.9;
      speechRef.current.pitch = 1.2; // Higher pitch for female voice
      speechRef.current.volume = 0.8;
      
      // Try to set a female voice
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.includes('female') || 
        voice.name.includes('Female') ||
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen')
      );
      
      if (femaleVoice) {
        speechRef.current.voice = femaleVoice;
      }
      
      speechRef.current.onstart = () => setIsSpeaking(true);
      speechRef.current.onend = () => setIsSpeaking(false);
      speechRef.current.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(speechRef.current);
    } catch (error) {
      console.warn('Speech synthesis not available:', error);
      setIsSpeaking(false);
    }
  };

  const pauseSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  };

  const resumeSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.resume();
    }
  };

  // Calculate arrow position for target element
  const updateArrowPosition = (targetSelector) => {
    if (!targetSelector) {
      setArrowPosition(null);
      return;
    }

    const targetElement = document.querySelector(targetSelector);
    if (targetElement) {
      const rect = targetElement.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Calculate arrow position based on target location
      let arrowX, arrowY, arrowDirection;
      
      if (rect.top < windowHeight / 2) {
        // Target is in upper half - arrow points down
        arrowY = rect.bottom + 10;
        arrowDirection = 'down';
      } else {
        // Target is in lower half - arrow points up
        arrowY = rect.top - 30;
        arrowDirection = 'up';
      }
      
      if (rect.left < windowWidth / 2) {
        // Target is in left half - arrow points right
        arrowX = rect.right + 10;
        arrowDirection = arrowDirection === 'up' ? 'up-right' : 'down-right';
      } else {
        // Target is in right half - arrow points left
        arrowX = rect.left - 30;
        arrowDirection = arrowDirection === 'up' ? 'up-left' : 'down-left';
      }
      
      setArrowPosition({ x: arrowX, y: arrowY, direction: arrowDirection });
    }
  };

  // Get dialog position and style based on current step
  const getDialogPosition = (currentStep) => {
    const positions = [
      'bottom-center', // Welcome
      'top-center',    // Mission statement
      'bottom-left',   // Statistics
      'top-right',     // Navigation
      'center',        // Dynamic theming
      'bottom-right',  // Accessibility panel
      'bottom-left',   // Voice navigation
      'top-left',      // Keyboard navigation
      'center-right',  // Screen reader
      'top-center',    // Text-to-speech
      'bottom-center', // News aggregation
      'top-left',      // Analysis tools
      'center-left',   // Fact checking
      'bottom-right',  // Social sentiment
      'center'         // Conclusion
    ];
    
    return positions[currentStep] || 'bottom-center';
  };

  // Get dialog style based on position
  const getDialogStyle = (position) => {
    const baseClasses = "relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border-4 border-blue-400 dark:border-yellow-400 flex items-start gap-4";
    
    switch (position) {
      case 'top-center':
        return `${baseClasses} max-w-lg`;
      case 'top-left':
        return `${baseClasses} max-w-md`;
      case 'top-right':
        return `${baseClasses} max-w-sm`;
      case 'center':
        return `${baseClasses} max-w-xl`;
      case 'center-left':
        return `${baseClasses} max-w-lg`;
      case 'center-right':
        return `${baseClasses} max-w-md`;
      case 'bottom-left':
        return `${baseClasses} max-w-sm`;
      case 'bottom-center':
        return `${baseClasses} max-w-lg`;
      case 'bottom-right':
        return `${baseClasses} max-w-md`;
      default:
        return `${baseClasses} max-w-lg`;
    }
  };

  // Get container style based on position
  const getContainerStyle = (position) => {
    switch (position) {
      case 'top-center':
        return "fixed inset-0 z-50 flex items-start justify-center pointer-events-none pt-8";
      case 'top-left':
        return "fixed inset-0 z-50 flex items-start justify-start pointer-events-none pt-8 pl-8";
      case 'top-right':
        return "fixed inset-0 z-50 flex items-start justify-end pointer-events-none pt-8 pr-8";
      case 'center':
        return "fixed inset-0 z-50 flex items-center justify-center pointer-events-none";
      case 'center-left':
        return "fixed inset-0 z-50 flex items-center justify-start pointer-events-none pl-8";
      case 'center-right':
        return "fixed inset-0 z-50 flex items-center justify-end pointer-events-none pr-8";
      case 'bottom-left':
        return "fixed inset-0 z-50 flex items-end justify-start pointer-events-none pb-8 pl-8";
      case 'bottom-center':
        return "fixed inset-0 z-50 flex items-end justify-center pointer-events-none pb-8";
      case 'bottom-right':
        return "fixed inset-0 z-50 flex items-end justify-end pointer-events-none pb-8 pr-8";
      default:
        return "fixed inset-0 z-50 flex items-end justify-center pointer-events-none pb-8";
    }
  };

  // Handle element highlighting, arrow positioning, and dialog positioning
  useEffect(() => {
    const highlight = STORY_STEPS[step].highlight;
    const arrowTarget = STORY_STEPS[step].arrowTarget;
    
    // Update dialog position
    const newPosition = getDialogPosition(step);
    setDialogPosition(newPosition);
    
    if (highlight) {
      const el = document.querySelector(highlight);
      if (el) {
        el.classList.add('story-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return () => { 
        if (el) el.classList.remove('story-highlight'); 
      };
    }
    
    // Update arrow position
    updateArrowPosition(arrowTarget);
  }, [step]);

  // Auto-speak when step changes
  useEffect(() => {
    if (speechEnabled && autoPlay && step > 0) {
      speakText(STORY_STEPS[step].speech);
    }
  }, [step, speechEnabled, autoPlay]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (speechRef.current && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handleBack();
      } else if (e.key === 'Escape') {
        handleSkip();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isSpeaking) {
          pauseSpeech();
        } else {
          resumeSpeech();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isSpeaking]);

  return (
    <div className={getContainerStyle(dialogPosition)}>
      {/* Animated Arrow */}
      {arrowPosition && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{ 
            left: arrowPosition.x, 
            top: arrowPosition.y,
            transform: `rotate(${arrowPosition.direction === 'up' ? '0deg' : 
                                 arrowPosition.direction === 'down' ? '180deg' : 
                                 arrowPosition.direction === 'left' ? '-90deg' : 
                                 arrowPosition.direction === 'right' ? '90deg' : 
                                 arrowPosition.direction === 'up-left' ? '-45deg' : 
                                 arrowPosition.direction === 'up-right' ? '45deg' : 
                                 arrowPosition.direction === 'down-left' ? '-135deg' : '135deg'})`
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-12 border-b-red-500 animate-bounce"></div>
            <div className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg animate-pulse">
              Click here!
            </div>
          </div>
        </div>
      )}

      <div className="pointer-events-auto">
        <div className={getDialogStyle(dialogPosition)}>
          {/* Character Avatar */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-4xl shadow-lg">
              <span role="img" aria-label="Truthy the Guide">🧑‍🏫</span>
            </div>
            <div className="text-center mt-1">
              <div className="text-xs font-bold text-blue-600 dark:text-yellow-400">Truthy</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Your Guide</div>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-bold text-gray-900 dark:text-yellow-300">
                Step {step + 1} of {STORY_STEPS.length}
              </div>
              <div className="flex items-center gap-1">
                {/* Voice Controls */}
                <button
                  onClick={toggleSpeech}
                  className="p-1.5 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-yellow-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition"
                  aria-label={speechEnabled ? "Disable speech" : "Enable speech"}
                >
                  {speechEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                </button>
                {speechEnabled && (
                  <button
                    onClick={toggleAutoPlay}
                    className={`p-1.5 rounded-full transition ${
                      autoPlay 
                        ? 'bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-200' 
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-yellow-200'
                    }`}
                    aria-label={autoPlay ? "Disable auto-play" : "Enable auto-play"}
                  >
                    {autoPlay ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                  </button>
                )}
                {isSpeaking && (
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-3 bg-blue-500 animate-pulse rounded"></div>
                    <div className="w-0.5 h-3 bg-blue-500 animate-pulse rounded" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-0.5 h-3 bg-blue-500 animate-pulse rounded" style={{animationDelay: '0.2s'}}></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="text-sm text-gray-700 dark:text-yellow-100 mb-4 leading-relaxed">
              {STORY_STEPS[step].text}
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((step + 1) / STORY_STEPS.length) * 100}%` }}
              ></div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={handleBack}
                  disabled={step === 0}
                  className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-yellow-200 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-slate-600 transition flex items-center gap-1 text-xs"
                  aria-label="Previous step"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={step === STORY_STEPS.length - 1}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center gap-1 text-xs disabled:opacity-50"
                  aria-label="Next step"
                >
                  {step === STORY_STEPS.length - 1 ? 'Finish' : 'Next'}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={handleSkip}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition flex items-center gap-1 text-xs"
                aria-label="Skip Story Mode"
              >
                <X className="w-3 h-3" />
                Skip
              </button>
            </div>
            
            {/* Keyboard Shortcuts Help */}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
              💡 Tip: Use arrow keys to navigate, Space to pause/resume speech, Esc to skip
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced highlight styling */}
      <style>{`
        .story-highlight {
          box-shadow: 0 0 0 8px #facc15, 0 0 40px 12px #fbbf24aa !important;
          z-index: 1000 !important;
          position: relative !important;
          transition: all 0.3s ease !important;
          transform: scale(1.02) !important;
          border-radius: 8px !important;
        }
        .story-highlight::before {
          content: '';
          position: absolute;
          top: -12px;
          left: -12px;
          right: -12px;
          bottom: -12px;
          background: linear-gradient(45deg, #facc15, #fbbf24, #f59e0b, #facc15);
          background-size: 400% 400%;
          animation: shimmer 2s ease-in-out infinite;
          border-radius: 12px;
          z-index: -1;
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default StoryMode; 