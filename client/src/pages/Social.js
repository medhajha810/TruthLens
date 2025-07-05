import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  MessageCircle, 
  TrendingUp, 
  Users, 
  Twitter,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Heart,
  Share2,
  Clock,
  Globe,
  Target,
  BarChart3,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Social = () => {
  const [selectedTopic, setSelectedTopic] = useState('general');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('24h');
  const [sentimentResults, setSentimentResults] = useState(null);

  const platforms = [
    { id: 'all', name: 'All Platforms', icon: Globe },
    { id: 'twitter', name: 'Twitter', icon: Twitter },
    { id: 'reddit', name: 'Reddit', icon: MessageSquare },
    { id: 'hackernews', name: 'Hacker News', icon: MessageSquare }
  ];

  const timeRanges = [
    { id: '1h', name: 'Last Hour' },
    { id: '24h', name: 'Last 24 Hours' },
    { id: '7d', name: 'Last 7 Days' },
    { id: '30d', name: 'Last 30 Days' }
  ];

  // Fetch trending social topics
  const { data: trendingTopics } = useQuery(
    ['social-trending', timeRange],
    async () => {
      const response = await axios.get('/api/social/trending', {
        params: { timeRange }
      });
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Fetch social sentiment for selected topic
  const { data: topicSentiment, refetch: refetchSentiment } = useQuery(
    ['social-sentiment', selectedTopic, selectedPlatform, timeRange],
    async () => {
      const response = await axios.get(`/api/social/sentiment/${selectedTopic}`, {
        params: { 
          platform: selectedPlatform === 'all' ? undefined : selectedPlatform,
          timeRange 
        }
      });
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
      enabled: !!selectedTopic
    }
  );

  // Fetch news reactions
  const { data: newsReactions } = useQuery(
    ['news-reactions'],
    async () => {
      const response = await axios.get('/api/social/reactions/latest');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 3 * 60 * 1000,
    }
  );

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic.name);
    setSentimentResults(null);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'negative': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      case 'neutral': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4" />;
      case 'negative': return <ThumbsDown className="w-4 h-4" />;
      case 'neutral': return <MessageCircle className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <>
      <Helmet>
        <title>Social - TruthLens</title>
        <meta name="description" content="Social media sentiment analysis and trending topics." />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">Social Sentiment</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Analyze public sentiment and trending topics across social media
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Platform Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Platform</label>
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="input"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Time Range</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="input"
              >
                {timeRanges.map(range => (
                  <option key={range.id} value={range.id}>
                    {range.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Refresh Button */}
            <div className="flex items-end">
              <button
                onClick={() => refetchSentiment()}
                className="btn-secondary w-full flex items-center justify-center"
              >
                <Activity className="w-4 h-4 mr-2" />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trending Topics */}
          <div className="lg:col-span-1">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-300 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Trending Topics
              </h2>
              
              <div className="space-y-3">
                {trendingTopics?.topics && Array.isArray(trendingTopics.topics) ? (
                  trendingTopics.topics.map((topic, index) => (
                    <div
                      key={index}
                      onClick={() => handleTopicClick(topic)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedTopic === topic.name 
                          ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700' 
                          : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-white">{topic.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-slate-300">{formatNumber(topic.mentions)} mentions</p>
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSentimentColor(topic.sentiment)}`}>
                          {getSentimentIcon(topic.sentiment)}
                          <span className="ml-1">{topic.sentiment}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-slate-400">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-slate-500" />
                    <p>No trending topics available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sentiment Analysis */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-300 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Sentiment Analysis: {selectedTopic}
              </h2>
              
              {topicSentiment ? (
                <div className="space-y-6">
                  {/* Overall Sentiment */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <ThumbsUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {topicSentiment.positive}%
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300">Positive</p>
                    </div>
                    
                    <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <ThumbsDown className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {topicSentiment.negative}%
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300">Negative</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                      <MessageCircle className="w-8 h-8 text-gray-600 dark:text-slate-400 mx-auto mb-2" />
                      <h3 className="text-2xl font-bold text-gray-600 dark:text-slate-400">
                        {topicSentiment.neutral}%
                      </h3>
                      <p className="text-gray-600 dark:text-slate-300">Neutral</p>
                    </div>
                  </div>

                  {/* Platform Breakdown */}
                  {topicSentiment.platforms && (
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">By Platform</h3>
                      <div className="space-y-3">
                        {Object.entries(topicSentiment.platforms).map(([platform, data]) => (
                          <div key={platform} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center">
                              {platform === 'twitter' && <Twitter className="w-5 h-5 text-blue-500 mr-2" />}
                              {platform === 'reddit' && <MessageSquare className="w-5 h-5 text-orange-500 mr-2" />}
                              {platform === 'hackernews' && <MessageSquare className="w-5 h-5 text-orange-600 mr-2" />}
                              <span className="font-medium capitalize text-gray-900 dark:text-white">{platform}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <span className="text-green-600 dark:text-green-400 font-medium">{data.positive}%</span>
                              <span className="text-red-600 dark:text-red-400 font-medium">{data.negative}%</span>
                              <span className="text-gray-600 dark:text-slate-400 font-medium">{data.neutral}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Insights */}
                  {topicSentiment.insights && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Insights</h3>
                      <div className="space-y-2 text-sm text-gray-700 dark:text-slate-300">
                        {topicSentiment.insights.map((insight, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p>{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-slate-500" />
                  <p>Select a trending topic to view sentiment analysis</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Reactions */}
        <div className="card p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-300 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Recent News Reactions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsReactions?.reactions && Array.isArray(newsReactions.reactions) ? (
              newsReactions.reactions.map((reaction, index) => (
                <div key={index} className="border border-gray-200 dark:border-slate-600 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      {reaction.platform === 'twitter' && <Twitter className="w-4 h-4 text-blue-500 mr-2" />}
                      {reaction.platform === 'reddit' && <MessageSquare className="w-4 h-4 text-orange-500 mr-2" />}
                      {reaction.platform === 'hackernews' && <MessageSquare className="w-4 h-4 text-orange-600 mr-2" />}
                      <span className="text-sm font-medium capitalize text-gray-900 dark:text-white">{reaction.platform}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-slate-400">{formatTimeAgo(reaction.timestamp)}</span>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {reaction.newsTitle}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 line-clamp-3">
                    {reaction.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getSentimentColor(reaction.sentiment)}`}>
                      {getSentimentIcon(reaction.sentiment)}
                      <span className="ml-1">{reaction.sentiment}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-slate-400">
                      <span className="flex items-center">
                        <Heart className="w-3 h-3 mr-1" />
                        {formatNumber(reaction.likes)}
                      </span>
                      <span className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-1" />
                        {formatNumber(reaction.comments)}
                      </span>
                      <span className="flex items-center">
                        <Share2 className="w-3 h-3 mr-1" />
                        {formatNumber(reaction.shares)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-slate-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-slate-500" />
                <p>No recent reactions available</p>
              </div>
            )}
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">2.4M</h3>
            <p className="text-gray-600 dark:text-slate-300">Social Mentions</p>
          </div>
          
          <div className="card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-success-600 dark:text-success-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">156</h3>
            <p className="text-gray-600 dark:text-slate-300">Trending Topics</p>
          </div>
          
          <div className="card p-6 text-center">
            <Activity className="w-8 h-8 text-warning-600 dark:text-warning-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">89%</h3>
            <p className="text-gray-600 dark:text-slate-300">Sentiment Accuracy</p>
          </div>
          
          <div className="card p-6 text-center">
            <Clock className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Real-time</h3>
            <p className="text-gray-600 dark:text-slate-300">Data Updates</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Social; 