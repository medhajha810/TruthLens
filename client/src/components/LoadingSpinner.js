import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Search, 
  TrendingUp, 
  Shield, 
  Zap,
  Loader2,
  Newspaper,
  BarChart3,
  CheckCircle,
  MessageCircle
} from 'lucide-react';

const LoadingSpinner = ({ 
  type = 'default', 
  size = 'medium', 
  text = 'Loading...',
  showFact = true 
}) => {
  const [currentFact, setCurrentFact] = useState('');
  const [factIndex, setFactIndex] = useState(0);

  const facts = [
    "Did you know? The average person spends 2.5 hours daily consuming news content.",
    "Fact: AI can now detect fake news with 95% accuracy in some cases.",
    "Interesting: The most trusted news sources are typically local newspapers.",
    "Did you know? The first newspaper was published in 1605 in Strasbourg, Germany.",
    "Fact: Social media has changed how we consume news by 73% in the last decade.",
    "Interesting: The average news article takes 3-5 hours to fact-check thoroughly.",
    "Did you know? Fact-checking organizations have been around since the 1920s.",
    "Fact: The term 'fake news' was first used in the 1890s during the yellow journalism era."
  ];

  const typeConfigs = {
    default: {
      icon: Loader2,
      color: 'text-primary-600',
      bgColor: 'bg-primary-100',
      factCategory: 'general'
    },
    news: {
      icon: Newspaper,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      factCategory: 'news'
    },
    analysis: {
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      factCategory: 'analysis'
    },
    factCheck: {
      icon: CheckCircle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      factCategory: 'fact-checking'
    },
    social: {
      icon: MessageCircle,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      factCategory: 'social'
    },
    search: {
      icon: Search,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      factCategory: 'search'
    }
  };

  const sizeConfigs = {
    small: {
      container: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    medium: {
      container: 'w-12 h-12',
      icon: 'w-6 h-6',
      text: 'text-base'
    },
    large: {
      container: 'w-16 h-16',
      icon: 'w-8 h-8',
      text: 'text-lg'
    }
  };

  const config = typeConfigs[type] || typeConfigs.default;
  const sizeConfig = sizeConfigs[size] || sizeConfigs.medium;
  const Icon = config.icon;

  useEffect(() => {
    if (showFact) {
      const interval = setInterval(() => {
        setFactIndex((prev) => (prev + 1) % facts.length);
        setCurrentFact(facts[factIndex]);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [showFact, factIndex, facts]);

  useEffect(() => {
    setCurrentFact(facts[0]);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-6">
      {/* Spinner Container */}
      <div className="relative">
        {/* Background Circle */}
        <motion.div
          className={`${sizeConfig.container} ${config.bgColor} rounded-full flex items-center justify-center`}
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 360]
          }}
          transition={{ 
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 2, repeat: Infinity, ease: "linear" }
          }}
        >
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: [0, -360],
              scale: [1, 0.8, 1]
            }}
            transition={{ 
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Icon className={`${sizeConfig.icon} ${config.color}`} />
          </motion.div>
        </motion.div>

        {/* Orbiting Elements */}
        <motion.div
          className="absolute inset-0"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            animate={{ 
              scale: [0.5, 1, 0.5],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full`} />
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"
            animate={{ 
              scale: [1, 0.5, 1],
              opacity: [1, 0.3, 1]
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <div className={`w-1.5 h-1.5 ${config.color.replace('text-', 'bg-')} rounded-full`} />
          </motion.div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <motion.p
          className={`${sizeConfig.text} font-medium text-gray-700 dark:text-gray-300`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {text}
        </motion.p>
      </motion.div>

      {/* Fun Fact */}
      {showFact && currentFact && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-sm text-center"
        >
          <div className={`${config.bgColor} rounded-lg p-4 border-l-4 ${config.color.replace('text-', 'border-')}`}>
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Did You Know?
              </span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentFact}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="text-sm text-gray-600 dark:text-gray-400 italic"
              >
                {currentFact}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Progress Dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="flex space-x-1"
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 ${config.color.replace('text-', 'bg-')} rounded-full`}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 