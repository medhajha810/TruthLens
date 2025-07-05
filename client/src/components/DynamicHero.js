import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/TranslationContext';

const DynamicHero = () => {
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [manualOverride, setManualOverride] = useState(false);

  const { t, requestTranslation, currentLanguage } = useTranslation();

  useEffect(() => {
    const heroTexts = [
      "See Through the",
      "Noise",
      "TruthLens provides a comprehensive and transparent view of current events through multi-source aggregation, sentiment analysis, and fact-checking.",
      "Explore News",
      "Learn More",
      "Morning Sky",
      "Day Sky",
      "Evening Sky",
      "Night Sky"
    ];
    heroTexts.forEach(text => {
      requestTranslation(text, currentLanguage);
    });
  }, [currentLanguage, requestTranslation]);

  const title = t("See Through the");
  const titleHighlight = t("Noise");
  const subtitle = t("TruthLens provides a comprehensive and transparent view of current events through multi-source aggregation, sentiment analysis, and fact-checking.");
  const exploreNews = t("Explore News");
  const learnMore = t("Learn More");
  const timeLabel = t(`${timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} Sky`);

  useEffect(() => {
    if (manualOverride) return;
    const updateTime = () => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 6 && hour < 12) {
        setTimeOfDay('morning');
      } else if (hour >= 12 && hour < 18) {
        setTimeOfDay('day');
      } else if (hour >= 18 && hour < 21) {
        setTimeOfDay('evening');
      } else {
        setTimeOfDay('night');
      }
      setCurrentTime(now);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [manualOverride]);

  const setManualTime = (time) => {
    setTimeOfDay(time);
    setManualOverride(true);
  };

  const resetToRealTime = () => {
    setManualOverride(false);
  };

  const skyConfigs = {
    morning: {
      background: 'from-orange-200 via-yellow-200 to-blue-300',
      sunPosition: 'translate-x-0 translate-y-0',
      sunColor: 'text-yellow-400',
      sunGlow: 'shadow-yellow-400/50 sun-glow',
      clouds: true,
      stars: false,
      moon: false,
      textColor: 'text-gray-800',
      overlay: 'bg-orange-100/20'
    },
    day: {
      background: 'from-blue-300 via-blue-400 to-blue-500',
      sunPosition: 'translate-x-8 translate-y-0',
      sunColor: 'text-yellow-300',
      sunGlow: 'shadow-yellow-300/50 sun-glow',
      clouds: true,
      stars: false,
      moon: false,
      textColor: 'text-white',
      overlay: 'bg-blue-100/20'
    },
    evening: {
      background: 'from-orange-400 via-pink-500 to-purple-600',
      sunPosition: 'translate-x-16 translate-y-8',
      sunColor: 'text-orange-400',
      sunGlow: 'shadow-orange-400/50 sun-glow',
      clouds: true,
      stars: false,
      moon: false,
      textColor: 'text-white',
      overlay: 'bg-orange-200/20'
    },
    night: {
      background: 'from-indigo-900 via-purple-900 to-gray-900',
      sunPosition: 'translate-x-32 translate-y-16',
      sunColor: 'text-gray-600',
      sunGlow: 'shadow-gray-600/20',
      clouds: false,
      stars: true,
      moon: true,
      textColor: 'text-white',
      overlay: 'bg-indigo-900/20'
    }
  };

  const config = skyConfigs[timeOfDay];

  return (
    <section className="relative overflow-hidden min-h-screen">
      <div className={`absolute inset-0 bg-gradient-to-br ${config.background} transition-all duration-1000`}>
        <motion.div
          className={`absolute top-20 right-20 w-24 h-24 ${config.sunColor} ${config.sunGlow} transition-all duration-1000 ${config.sunPosition}`}
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-full h-full rounded-full bg-current shadow-2xl"></div>
          <div className="absolute inset-0 rounded-full bg-current blur-sm opacity-50"></div>
        </motion.div>

        {config.moon && (
          <motion.div
            className="absolute top-32 right-32 w-16 h-16 text-gray-300 moon-glow"
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-full h-full rounded-full bg-current shadow-2xl"></div>
            <div className="absolute inset-0 rounded-full bg-current blur-sm opacity-30"></div>
            <div className="absolute top-2 left-2 w-2 h-2 bg-gray-400 rounded-full opacity-60"></div>
            <div className="absolute top-6 right-4 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-40"></div>
            <div className="absolute bottom-4 left-6 w-1 h-1 bg-gray-400 rounded-full opacity-50"></div>
          </motion.div>
        )}

        {config.stars && (
          <div className="absolute inset-0">
            {[...Array(80)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full star-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`shooting-${i}`}
                className="absolute w-0.5 h-0.5 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{ x: [0, 200], y: [0, 100], opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              />
            ))}
          </div>
        )}

        {config.clouds && (
          <div className="absolute inset-0">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/30 cloud-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${20 + Math.random() * 40}px`,
                }}
                animate={{ x: [0, 50, 0], opacity: [0.2, 0.4, 0.2] }}
                transition={{
                  duration: 20 + Math.random() * 20,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                }}
              >
                ☁️
              </motion.div>
            ))}
          </div>
        )}

        <div className={`absolute inset-0 ${config.overlay}`}></div>
      </div>

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-28 h-28 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
              <Eye className="w-16 h-16 text-white" />
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative font-extrabold mb-14 leading-[1.1] text-center select-none text-[clamp(12rem,34vw,40rem)] tracking-tight break-words whitespace-normal"
              style={{ 
                fontSize: 'clamp(10rem, 22vw, 28rem)',
                lineHeight: 1.1,
                fontFamily: 'inherit'
              }}
            >
              <span className="text-white drop-shadow-[0_8px_48px_rgba(255,255,255,0.35)] inline-block align-middle">
                {title}
              </span>
              <span className="inline-block w-1" />
              <motion.span
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-[length:200%_200%] bg-clip-text text-transparent drop-shadow-[0_8px_48px_rgba(255,180,0,0.35)] animate-glow inline-block align-middle"
                style={{
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundSize: '200% 200%',
                  filter: 'drop-shadow(0 0 32px #ffb40088) drop-shadow(0 0 8px #fff8)',
                  fontFamily: 'inherit',
                }}
              >
                {titleHighlight.toUpperCase()}
              </motion.span>
            </motion.h1>
            <p className={`text-4xl md:text-5xl mb-14 max-w-5xl mx-auto ${config.textColor} opacity-95 font-bold text-center`}>
              {subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/news"
              className="btn-primary text-xl px-10 py-5 inline-flex items-center font-semibold shadow-lg"
            >
              {exploreNews}
              <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
            <Link
              to="/about"
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-xl px-8 py-4 font-bold shadow-xl"
            >
              {learnMore}
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm">
        {timeLabel}
      </div>
    </section>
  );
};

export default DynamicHero;
