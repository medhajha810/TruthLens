import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Settings, 
  User, 
  Bell, 
  Eye,
  MessageCircle,
  Home,
  Newspaper,
  BarChart3,
  CheckCircle,
  Info,
  LogOut,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Info as InfoIcon,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import GlobalSearch from '../GlobalSearch';
import { useTheme } from '../../context/ThemeContext';
import { useDynamicTheme } from '../../context/DynamicThemeContext';
import LanguageSelector from '../LanguageSelector';
import { useTranslation } from '../../context/TranslationContext';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, setThemeMode, isDark } = useTheme();
  const { themeConfig } = useDynamicTheme();
  const { t, requestTranslation, currentLanguage, forceUpdate } = useTranslation();

  // Request translations for navigation items
  useEffect(() => {
    const navTexts = ['Home', 'News', 'Analysis', 'Fact Check', 'Social', 'About'];
    navTexts.forEach(text => {
      requestTranslation(text, currentLanguage);
    });
  }, [currentLanguage, requestTranslation]);

  // Request translations for notification texts
  useEffect(() => {
    const notificationTexts = [
      'Fact-check completed',
      'Your submitted claim has been verified',
      '2 minutes ago',
      'Bias detected',
      'High bias detected in trending article',
      '5 minutes ago',
      'New feature available',
      'Social sentiment analysis is now live',
      '1 hour ago',
      'Light',
      'Dark',
      'System'
    ];
    notificationTexts.forEach(text => {
      requestTranslation(text, currentLanguage);
    });
  }, [currentLanguage, requestTranslation]);

  // Force re-render when language changes
  useEffect(() => {
    // This will trigger re-render when forceUpdate changes
  }, [forceUpdate]);

  // Navigation array is rebuilt on every render for reactivity
  const navigation = [
    { name: t('Home'), href: '/', icon: Home },
    { name: t('News'), href: '/news', icon: Newspaper },
    { name: t('Analysis'), href: '/analysis', icon: BarChart3 },
    { name: t('Fact Check'), href: '/fact-check', icon: CheckCircle },
    { name: t('Social'), href: '/social', icon: MessageCircle },
    { name: t('About'), href: '/about', icon: Info },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: 'success',
      title: t('Fact-check completed'),
      message: t('Your submitted claim has been verified'),
      time: t('2 minutes ago'),
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: t('Bias detected'),
      message: t('High bias detected in trending article'),
      time: t('5 minutes ago'),
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: t('New feature available'),
      message: t('Social sentiment analysis is now live'),
      time: t('1 hour ago'),
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const isActive = (path) => location.pathname === path;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <InfoIcon className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200 dark:border-slate-600 shadow-soft transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-slate-300">TruthLens</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`nav-link ${
                      isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <div className="relative">
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className="p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>

                {/* Theme Menu */}
                <AnimatePresence>
                  {themeMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setThemeMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
                      >
                        <div className="py-2">
                          <button
                            onClick={() => {
                              setThemeMode('light');
                              setThemeMenuOpen(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              theme === 'light' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Sun className="w-4 h-4 mr-3" />
                            {t('Light')}
                          </button>
                          <button
                            onClick={() => {
                              setThemeMode('dark');
                              setThemeMenuOpen(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              theme === 'dark' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Moon className="w-4 h-4 mr-3" />
                            {t('Dark')}
                          </button>
                          <button
                            onClick={() => {
                              setThemeMode('system');
                              setThemeMenuOpen(false);
                            }}
                            className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                              theme === 'system' ? 'text-primary-600 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            <Monitor className="w-4 h-4 mr-3" />
                            {t('System')}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Language Selector */}
              <LanguageSelector />

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationOpen(!notificationOpen)}
                  className="p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {notificationOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setNotificationOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-20"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-slate-600">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('Notifications')}</h3>
                            {unreadCount > 0 && (
                              <span className="bg-primary-500 text-white text-xs px-2 py-1 rounded-full">
                                {unreadCount} {t('new')}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`p-4 border-b border-gray-100 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 cursor-pointer ${
                                  !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <div className="flex items-start space-x-3">
                                  {getNotificationIcon(notification.type)}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                      {notification.title}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-slate-300 mt-1">
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-gray-400 dark:text-slate-400 mt-2">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 dark:text-slate-400">
                              {t('No notifications')}
                            </div>
                          )}
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-slate-600">
                          <button className="w-full text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
                            {t('View all notifications')}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* User menu */}
              <div className="relative">
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5" />
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 z-20"
                      >
                        <div className="p-4 border-b border-gray-200 dark:border-slate-600">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Guest User')}</p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">guest@truthlens.com</p>
                            </div>
                          </div>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                            onClick={() => setProfileOpen(false)}
                          >
                            <User className="w-4 h-4 mr-3" />
                            {t('Profile')}
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700"
                            onClick={() => setProfileOpen(false)}
                          >
                            <Settings className="w-4 h-4 mr-3" />
                            {t('Settings')}
                          </Link>
                          <div className="border-t border-gray-200 dark:border-slate-600 my-2"></div>
                          <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700">
                            <LogOut className="w-4 h-4 mr-3" />
                            {t('Sign out')}
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('Search news, topics, or sources...')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-slate-700 dark:text-white dark:placeholder-slate-400"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-slate-800/90 shadow-strong z-50 md:hidden backdrop-blur-md"
            >
              <div className="flex flex-col h-full">
                {/* Sidebar header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-slate-600">
                  <Link to="/" className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900 dark:text-slate-300">TruthLens</span>
                  </Link>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 text-gray-600 dark:text-slate-200 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Sidebar navigation */}
                <nav className="flex-1 p-4 space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`nav-link ${
                          isActive(item.href) ? 'nav-link-active' : 'nav-link-inactive'
                        }`}
                      >
                        <Icon className="w-5 h-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>

                {/* Sidebar footer */}
                <div className="p-4 border-t border-gray-200 dark:border-slate-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{t('Guest User')}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{t('Viewing as guest')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Global Search */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Main content */}
      <main className="flex-1 relative z-10 min-h-[calc(100vh-8rem)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 dark:bg-slate-800/80 border-t border-gray-200 dark:border-slate-600 mt-auto backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-slate-300">TruthLens</span>
              </div>
              <p className="text-gray-600 dark:text-slate-300 mb-4 max-w-md">
                {t('A multi-perspective news analyzer designed to promote media literacy, combat misinformation, and empower users to critically evaluate news coverage.')}
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200 transition-colors">
                  <span className="sr-only">GitHub</span>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                {t('Features')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/news" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('News Aggregation')}
                  </Link>
                </li>
                <li>
                  <Link to="/analysis" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Sentiment Analysis')}
                  </Link>
                </li>
                <li>
                  <Link to="/fact-check" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Fact Checking')}
                  </Link>
                </li>
                <li>
                  <Link to="/social" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Social Sentiment')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                {t('Support')}
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('About Us')}
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Privacy Policy')}
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Terms of Service')}
                  </a>
                </li>
                <li>
                  <a href="mailto:optimus4586prime@gmail.com" className="text-gray-600 hover:text-gray-900 transition-colors">
                    {t('Contact')}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © 2024 TruthLens. {t('All rights reserved')}. {t('Built with ❤️ for media literacy')}.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout; 