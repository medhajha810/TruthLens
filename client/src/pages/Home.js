import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Eye, 
  TrendingUp, 
  Shield, 
  MessageCircle, 
  BarChart3, 
  CheckCircle,
  ArrowRight,
  Globe,
  Users,
  Zap,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useTranslation } from '../context/TranslationContext';
import DynamicThemeDemo from '../components/DynamicThemeDemo';
import DynamicHero from '../components/DynamicHero';
import TranslationDemo from '../components/TranslationDemo';
import ScreenReaderTest from '../components/ScreenReaderTest';

const Home = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [stats, setStats] = useState({
    articlesAnalyzed: 0,
    sourcesMonitored: 0,
    usersServed: 0,
    factChecks: 0
  });
  const [liveStats, setLiveStats] = useState({
    activeUsers: 0,
    articlesProcessed: 0,
    factChecksCompleted: 0,
    biasAlerts: 0
  });

  const { addNotification } = useNotifications();
  const { t, requestTranslation, currentLanguage, forceUpdate } = useTranslation();

  // Request translations for all text content
  useEffect(() => {
    const homeTexts = [
      'Multi-Source News Aggregation',
      'Collects news from multiple trusted sources to ensure balanced and diverse coverage of events.',
      'Sentiment & Bias Analysis',
      'Advanced algorithms assess article tone and highlight potential biases in news outlets.',
      'Social Media Integration',
      'Analyzes public sentiment from platforms like Twitter and Reddit for real-time reactions.',
      'Fact-Checking Integration',
      'Cross-references articles with reputable fact-checking organizations to verify claims.',
      'Combat Misinformation',
      'Identify and flag potentially false or misleading information',
      'Promote Media Literacy',
      'Help users develop critical thinking skills for news consumption',
      'Real-time Analysis',
      'Get instant insights into news credibility and bias',
      'Trusted Sources',
      'Access verified information from reputable fact-checking organizations',
      'Articles Analyzed',
      'Sources Monitored',
      'Users Served',
      'Fact Checks',
      'Key Features',
      'Discover the powerful tools that make TruthLens the ultimate platform for news analysis and fact-checking.',
      'Why Choose TruthLens?',
      'Join thousands of users who trust TruthLens to navigate the complex world of news and information.',
      'Live Platform Statistics',
      'Real-time data showing the impact of TruthLens in promoting media literacy and combating misinformation.',
      'Active Users',
      'Articles Processed',
      'Fact Checks Completed',
      'Bias Alerts',
      'Ready to Start Analyzing News?',
      'Join thousands of users who are already using TruthLens to make informed decisions about the news they consume.',
      'Explore News',
      'Try Analysis'
    ];

    homeTexts.forEach(text => {
      requestTranslation(text, currentLanguage);
    });
  }, [currentLanguage, requestTranslation]);

  // Force re-render when language changes
  useEffect(() => {
    // This will trigger re-render when forceUpdate changes
  }, [forceUpdate]);

  const features = [
    {
      icon: Globe,
      title: t('Multi-Source News Aggregation'),
      description: t('Collects news from multiple trusted sources to ensure balanced and diverse coverage of events.'),
      color: 'primary'
    },
    {
      icon: BarChart3,
      title: t('Sentiment & Bias Analysis'),
      description: t('Advanced algorithms assess article tone and highlight potential biases in news outlets.'),
      color: 'success'
    },
    {
      icon: MessageCircle,
      title: t('Social Media Integration'),
      description: t('Analyzes public sentiment from platforms like Twitter and Reddit for real-time reactions.'),
      color: 'warning'
    },
    {
      icon: CheckCircle,
      title: t('Fact-Checking Integration'),
      description: t('Cross-references articles with reputable fact-checking organizations to verify claims.'),
      color: 'danger'
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: t('Combat Misinformation'),
      description: t('Identify and flag potentially false or misleading information')
    },
    {
      icon: Users,
      title: t('Promote Media Literacy'),
      description: t('Help users develop critical thinking skills for news consumption')
    },
    {
      icon: Zap,
      title: t('Real-time Analysis'),
      description: t('Get instant insights into news credibility and bias')
    },
    {
      icon: Award,
      title: t('Trusted Sources'),
      description: t('Access verified information from reputable fact-checking organizations')
    }
  ];

  // Animate stats
  useEffect(() => {
    const targetStats = {
      articlesAnalyzed: 15420,
      sourcesMonitored: 150,
      usersServed: 8500,
      factChecks: 8920
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setStats({
        articlesAnalyzed: Math.floor(targetStats.articlesAnalyzed * progress),
        sourcesMonitored: Math.floor(targetStats.sourcesMonitored * progress),
        usersServed: Math.floor(targetStats.usersServed * progress),
        factChecks: Math.floor(targetStats.factChecks * progress)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  // Simulate live statistics updates
  useEffect(() => {
    const updateLiveStats = () => {
      setLiveStats(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 3),
        articlesProcessed: prev.articlesProcessed + Math.floor(Math.random() * 5),
        factChecksCompleted: prev.factChecksCompleted + Math.floor(Math.random() * 2),
        biasAlerts: prev.biasAlerts + Math.floor(Math.random() * 1)
      }));
    };

    const interval = setInterval(updateLiveStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Main Hero Section with id for highlight */}
      <section id="hero-section">
        <Helmet>
          <title>TruthLens - Multi-Perspective News Analyzer</title>
          <meta name="description" content="Discover TruthLens - the ultimate platform for news analysis, fact-checking, and combating misinformation with AI-powered insights." />
        </Helmet>

        {/* Hero Section */}
        <DynamicHero />
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-primary mb-2">
                {stats.articlesAnalyzed.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-slate-300">{t('Articles Analyzed')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-success mb-2">
                {stats.sourcesMonitored}
              </div>
              <div className="text-gray-600 dark:text-slate-300">{t('Sources Monitored')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-warning mb-2">
                {stats.usersServed.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-slate-300">{t('Users Served')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-gradient-danger mb-2">
                {stats.factChecks.toLocaleString()}
              </div>
              <div className="text-gray-600 dark:text-slate-300">{t('Fact Checks')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {t('Key Features')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto"
            >
              {t('Discover the powerful tools that make TruthLens the ultimate platform for news analysis and fact-checking.')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              {t('Why Choose TruthLens?')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-slate-300 max-w-3xl mx-auto"
            >
              {t('Join thousands of users who trust TruthLens to navigate the complex world of news and information.')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300">
                    {benefit.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              {t('Live Platform Statistics')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg text-primary-100 max-w-3xl mx-auto"
            >
              {t('Real-time data showing the impact of TruthLens in promoting media literacy and combating misinformation.')}
            </motion.p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {liveStats.activeUsers}
              </div>
              <div className="text-primary-100">{t('Active Users')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {liveStats.articlesProcessed}
              </div>
              <div className="text-primary-100">{t('Articles Processed')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {liveStats.factChecksCompleted}
              </div>
              <div className="text-primary-100">{t('Fact Checks Completed')}</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {liveStats.biasAlerts}
              </div>
              <div className="text-primary-100">{t('Bias Alerts')}</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            {t('Ready to Start Analyzing News?')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
          >
            {t('Join thousands of users who are already using TruthLens to make informed decisions about the news they consume.')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/news"
              className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('Explore News')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/analysis"
              className="inline-flex items-center px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              {t('Try Analysis')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Theme Demo */}
      <DynamicThemeDemo />

      {/* Translation Demo */}
      <TranslationDemo />

      {/* Screen Reader Test */}
      <ScreenReaderTest />
    </>
  );
};

export default Home; 