const express = require('express');
const natural = require('natural');
const Sentiment = require('sentiment');
const nlp = require('compromise');
const router = express.Router();

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Bias detection keywords and patterns
const BIAS_PATTERNS = {
  political: {
    left: ['progressive', 'liberal', 'democratic', 'socialist', 'equality', 'social justice', 'climate change', 'universal healthcare'],
    right: ['conservative', 'republican', 'traditional', 'free market', 'individual responsibility', 'national security', 'border control'],
    center: ['bipartisan', 'moderate', 'balanced', 'compromise', 'middle ground']
  },
  emotional: {
    positive: ['amazing', 'incredible', 'wonderful', 'fantastic', 'excellent', 'outstanding'],
    negative: ['terrible', 'horrible', 'awful', 'disastrous', 'catastrophic', 'devastating'],
    neutral: ['reported', 'stated', 'announced', 'confirmed', 'revealed']
  },
  sensationalist: ['shocking', 'explosive', 'bombshell', 'scandal', 'controversy', 'outrage', 'fury', 'rage']
};

// Analyze sentiment and bias of text
router.post('/sentiment', async (req, res) => {
  try {
    const { text, title, source } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Basic sentiment analysis
    const sentimentResult = sentiment.analyze(text);
    
    // Enhanced sentiment analysis
    const enhancedAnalysis = analyzeSentiment(text, title);
    
    // Bias detection
    const biasAnalysis = detectBias(text, title, source);
    
    // Language complexity analysis
    const complexityAnalysis = analyzeComplexity(text);
    
    // Factual vs opinion analysis
    const factualAnalysis = analyzeFactualContent(text);
    
    // Determine overall sentiment
    let overallSentiment = 'neutral';
    if (sentimentResult.score > 2) overallSentiment = 'positive';
    else if (sentimentResult.score < -2) overallSentiment = 'negative';

    const analysis = {
      sentiment: overallSentiment,
      sentimentConfidence: Math.abs(sentimentResult.score) * 10,
      bias: biasAnalysis.overall,
      biasScore: Math.max(biasAnalysis.political.left, biasAnalysis.political.right, biasAnalysis.political.center),
      credibilityScore: factualAnalysis.factualScore,
      details: [
        `Sentiment score: ${sentimentResult.score}`,
        `Political bias detected: ${biasAnalysis.overall}`,
        `Factual content: ${factualAnalysis.factualScore}%`,
        `Language complexity: ${complexityAnalysis.level}`
      ],
      keywords: enhancedAnalysis.emotionalWords.slice(0, 5),
      timestamp: new Date().toISOString()
    };

    res.json(analysis);
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// Analyze multiple articles for comparison
router.post('/compare', async (req, res) => {
  try {
    const { articles } = req.body;
    
    if (!articles || !Array.isArray(articles) || articles.length < 2) {
      return res.status(400).json({ error: 'At least 2 articles are required for comparison' });
    }

    const comparisons = [];
    
    for (const article of articles) {
      const analysis = await analyzeArticle(article);
      comparisons.push({
        id: article.id,
        title: article.title,
        source: article.source,
        analysis
      });
    }

    // Generate comparison metrics
    const comparisonMetrics = generateComparisonMetrics(comparisons);
    
    res.json({
      articles: comparisons,
      comparison: comparisonMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Article comparison error:', error);
    res.status(500).json({ error: 'Failed to compare articles' });
  }
});

// Analyze source credibility
router.post('/credibility', async (req, res) => {
  try {
    const { source, articles } = req.body;
    
    if (!source) {
      return res.status(400).json({ error: 'Source is required' });
    }

    const credibilityScore = analyzeSourceCredibility(source, articles);
    
    res.json({
      source,
      credibility: credibilityScore,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Credibility analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze credibility' });
  }
});

// Helper functions
function analyzeSentiment(text, title = '') {
  const fullText = `${title} ${text}`;
  const doc = nlp(fullText);
  
  // Analyze emotional intensity
  const emotionalWords = doc.match('#Adjective').out('array');
  const allWords = fullText.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  const emotionalIntensity = allWords.length > 0 ? emotionalWords.length / allWords.length : 0;
  
  // Analyze subjectivity
  const subjectiveWords = doc.match('(i think|i believe|i feel|in my opinion|clearly|obviously)').length;
  const sentences = doc.sentences().out('array');
  const subjectivity = sentences.length > 0 ? subjectiveWords / sentences.length : 0;
  
  return {
    emotionalIntensity,
    subjectivity,
    emotionalWords: emotionalWords.slice(0, 10)
  };
}

function detectBias(text, title = '', source = '') {
  const fullText = `${title} ${text}`.toLowerCase();
  const doc = nlp(fullText);
  
  const bias = {
    political: { left: 0, right: 0, center: 0 },
    emotional: { positive: 0, negative: 0, neutral: 0 },
    sensationalist: 0,
    overall: 'neutral'
  };
  
  // Check political bias
  Object.keys(BIAS_PATTERNS.political).forEach(leaning => {
    BIAS_PATTERNS.political[leaning].forEach(word => {
      const matches = doc.match(word).length;
      bias.political[leaning] += matches;
    });
  });
  
  // Check emotional bias
  Object.keys(BIAS_PATTERNS.emotional).forEach(tone => {
    BIAS_PATTERNS.emotional[tone].forEach(word => {
      const matches = doc.match(word).length;
      bias.emotional[tone] += matches;
    });
  });
  
  // Check sensationalist language
  BIAS_PATTERNS.sensationalist.forEach(word => {
    const matches = doc.match(word).length;
    bias.sensationalist += matches;
  });
  
  // Determine overall bias
  const politicalTotal = bias.political.left + bias.political.right + bias.political.center;
  const emotionalTotal = bias.emotional.positive + bias.emotional.negative + bias.emotional.neutral;
  
  if (politicalTotal > 0) {
    const maxPolitical = Math.max(bias.political.left, bias.political.right, bias.political.center);
    if (maxPolitical === bias.political.left) bias.overall = 'left-leaning';
    else if (maxPolitical === bias.political.right) bias.overall = 'right-leaning';
    else bias.overall = 'center';
  } else if (bias.sensationalist > 3) {
    bias.overall = 'sensationalist';
  } else if (emotionalTotal > 0) {
    const maxEmotional = Math.max(bias.emotional.positive, bias.emotional.negative, bias.emotional.neutral);
    if (maxEmotional === bias.emotional.positive) bias.overall = 'positive';
    else if (maxEmotional === bias.emotional.negative) bias.overall = 'negative';
    else bias.overall = 'neutral';
  }
  
  return bias;
}

function analyzeComplexity(text) {
  const doc = nlp(text);
  const sentences = doc.sentences().out('array');
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  
  // Calculate average sentence length
  const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
  
  // Calculate average word length
  const avgWordLength = words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0;
  
  // Count complex words (more than 6 characters)
  const complexWords = words.filter(word => word.length > 6).length;
  const complexityRatio = words.length > 0 ? complexWords / words.length : 0;
  
  // Flesch Reading Ease (simplified)
  const fleschScore = 206.835 - (1.015 * avgSentenceLength) - (84.6 * complexityRatio);
  
  return {
    avgSentenceLength: Math.round(avgSentenceLength * 100) / 100,
    avgWordLength: Math.round(avgWordLength * 100) / 100,
    complexWords,
    complexityRatio: Math.round(complexityRatio * 1000) / 10,
    fleschScore: Math.round(fleschScore),
    level: fleschScore > 80 ? 'very easy' : 
           fleschScore > 60 ? 'easy' : 
           fleschScore > 40 ? 'moderate' : 
           fleschScore > 20 ? 'difficult' : 'very difficult'
  };
}

function analyzeFactualContent(text) {
  const doc = nlp(text);
  
  // Count factual indicators
  const factualIndicators = doc.match('(according to|research shows|study found|data indicates|statistics show|reported|confirmed|verified)').length;
  
  // Count opinion indicators
  const opinionIndicators = doc.match('(i think|i believe|i feel|in my opinion|clearly|obviously|undoubtedly|certainly)').length;
  
  // Count quotes (factual content)
  const quotes = doc.match('"*"').length;
  
  // Count numbers and dates (factual content)
  const numbers = doc.match('#Number').length;
  const dates = doc.match('#Date').length;
  
  const totalIndicators = factualIndicators + opinionIndicators;
  const factualScore = totalIndicators > 0 ? (factualIndicators / totalIndicators) * 100 : 50;
  
  return {
    factualIndicators,
    opinionIndicators,
    quotes,
    numbers,
    dates,
    factualScore: Math.round(factualScore),
    type: factualScore > 70 ? 'factual' : factualScore > 40 ? 'mixed' : 'opinion'
  };
}

function generateSummary(sentiment, bias, factual) {
  const summaries = [];
  
  // Sentiment summary
  if (sentiment.score > 5) summaries.push('Overall positive tone');
  else if (sentiment.score < -5) summaries.push('Overall negative tone');
  else summaries.push('Neutral tone');
  
  // Bias summary
  if (bias.overall !== 'neutral') summaries.push(`${bias.overall} bias detected`);
  
  // Factual summary
  if (factual.type === 'factual') summaries.push('High factual content');
  else if (factual.type === 'opinion') summaries.push('Opinion-heavy content');
  
  return summaries.join('. ');
}

async function analyzeArticle(article) {
  const text = `${article.title} ${article.description}`;
  
  const sentimentResult = sentiment.analyze(text);
  const enhancedAnalysis = analyzeSentiment(text, article.title);
  const biasAnalysis = detectBias(text, article.title, article.source);
  const complexityAnalysis = analyzeComplexity(text);
  const factualAnalysis = analyzeFactualContent(text);
  
  return {
    sentiment: {
      score: sentimentResult.score,
      comparative: sentimentResult.comparative,
      enhanced: enhancedAnalysis
    },
    bias: biasAnalysis,
    complexity: complexityAnalysis,
    factual: factualAnalysis
  };
}

function generateComparisonMetrics(articles) {
  const metrics = {
    sentimentRange: { min: 0, max: 0, avg: 0 },
    biasDistribution: {},
    complexityRange: { min: 0, max: 0, avg: 0 },
    factualScores: []
  };
  
  if (articles.length === 0) {
    return metrics;
  }
  
  const sentimentScores = articles.map(a => a.analysis.sentiment.score);
  const complexityScores = articles.map(a => a.analysis.complexity.fleschScore);
  const factualScores = articles.map(a => a.analysis.factual.factualScore);
  
  metrics.sentimentRange = {
    min: Math.min(...sentimentScores),
    max: Math.max(...sentimentScores),
    avg: Math.round(sentimentScores.reduce((a, b) => a + b, 0) / sentimentScores.length)
  };
  
  metrics.complexityRange = {
    min: Math.min(...complexityScores),
    max: Math.max(...complexityScores),
    avg: Math.round(complexityScores.reduce((a, b) => a + b, 0) / complexityScores.length)
  };
  
  metrics.factualScores = factualScores;
  
  // Bias distribution
  articles.forEach(article => {
    const bias = article.analysis.bias.overall;
    metrics.biasDistribution[bias] = (metrics.biasDistribution[bias] || 0) + 1;
  });
  
  return metrics;
}

function analyzeSourceCredibility(source, articles = []) {
  // Simple credibility scoring based on source characteristics
  const credibilityFactors = {
    established: ['bbc', 'reuters', 'associated press', 'the guardian', 'new york times'],
    reliable: ['cnn', 'fox news', 'nbc', 'abc', 'cbs'],
    specialized: ['techcrunch', 'ars technica', 'wired', 'nature', 'science']
  };
  
  let score = 50; // Base score
  
  // Check if source is established
  if (credibilityFactors.established.some(s => source.toLowerCase().includes(s))) {
    score += 30;
  } else if (credibilityFactors.reliable.some(s => source.toLowerCase().includes(s))) {
    score += 20;
  } else if (credibilityFactors.specialized.some(s => source.toLowerCase().includes(s))) {
    score += 15;
  }
  
  // Analyze articles if provided
  if (articles.length > 0) {
    const avgFactualScore = articles.reduce((sum, article) => sum + article.analysis.factual.factualScore, 0) / articles.length;
    score += (avgFactualScore - 50) * 0.3; // Adjust based on factual content
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = router; 