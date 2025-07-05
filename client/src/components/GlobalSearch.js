import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, BarChart3, CheckCircle, Globe } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const tabs = [
    { id: 'all', name: 'All', icon: Search },
    { id: 'news', name: 'News', icon: Globe },
    { id: 'analysis', name: 'Analysis', icon: BarChart3 },
    { id: 'factcheck', name: 'Fact Check', icon: CheckCircle }
  ];

  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const promises = [];

      // Search news
      if (activeTab === 'all' || activeTab === 'news') {
        promises.push(
          axios.get('/api/news/search', { params: { q: searchQuery, limit: 5 } })
            .then(response => ({ type: 'news', data: response.data.articles || [] }))
            .catch(() => ({ type: 'news', data: [] }))
        );
      }

      // Search analysis (simulate)
      if (activeTab === 'all' || activeTab === 'analysis') {
        promises.push(
          Promise.resolve({
            type: 'analysis',
            data: [
              {
                id: 'analysis_1',
                title: `Sentiment Analysis for "${searchQuery}"`,
                description: 'Analyze sentiment and bias for this topic',
                type: 'analysis',
                url: `/analysis?topic=${encodeURIComponent(searchQuery)}`
              }
            ]
          })
        );
      }

      // Search fact checks
      if (activeTab === 'all' || activeTab === 'factcheck') {
        promises.push(
          Promise.resolve({
            type: 'factcheck',
            data: [
              {
                id: 'factcheck_1',
                title: `Fact Check: "${searchQuery}"`,
                description: 'Verify claims related to this topic',
                type: 'factcheck',
                url: `/fact-check?claim=${encodeURIComponent(searchQuery)}`
              }
            ]
          })
        );
      }

      const results = await Promise.all(promises);
      const allResults = results.flatMap(result => 
        result.data.map(item => ({ ...item, category: result.type }))
      );

      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        handleSearch(query);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query, activeTab]);

  const handleResultClick = (result) => {
    if (result.url) {
      if (result.url.startsWith('/')) {
        navigate(result.url);
      } else {
        window.open(result.url, '_blank');
      }
    }
    onClose();
    setQuery('');
  };

  const getResultIcon = (category) => {
    switch (category) {
      case 'news':
        return Globe;
      case 'analysis':
        return BarChart3;
      case 'factcheck':
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const getResultColor = (category) => {
    switch (category) {
      case 'news':
        return 'text-blue-600';
      case 'analysis':
        return 'text-green-600';
      case 'factcheck':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20 px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[70vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search news, analysis, fact checks..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Tabs */}
              <div className="flex space-x-1 mt-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-2">Searching...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {results.map((result, index) => {
                    const Icon = getResultIcon(result.category);
                    return (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleResultClick(result)}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${getResultColor(result.category)}`} />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 line-clamp-1">
                              {result.title}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {result.description}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 ${getResultColor(result.category)}`}>
                                {result.category}
                              </span>
                              {result.source && (
                                <span className="text-xs text-gray-500">
                                  {result.source}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : query.trim() ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No results found for "{query}"</p>
                  <p className="text-sm text-gray-500 mt-1">Try different keywords or check spelling</p>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Start typing to search</p>
                  <p className="text-sm text-gray-500 mt-1">Search across news, analysis, and fact checks</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalSearch; 