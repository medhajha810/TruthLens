import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  Search, 
  Filter, 
  Globe, 
  TrendingUp, 
  Clock, 
  ExternalLink,
  Share2,
  Bookmark,
  Eye,
  Calendar,
  Newspaper,
  Star,
  ThumbsUp,
  MessageCircle,
  ThumbsDown
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import TextToSpeechButton from '../components/TextToSpeechButton';

const News = () => {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [selectedSource, setSelectedSource] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');

  const topics = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'technology', name: 'Technology', icon: TrendingUp },
    { id: 'business', name: 'Business', icon: TrendingUp },
    { id: 'politics', name: 'Politics', icon: Globe },
    { id: 'health', name: 'Health', icon: TrendingUp },
    { id: 'science', name: 'Science', icon: TrendingUp },
    { id: 'sports', name: 'Sports', icon: TrendingUp },
    { id: 'entertainment', name: 'Entertainment', icon: TrendingUp }
  ];

  const sources = [
    { id: 'all', name: 'All Sources' },
    { id: 'guardian', name: 'The Guardian' },
    { id: 'newsapi', name: 'NewsAPI' },
    { id: 'hackernews', name: 'Hacker News' }
  ];

  // Fetch news data
  const { data: newsData, isLoading, error, refetch } = useQuery(
    ['news', selectedTopic, selectedSource, sortBy],
    async () => {
      const response = await axios.get('/api/news/aggregate', {
        params: {
          topic: selectedTopic,
          source: selectedSource === 'all' ? undefined : selectedSource,
          sortBy
        }
      });
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  // Fetch trending topics
  const { data: trendingData } = useQuery(
    'trending-topics',
    async () => {
      const response = await axios.get('/api/news/trending');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Filter articles based on search query
  const filteredArticles = newsData?.articles?.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Submit feedback mutation
  const feedbackMutation = useMutation(
    async (feedbackData) => {
      const response = await axios.post('/api/user/feedback', feedbackData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Feedback submitted successfully!');
        setShowFeedbackModal(false);
        setFeedbackRating(0);
        setFeedbackComment('');
      },
      onError: (error) => {
        toast.error('Failed to submit feedback. Please try again.');
      }
    }
  );

  // Vote mutation
  const voteMutation = useMutation(
    async (voteData) => {
      const response = await axios.post('/api/user/vote', voteData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Vote submitted successfully!');
      },
      onError: (error) => {
        toast.error('Failed to submit vote. Please try again.');
      }
    }
  );

  const handleShare = async (article) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url
        });
      } else {
        await navigator.clipboard.writeText(article.url);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleBookmark = (article) => {
    // In a real app, this would save to user's bookmarks
    toast.success('Article bookmarked!');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getBiasColor = (bias) => {
    switch (bias) {
      case 'left-leaning': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30';
      case 'right-leaning': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'center': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'sensationalist': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const handleFeedback = (article) => {
    setSelectedArticle(article);
    setShowFeedbackModal(true);
  };

  const handleVote = (article, vote) => {
    voteMutation.mutate({
      userId: 'demo-user',
      articleId: article.id,
      vote,
      reason: `User voted ${vote} for this article`
    });
  };

  const handleSubmitFeedback = () => {
    if (feedbackRating === 0) {
      toast.error('Please select a rating');
      return;
    }

    feedbackMutation.mutate({
      userId: 'demo-user',
      articleId: selectedArticle.id,
      rating: feedbackRating,
      comment: feedbackComment,
      category: selectedTopic
    });
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 dark:text-red-400 mb-4">Failed to load news</div>
        <button onClick={() => refetch()} className="btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>News - TruthLens</title>
        <meta name="description" content="Explore news from multiple sources with bias analysis and fact-checking insights." />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">Latest News</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Explore news from multiple sources with bias analysis and fact-checking insights
          </p>
        </div>

        {/* Filters and Search */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>

            {/* Topic Filter */}
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="input"
            >
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>

            {/* Source Filter */}
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="input"
            >
              {sources.map(source => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input"
            >
              <option value="publishedAt">Latest</option>
              <option value="relevancy">Most Relevant</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-slate-400 hover:text-gray-600 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="text-sm text-gray-500 dark:text-slate-400">
              {filteredArticles.length} articles found
            </div>
          </div>
        </div>

        {/* Trending Topics */}
        {trendingData && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {trendingData.topics?.slice(0, 8).map(topic => (
                <button
                  key={topic.category}
                  onClick={() => setSelectedTopic(topic.category)}
                  className="badge-primary hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors cursor-pointer"
                >
                  {topic.name} ({topic.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="skeleton-title w-3/4"></div>
                <div className="skeleton-text w-full"></div>
                <div className="skeleton-text w-2/3"></div>
                <div className="skeleton-text w-1/2"></div>
              </div>
            ))}
          </div>
        )}

        {/* News Grid/List */}
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`card-hover ${viewMode === 'list' ? 'flex' : ''}`}
                >
                  {viewMode === 'list' ? (
                    // List view
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="mb-2">
                            <TextToSpeechButton text={`${article.title}. ${article.description}`} />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {article.description}
                          </p>
                        </div>
                        {article.image && (
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-32 h-24 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <Newspaper className="w-4 h-4 mr-1" />
                            {article.source}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(article.publishedAt)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`badge ${getBiasColor(article.bias)}`}>
                            {article.bias}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Grid view
                    <div className="p-6">
                      <div className="mb-2">
                        <TextToSpeechButton text={`${article.title}. ${article.description}`} />
                      </div>
                      {article.image && (
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {article.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Newspaper className="w-4 h-4 mr-1" />
                          {article.source}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(article.publishedAt)}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={`badge ${getBiasColor(article.bias)}`}>
                          {article.bias}
                        </span>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBookmark(article)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(article)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleFeedback(article)}
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Rate this article"
                          >
                            <Star className="w-4 h-4" />
                          </button>
                          <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>

                      {/* Voting Section */}
                      <div className="flex items-center justify-center space-x-4 mt-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleVote(article, 'trustworthy')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>Trust</span>
                        </button>
                        <button
                          onClick={() => handleVote(article, 'neutral')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Neutral</span>
                        </button>
                        <button
                          onClick={() => handleVote(article, 'untrustworthy')}
                          className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>Untrust</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!isLoading && filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}

        {/* Feedback Modal */}
        <AnimatePresence>
          {showFeedbackModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowFeedbackModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Rate this article
                </h3>
                
                {selectedArticle && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {selectedArticle.title}
                  </p>
                )}

                {/* Rating Stars */}
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setFeedbackRating(star)}
                      className={`text-2xl ${
                        star <= feedbackRating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <textarea
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  placeholder="Add a comment (optional)..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows="3"
                />

                {/* Actions */}
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitFeedback}
                    disabled={feedbackRating === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Feedback
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default News; 