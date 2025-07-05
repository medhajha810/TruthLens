import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Search, 
  Home, 
  ArrowLeft, 
  RefreshCw, 
  AlertTriangle,
  Newspaper,
  BarChart3,
  CheckCircle,
  MessageCircle,
  Zap,
  Target
} from 'lucide-react';

const NotFound = () => {
  const [countdown, setCountdown] = useState(10);
  const [currentFact, setCurrentFact] = useState('');
  const navigate = useNavigate();

  const facts = useMemo(() => [
    "Did you know? The first newspaper was published in 1605 in Strasbourg, Germany.",
    "Fact: The term 'fake news' was first used in the 1890s during the yellow journalism era.",
    "Interesting: The average person spends 2.5 hours daily consuming news content.",
    "Did you know? Fact-checking organizations have been around since the 1920s.",
    "Fact: Social media has changed how we consume news by 73% in the last decade.",
    "Interesting: The most trusted news sources are typically local newspapers.",
    "Did you know? AI can now detect fake news with 95% accuracy in some cases.",
    "Fact: The average news article takes 3-5 hours to fact-check thoroughly."
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const factTimer = setInterval(() => {
      setCurrentFact(facts[Math.floor(Math.random() * facts.length)]);
    }, 4000);

    return () => clearInterval(factTimer);
  }, [facts]);

  const quickActions = [
    { name: 'Home', icon: Home, href: '/', color: 'from-blue-500 to-blue-600' },
    { name: 'News', icon: Newspaper, href: '/news', color: 'from-green-500 to-green-600' },
    { name: 'Analysis', icon: BarChart3, href: '/analysis', color: 'from-purple-500 to-purple-600' },
    { name: 'Fact Check', icon: CheckCircle, href: '/fact-check', color: 'from-orange-500 to-orange-600' },
    { name: 'Social', icon: MessageCircle, href: '/social', color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-soft p-8 mb-8"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-12 h-12 text-white" />
          </motion.div>

          {/* Error Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-slate-300 mb-4"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-slate-300 mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-lg text-gray-600 dark:text-slate-300 mb-8 max-w-md"
          >
            Oops! The page you're looking for seems to have wandered off into the digital wilderness.
          </motion.p>

          {/* Auto-redirect Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-50 rounded-lg p-4 mb-6"
          >
            <p className="text-sm text-blue-700">
              Redirecting to home in <span className="font-bold text-blue-900">{countdown}</span> seconds
            </p>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <motion.div
                className="bg-blue-600 h-2 rounded-full"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 10, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          </motion.div>
        </motion.div>

        {/* Fun Fact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-soft p-6 mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold text-gray-900">Did You Know?</h3>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
          <motion.p
            key={currentFact}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-gray-700 italic"
          >
            {currentFact}
          </motion.p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-soft p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={action.href}
                  className={`block p-4 rounded-xl bg-gradient-to-r ${action.color} text-white text-center transition-all duration-200 hover:shadow-lg`}
                >
                  <action.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{action.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 text-blue-200 opacity-30"
        >
          <Eye className="w-8 h-8" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-40 right-20 text-green-200 opacity-30"
        >
          <Target className="w-6 h-6" />
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 10, 0]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-20 left-20 text-purple-200 opacity-30"
        >
          <Search className="w-7 h-7" />
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound; 