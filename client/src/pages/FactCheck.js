import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, 
  Shield, 
  Search, 
  AlertTriangle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  ExternalLink,
  Copy,
  Bookmark,
  Share2,
  Users,
  Target
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FactCheck = () => {
  const [claimText, setClaimText] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState(null);
  const [selectedTab, setSelectedTab] = useState('verify');

  // Fetch trending fact-checks
  const { data: trendingFactChecks } = useQuery(
    'trending-fact-checks',
    async () => {
      const response = await axios.get('/api/fact-check/trending');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
    }
  );

  // Fetch recent articles for analysis
  const { data: recentArticles } = useQuery(
    'recent-articles-factcheck',
    async () => {
      const response = await axios.get('/api/news/aggregate', {
        params: { topic: 'general', limit: 8 }
      });
      return response.data.articles;
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    }
  );

  // Verify claim mutation
  const verifyMutation = useMutation(
    async (claim) => {
      const response = await axios.post('/api/fact-check/verify', { claim });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setVerificationResults(data);
        setIsVerifying(false);
        toast.success('Claim verification completed!');
      },
      onError: (error) => {
        setIsVerifying(false);
        toast.error('Verification failed. Please try again.');
      }
    }
  );

  // Analyze article mutation
  const analyzeArticleMutation = useMutation(
    async (article) => {
      const response = await axios.post('/api/fact-check/analyze-article', {
        title: article.title,
        content: article.description || article.content || '',
        source: article.source
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setVerificationResults(data);
        toast.success('Article analysis completed!');
      },
      onError: (error) => {
        toast.error('Article analysis failed. Please try again.');
      }
    }
  );

  const handleVerifyClaim = async () => {
    if (!claimText.trim()) {
      toast.error('Please enter a claim to verify');
      return;
    }
    
    setIsVerifying(true);
    verifyMutation.mutate(claimText);
  };

  const handleAnalyzeArticle = async (article) => {
    analyzeArticleMutation.mutate(article);
  };

  const handleCopyClaim = (claim) => {
    navigator.clipboard.writeText(claim);
    toast.success('Claim copied to clipboard!');
  };

  const handleShareFactCheck = async (factCheck) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Fact Check: ${factCheck.claim}`,
          text: `Verdict: ${factCheck.verdict}`,
          url: factCheck.url || window.location.href
        });
      } else {
        await navigator.clipboard.writeText(factCheck.url || window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const getVerdictColor = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'true': return 'text-green-600 bg-green-100';
      case 'false': return 'text-red-600 bg-red-100';
      case 'half_true': return 'text-yellow-600 bg-yellow-100';
      case 'misleading': return 'text-orange-600 bg-orange-100';
      case 'unverified': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict?.toLowerCase()) {
      case 'true': return <CheckCircle className="w-5 h-5" />;
      case 'false': return <XCircle className="w-5 h-5" />;
      case 'half_true': return <AlertTriangle className="w-5 h-5" />;
      case 'misleading': return <AlertTriangle className="w-5 h-5" />;
      case 'unverified': return <Clock className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Fact Check - TruthLens</title>
        <meta name="description" content="Verify claims and check facts with trusted sources." />
      </Helmet>

      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-slate-300 mb-4">Fact Check</h1>
          <p className="text-xl text-gray-600 dark:text-slate-300">
            Verify claims and check facts against trusted sources
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedTab('verify')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'verify'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Search className="w-4 h-4 inline mr-2" />
              Verify Claims
            </button>
            <button
              onClick={() => setSelectedTab('trending')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'trending'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trending
            </button>
            <button
              onClick={() => setSelectedTab('analyze')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'analyze'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Analyze Articles
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'verify' && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Claim Verification */}
              <div className="card p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-6 h-6 mr-2" />
                  Verify a Claim
                </h2>
                
                <div className="space-y-4">
                  <textarea
                    value={claimText}
                    onChange={(e) => setClaimText(e.target.value)}
                    placeholder="Enter a claim or statement to verify..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  
                  <button
                    onClick={handleVerifyClaim}
                    disabled={isVerifying || !claimText.trim()}
                    className="btn-primary w-full flex items-center justify-center"
                  >
                    {isVerifying ? (
                      <>
                        <Clock className="w-5 h-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Verify Claim
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Verification Results */}
              <AnimatePresence>
                {verificationResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="card p-6"
                  >
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Verification Results</h2>
                    
                    <div className="space-y-6">
                      {/* Verdict */}
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center mb-4">
                          {getVerdictIcon(verificationResults.verdict)}
                          <span className="ml-2 text-lg font-semibold">Verdict</span>
                        </div>
                        <div className={`inline-flex px-4 py-2 rounded-full text-lg font-medium ${getVerdictColor(verificationResults.verdict)}`}>
                          {verificationResults.verdict?.toUpperCase()}
                        </div>
                        {verificationResults.confidence && (
                          <p className="text-gray-600 mt-2">
                            Confidence: {verificationResults.confidence}%
                          </p>
                        )}
                      </div>

                      {/* Explanation */}
                      {verificationResults.explanation && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h3 className="font-semibold text-gray-900 mb-2">Explanation</h3>
                          <p className="text-gray-700">{verificationResults.explanation}</p>
                        </div>
                      )}

                      {/* Sources */}
                      {verificationResults.sources && verificationResults.sources.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Sources</h3>
                          <div className="space-y-2">
                            {verificationResults.sources.map((source, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{source.name}</p>
                                  <p className="text-sm text-gray-600">{source.description}</p>
                                </div>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-secondary text-sm"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Claims Found */}
                      {verificationResults.claims && verificationResults.claims.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Claims Found in Article</h3>
                          <div className="space-y-3">
                            {verificationResults.claims.map((claim, index) => (
                              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <p className="text-gray-900 mb-2 font-medium">Claim {index + 1}:</p>
                                <p className="text-gray-700 mb-3">{claim.claim}</p>
                                <div className="flex items-center justify-between">
                                  <div className={`inline-flex px-3 py-1 rounded text-sm font-medium ${getVerdictColor(claim.verification.overallRating)}`}>
                                    {claim.verification.overallRating.toUpperCase()}
                                  </div>
                                  <button
                                    onClick={() => handleCopyClaim(claim.claim)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                {claim.verification.summary && (
                                  <p className="text-sm text-gray-600 mt-2">{claim.verification.summary}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Related Claims */}
                      {verificationResults.relatedClaims && verificationResults.relatedClaims.length > 0 && (
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-3">Related Claims</h3>
                          <div className="space-y-2">
                            {verificationResults.relatedClaims.map((claim, index) => (
                              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                                <p className="text-gray-900 mb-2">{claim.text}</p>
                                <div className="flex items-center justify-between">
                                  <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${getVerdictColor(claim.verdict)}`}>
                                    {claim.verdict}
                                  </div>
                                  <button
                                    onClick={() => handleCopyClaim(claim.text)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {selectedTab === 'trending' && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trending Fact-Checks</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingFactChecks?.factChecks?.map((factCheck, index) => (
                  <div key={index} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getVerdictColor(factCheck.verdict)}`}>
                        {getVerdictIcon(factCheck.verdict)}
                        <span className="ml-1">{factCheck.verdict}</span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShareFactCheck(factCheck)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {factCheck.claim}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {factCheck.explanation}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{factCheck.source}</span>
                      <span>{new Date(factCheck.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedTab === 'analyze' && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyze Articles for Claims</h2>
              
              {/* Article Analysis Results */}
              <AnimatePresence>
                {verificationResults && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="card p-6 mb-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Analysis Results</h3>
                    
                    <div className="space-y-6">
                      {/* Verdict */}
                      <div className="text-center p-6 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center mb-4">
                          {getVerdictIcon(verificationResults.verdict)}
                          <span className="ml-2 text-lg font-semibold">Overall Verdict</span>
                        </div>
                        <div className={`inline-flex px-4 py-2 rounded-full text-lg font-medium ${getVerdictColor(verificationResults.verdict)}`}>
                          {verificationResults.verdict?.toUpperCase()}
                        </div>
                        {verificationResults.confidence && (
                          <p className="text-gray-600 mt-2">
                            Confidence: {verificationResults.confidence}%
                          </p>
                        )}
                      </div>

                      {/* Explanation */}
                      {verificationResults.explanation && (
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Explanation</h4>
                          <p className="text-gray-700">{verificationResults.explanation}</p>
                        </div>
                      )}

                      {/* Sources */}
                      {verificationResults.sources && verificationResults.sources.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Sources</h4>
                          <div className="space-y-2">
                            {verificationResults.sources.map((source, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{source.source || source.name}</p>
                                  <p className="text-sm text-gray-600">{source.summary || source.description}</p>
                                </div>
                                <a
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn-secondary text-sm"
                                >
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Claims Found */}
                      {verificationResults.claims && verificationResults.claims.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Claims Found in Article</h4>
                          <div className="space-y-3">
                            {verificationResults.claims.map((claim, index) => (
                              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                <p className="text-gray-900 mb-2 font-medium">Claim {index + 1}:</p>
                                <p className="text-gray-700 mb-3">{claim.claim}</p>
                                <div className="flex items-center justify-between">
                                  <div className={`inline-flex px-3 py-1 rounded text-sm font-medium ${getVerdictColor(claim.verification.overallRating)}`}>
                                    {claim.verification.overallRating.toUpperCase()}
                                  </div>
                                  <button
                                    onClick={() => handleCopyClaim(claim.claim)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    <Copy className="w-4 h-4" />
                                  </button>
                                </div>
                                {claim.verification.summary && (
                                  <p className="text-sm text-gray-600 mt-2">{claim.verification.summary}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Overall Score */}
                      {verificationResults.overallScore && (
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Overall Factual Score</h4>
                          <div className="flex items-center space-x-2">
                            <div className="text-2xl font-bold text-green-600">{verificationResults.overallScore}%</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${verificationResults.overallScore}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Summary */}
                      {verificationResults.summary && (
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Analysis Summary</h4>
                          <p className="text-gray-700">{verificationResults.summary}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentArticles?.map((article, index) => (
                  <div key={article.id} className="card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {article.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>{article.source}</span>
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    </div>
                    
                    <button
                      onClick={() => handleAnalyzeArticle(article)}
                      className="btn-secondary w-full flex items-center justify-center"
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Analyze for Claims
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card p-6 text-center">
            <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">2,847</h3>
            <p className="text-gray-600">Claims Verified</p>
          </div>
          
          <div className="card p-6 text-center">
            <CheckCircle className="w-8 h-8 text-success-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">94%</h3>
            <p className="text-gray-600">Accuracy Rate</p>
          </div>
          
          <div className="card p-6 text-center">
            <Users className="w-8 h-8 text-warning-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">156</h3>
            <p className="text-gray-600">Trusted Sources</p>
          </div>
          
          <div className="card p-6 text-center">
            <Clock className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-900">1.8s</h3>
            <p className="text-gray-600">Avg. Response Time</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default FactCheck; 