import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Target, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Upload,
  FileText,
  Globe,
  Users,
  Clock
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Analysis = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Fetch recent articles for analysis
  const { data: recentArticles } = useQuery(
    'recent-articles',
    async () => {
      const response = await axios.get('/api/news/aggregate', {
        params: { topic: 'general', limit: 10 }
      });
      return response.data.articles;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Analyze text mutation
  const analyzeMutation = useMutation(
    async (text) => {
      const response = await axios.post('/api/analysis/sentiment', { text });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setAnalysisResults(data);
        setIsAnalyzing(false);
        toast.success('Analysis completed!');
      },
      onError: (error) => {
        setIsAnalyzing(false);
        toast.error('Analysis failed. Please try again.');
      }
    }
  );

  // Compare articles mutation
  const compareMutation = useMutation(
    async (articles) => {
      const response = await axios.post('/api/analysis/compare', { articles });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setAnalysisResults(data);
        toast.success('Comparison completed!');
      },
      onError: (error) => {
        toast.error('Comparison failed. Please try again.');
      }
    }
  );

  const handleAnalyzeText = async () => {
    if (!analysisText.trim()) {
      toast.error('Please enter text to analyze');
      return;
    }
    
    setIsAnalyzing(true);
    analyzeMutation.mutate(analysisText);
  };

  const handleAnalyzeArticle = async (article) => {
    setSelectedArticle(article);
    setIsAnalyzing(true);
    
    // Combine title and description for analysis
    const textToAnalyze = `${article.title}. ${article.description}`;
    analyzeMutation.mutate(textToAnalyze);
  };

  const handleCompareArticles = async () => {
    if (!recentArticles || recentArticles.length < 2) {
      toast.error('Need at least 2 articles to compare');
      return;
    }
    
    const articlesToCompare = recentArticles.slice(0, 2);
    compareMutation.mutate(articlesToCompare);
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-100';
      case 'negative': return 'text-red-600 bg-red-100';
      case 'neutral': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBiasColor = (bias) => {
    switch (bias) {
      case 'left-leaning': return 'text-blue-600 bg-blue-100';
      case 'right-leaning': return 'text-red-600 bg-red-100';
      case 'center': return 'text-green-600 bg-green-100';
      case 'sensationalist': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCredibilityScore = (score) => {
    if (score >= 80) return { color: 'text-green-600', label: 'High' };
    if (score >= 60) return { color: 'text-yellow-600', label: 'Medium' };
    return { color: 'text-red-600', label: 'Low' };
  };

  return (
    <>
      <Helmet>
        <title>Analysis - TruthLens</title>
        <meta name="description" content="Advanced sentiment and bias analysis for news articles." />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">News Analysis</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Analyze sentiment, bias, and credibility of news articles and sources
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Analysis Section */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <FileText className="w-6 h-6 mr-2" />
              Text Analysis
            </h2>
            
            <div className="space-y-4">
              <textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                placeholder="Enter text to analyze for sentiment and bias..."
                className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              
              <button
                onClick={handleAnalyzeText}
                disabled={isAnalyzing || !analysisText.trim()}
                className="btn-primary w-full flex items-center justify-center"
              >
                {isAnalyzing ? (
                  <>
                    <Activity className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analyze Text
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Article Analysis Section */}
          <div className="card p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Recent Articles
            </h2>
            
            <div className="space-y-3">
              {recentArticles?.slice(0, 5).map((article, index) => (
                <div
                  key={article.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleAnalyzeArticle(article)}
                >
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-xs mt-1">
                    {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
            
            <button
              onClick={handleCompareArticles}
              className="btn-secondary w-full mt-4 flex items-center justify-center"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Compare Articles
            </button>
          </div>
        </div>

        {/* Analysis Results */}
        <AnimatePresence>
          {analysisResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sentiment Analysis */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Activity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Sentiment</h3>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(analysisResults.sentiment)}`}>
                    {analysisResults.sentiment?.charAt(0).toUpperCase() + analysisResults.sentiment?.slice(1)}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    Confidence: {analysisResults.sentimentConfidence}%
                  </p>
                </div>

                {/* Bias Detection */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Target className="w-8 h-8 text-warning-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Bias Detection</h3>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getBiasColor(analysisResults.bias)}`}>
                    {analysisResults.bias || 'Neutral'}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">
                    Bias Score: {analysisResults.biasScore || 'N/A'}
                  </p>
                </div>

                {/* Credibility Score */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-success-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-900 mb-2">Credibility</h3>
                  {analysisResults.credibilityScore && (
                    <>
                      <div className={`text-2xl font-bold ${getCredibilityScore(analysisResults.credibilityScore).color}`}>
                        {analysisResults.credibilityScore}%
                      </div>
                      <p className="text-gray-600 text-sm">
                        {getCredibilityScore(analysisResults.credibilityScore).label} Trust
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Detailed Analysis */}
              {analysisResults.details && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Detailed Analysis</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    {analysisResults.details.map((detail, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <p>{detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              {analysisResults.keywords && (
                <div className="mt-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Topics</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisResults.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">1,247</h3>
            <p className="text-gray-600">Articles Analyzed</p>
          </div>
          
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">89%</h3>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
          
          <div className="card p-6 text-center">
            <Clock className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">2.3s</h3>
            <p className="text-gray-600">Avg. Analysis Time</p>
          </div>
          
          <div className="card p-6 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-gray-600">Bias Alerts</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analysis; 