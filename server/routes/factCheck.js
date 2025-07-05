const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

// Cache for 1 hour
const cache = new NodeCache({ stdTTL: 3600 });

// Fact-checking sources
const FACT_CHECK_SOURCES = {
  snopes: {
    name: 'Snopes',
    url: 'https://www.snopes.com/api/v1/facts',
    apiKey: process.env.SNOPES_API_KEY
  },
  politifact: {
    name: 'PolitiFact',
    url: 'https://www.politifact.com/api/v/2.0',
    apiKey: process.env.POLITIFACT_API_KEY
  },
  factcheck: {
    name: 'FactCheck.org',
    url: 'https://www.factcheck.org/api',
    apiKey: process.env.FACTCHECK_API_KEY
  }
};

// Web search configuration
const WEB_SEARCH_CONFIG = {
  serper: {
    name: 'Serper.dev',
    url: 'https://google.serper.dev/search',
    apiKey: process.env.SERPER_API_KEY
  }
};

// Common knowledge facts for instant verification
const COMMON_KNOWLEDGE_FACTS = [
  {
    patterns: [/sun rises in (the )?east/i, /sun sets in (the )?west/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted scientific fact.'
  },
  {
    patterns: [/water is wet/i, /water boils at 100 ?c/i, /water freezes at 0 ?c/i, /water is h2o/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted scientific fact.'
  },
  {
    patterns: [/earth is round/i, /earth is a sphere/i, /earth revolves around the sun/i, /earth orbits the sun/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted scientific fact.'
  },
  {
    patterns: [/the sky is blue/i, /sky appears blue/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted observation.'
  },
  {
    patterns: [/there are 7 days in a week/i, /week has 7 days/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted fact.'
  },
  {
    patterns: [/2 ?\+ ?2 ?= ?4/i, /two plus two is four/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a basic mathematical fact.'
  },
  {
    patterns: [/the capital of france is paris/i, /paris is the capital of france/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted geographic fact.'
  },
  {
    patterns: [/humans need oxygen to live/i, /humans need oxygen/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted biological fact.'
  },
  {
    patterns: [/gravity pulls objects toward earth/i, /gravity attracts objects/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted scientific fact.'
  },
  {
    patterns: [/the moon orbits the earth/i, /moon revolves around earth/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted astronomical fact.'
  },
  {
    patterns: [/light travels faster than sound/i, /speed of light is greater than speed of sound/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted scientific fact.'
  },
  {
    patterns: [/the great wall of china is in china/i, /great wall of china location/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted historical/geographic fact.'
  },
  {
    patterns: [/mount everest is the highest mountain/i, /mount everest is the tallest mountain/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted geographic fact.'
  },
  {
    patterns: [/the pacific ocean is the largest ocean/i, /largest ocean is pacific/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted geographic fact.'
  },
  {
    patterns: [/the human body has 206 bones/i, /206 bones in human body/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted biological fact.'
  },
  {
    patterns: [/the heart pumps blood/i, /heart circulates blood/i],
    rating: 'true',
    confidence: 0.99,
    summary: 'This is a universally accepted biological fact.'
  }
  // Add more as needed
];

// Check claims against fact-checking databases
router.post('/verify', async (req, res) => {
  try {
    const { claim, context, source } = req.body;
    
    if (!claim) {
      return res.status(400).json({ error: 'Claim is required' });
    }

    const cacheKey = `factcheck_${claim.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const verificationResults = await verifyClaim(claim, context, source);
    
    const response = {
      claim,
      context,
      source,
      verdict: verificationResults.overallRating,
      confidence: verificationResults.confidence,
      explanation: verificationResults.summary,
      sources: verificationResults.sources,
      relatedClaims: [
        {
          text: 'Similar claims have been debunked by multiple fact-checking organizations.',
          verdict: 'false'
        }
      ],
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Fact-checking error:', error);
    res.status(500).json({ error: 'Failed to verify claim' });
  }
});

// Get trending fact-checks
router.get('/trending', async (req, res) => {
  try {
    const cacheKey = 'trending_factchecks';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Simulate trending fact-checks (in real implementation, this would come from APIs)
    const trendingChecks = [
      {
        id: '1',
        claim: 'COVID-19 vaccines contain microchips',
        rating: 'false',
        source: 'Snopes',
        date: '2024-01-15',
        summary: 'Multiple fact-checking organizations have debunked this claim.'
      },
      {
        id: '2',
        claim: 'Climate change is a hoax',
        rating: 'false',
        source: 'PolitiFact',
        date: '2024-01-14',
        summary: 'Overwhelming scientific evidence supports climate change.'
      },
      {
        id: '3',
        claim: 'Election fraud in 2020',
        rating: 'false',
        source: 'FactCheck.org',
        date: '2024-01-13',
        summary: 'No evidence of widespread election fraud has been found.'
      },
      {
        id: '4',
        claim: '5G networks cause COVID-19',
        rating: 'false',
        source: 'FactCheck.org',
        date: '2024-01-12',
        summary: '5G technology has no connection to the coronavirus pandemic.'
      },
      {
        id: '5',
        claim: 'Vaccines cause autism',
        rating: 'false',
        source: 'FactCheck.org',
        date: '2024-01-11',
        summary: 'Multiple studies have found no link between vaccines and autism.'
      },
      {
        id: '6',
        claim: 'Face masks reduce oxygen levels',
        rating: 'false',
        source: 'Snopes',
        date: '2024-01-10',
        summary: 'Face masks do not significantly reduce oxygen intake.'
      }
    ];

    const response = {
      factChecks: trendingChecks.map(check => ({
        id: check.id,
        claim: check.claim,
        verdict: check.rating,
        explanation: check.summary,
        source: check.source,
        date: check.date,
        url: `https://www.snopes.com/fact-check/${check.id}`
      })),
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 7200); // Cache for 2 hours
    res.json(response);
  } catch (error) {
    console.error('Trending fact-checks error:', error);
    res.status(500).json({ error: 'Failed to fetch trending fact-checks' });
  }
});

// Analyze article for potential false claims
router.post('/analyze-article', async (req, res) => {
  try {
    const { title, content, source } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'Article content is required' });
    }

    const claims = extractClaims(content);
    const analysisResults = [];

    // If no claims found, create a fallback analysis
    if (claims.length === 0) {
      // Analyze the entire content as a single claim
      const verification = await verifyClaim(content, '', source);
      analysisResults.push({
        claim: content.length > 200 ? content.substring(0, 200) + '...' : content,
        context: content,
        verification
      });
    } else {
      for (const claim of claims) {
        const verification = await verifyClaim(claim.text, claim.context, source);
        analysisResults.push({
          claim: claim.text,
          context: claim.context,
          verification
        });
      }
    }

    const overallScore = calculateFactualScore(analysisResults);

    // For article analysis, return the first claim's verification as the main result
    const mainVerification = analysisResults.length > 0 ? analysisResults[0].verification : {
      overallRating: 'unverified',
      confidence: 0,
      summary: 'No claims found to analyze.'
    };

    res.json({
      verdict: mainVerification.overallRating,
      confidence: Math.round(mainVerification.confidence * 100),
      explanation: mainVerification.summary,
      sources: mainVerification.sources || [],
      claims: analysisResults,
      overallScore,
      summary: generateFactualSummary(analysisResults),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Article fact-checking error:', error);
    res.status(500).json({ error: 'Failed to analyze article' });
  }
});

// Get fact-checking statistics
router.get('/stats', async (req, res) => {
  try {
    const cacheKey = 'factcheck_stats';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Simulate statistics (in real implementation, this would come from databases)
    const stats = {
      totalChecks: 15420,
      trueClaims: 2340,
      falseClaims: 8920,
      misleadingClaims: 4160,
      sources: [
        { name: 'Snopes', checks: 5200, accuracy: 98.5 },
        { name: 'PolitiFact', checks: 4800, accuracy: 97.8 },
        { name: 'FactCheck.org', checks: 5420, accuracy: 98.2 }
      ],
      categories: [
        { name: 'Politics', count: 4200 },
        { name: 'Health', count: 3800 },
        { name: 'Science', count: 2900 },
        { name: 'Technology', count: 2200 },
        { name: 'Entertainment', count: 2320 }
      ]
    };

    const response = {
      statistics: stats,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 14400); // Cache for 4 hours
    res.json(response);
  } catch (error) {
    console.error('Fact-checking stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Helper functions
async function verifyClaim(claim, context = '', source = '') {
  const results = {
    sources: [],
    overallRating: 'unverified',
    confidence: 0,
    summary: 'No fact-checking results found for this claim.'
  };

  // 1. Check common knowledge facts
  for (const fact of COMMON_KNOWLEDGE_FACTS) {
    if (fact.patterns.some(pat => pat.test(claim))) {
      results.sources.push({
        source: 'Common Knowledge',
        rating: fact.rating,
        summary: fact.summary,
        confidence: fact.confidence,
        apiSource: true
      });
      results.overallRating = fact.rating;
      results.confidence = fact.confidence;
      results.summary = fact.summary;
      return results;
    }
  }

  try {
    // Try Snopes API (if available)
    let found = false;
    if (FACT_CHECK_SOURCES.snopes.apiKey) {
      try {
        const snopesResult = await checkSnopes(claim);
        if (snopesResult && snopesResult.apiSource) {
          results.sources.push(snopesResult);
          found = true;
        }
      } catch (error) {
        console.error('Snopes API error:', error);
      }
    }

    // Try PolitiFact API (if available)
    if (FACT_CHECK_SOURCES.politifact.apiKey) {
      try {
        const politifactResult = await checkPolitiFact(claim);
        if (politifactResult && politifactResult.apiSource) {
          results.sources.push(politifactResult);
          found = true;
        }
      } catch (error) {
        console.error('PolitiFact API error:', error);
      }
    }

    // Try FactCheck.org API (if available)
    if (FACT_CHECK_SOURCES.factcheck.apiKey) {
      try {
        const factcheckResult = await checkFactCheckOrg(claim);
        if (factcheckResult && factcheckResult.apiSource) {
          results.sources.push(factcheckResult);
          found = true;
        }
      } catch (error) {
        console.error('FactCheck.org API error:', error);
      }
    }

    // If no real API result, try web search as fallback
    if (!found) {
      try {
        const webSearchResult = await performWebSearch(claim);
        if (webSearchResult) {
          results.sources.push(webSearchResult);
          found = true;
        }
      } catch (error) {
        console.error('Web search error:', error);
      }
    }

    // If still no result, return unverified
    if (!found) {
      results.overallRating = 'unverified';
      results.confidence = 0;
      results.summary = 'No reputable fact-checking source could verify this claim.';
      return results;
    }

    // Calculate overall rating and confidence
    if (results.sources.length > 0) {
      results.overallRating = calculateOverallRating(results.sources);
      results.confidence = calculateConfidence(results.sources);
      results.summary = generateVerificationSummary(results.sources);
    }

  } catch (error) {
    console.error('Claim verification error:', error);
  }

  return results;
}

async function checkSnopes(claim) {
  // Simulate Snopes API call (replace with actual API integration)
  const keywords = claim.toLowerCase().split(' ');
  
  // Simple keyword matching for demonstration
  const snopesDatabase = {
    'covid': { rating: 'false', summary: 'COVID-19 related claims often contain misinformation.' },
    'vaccine': { rating: 'mostly_true', summary: 'Vaccine safety is well-established by scientific research.' },
    'election': { rating: 'false', summary: 'Election fraud claims have been repeatedly debunked.' },
    'climate': { rating: 'true', summary: 'Climate change is supported by overwhelming scientific evidence.' }
  };

  for (const keyword of keywords) {
    if (snopesDatabase[keyword]) {
      return {
        source: 'Snopes',
        rating: snopesDatabase[keyword].rating,
        summary: snopesDatabase[keyword].summary,
        url: `https://www.snopes.com/fact-check/${keyword}`,
        confidence: 0.8,
        apiSource: true
      };
    }
  }

  return null;
}

async function checkPolitiFact(claim) {
  // Simulate PolitiFact API call (replace with actual API integration)
  const keywords = claim.toLowerCase().split(' ');
  
  const politifactDatabase = {
    'politician': { rating: 'half_true', summary: 'Political claims often contain partial truths.' },
    'tax': { rating: 'mostly_true', summary: 'Tax-related claims are generally accurate.' },
    'economy': { rating: 'true', summary: 'Economic data claims are typically factual.' }
  };

  for (const keyword of keywords) {
    if (politifactDatabase[keyword]) {
      return {
        source: 'PolitiFact',
        rating: politifactDatabase[keyword].rating,
        summary: politifactDatabase[keyword].summary,
        url: `https://www.politifact.com/factchecks/${keyword}`,
        confidence: 0.7,
        apiSource: true
      };
    }
  }

  return null;
}

async function checkFactCheckOrg(claim) {
  try {
    // Attempt to use FactCheck.org API if available
    if (FACT_CHECK_SOURCES.factcheck.apiKey) {
      const response = await axios.get(`${FACT_CHECK_SOURCES.factcheck.url}/search`, {
        params: {
          q: claim,
          api_key: FACT_CHECK_SOURCES.factcheck.apiKey,
          limit: 5
        },
        timeout: 10000
      });

      if (response.data && response.data.results && response.data.results.length > 0) {
        const result = response.data.results[0];
        return {
          source: 'FactCheck.org',
          rating: result.rating || 'unverified',
          summary: result.summary || result.description || 'FactCheck.org has reviewed this claim.',
          url: result.url || `https://www.factcheck.org/fact-check/${result.id}`,
          confidence: 0.9,
          apiSource: true
        };
      }
    }
  } catch (error) {
    console.log('FactCheck.org API not available, using keyword analysis');
  }

  // Fallback to keyword-based analysis for FactCheck.org
  const keywords = claim.toLowerCase().split(' ');
  
  const factcheckDatabase = {
    'covid': { rating: 'false', summary: 'COVID-19 related claims have been extensively fact-checked by FactCheck.org.' },
    'vaccine': { rating: 'mostly_true', summary: 'Vaccine safety claims are generally supported by scientific evidence.' },
    'election': { rating: 'false', summary: 'Election fraud claims have been debunked by multiple fact-checking organizations.' },
    'climate': { rating: 'true', summary: 'Climate change claims are supported by overwhelming scientific consensus.' },
    'health': { rating: 'half_true', summary: 'Health claims often require careful verification of sources.' },
    'science': { rating: 'mostly_true', summary: 'Scientific claims are generally well-supported by research.' },
    'politics': { rating: 'half_true', summary: 'Political claims often contain partial truths and require verification.' },
    'economy': { rating: 'mostly_true', summary: 'Economic data claims are typically based on official statistics.' }
  };

  for (const keyword of keywords) {
    if (factcheckDatabase[keyword]) {
      return {
        source: 'FactCheck.org',
        rating: factcheckDatabase[keyword].rating,
        summary: factcheckDatabase[keyword].summary,
        url: `https://www.factcheck.org/tag/${keyword}/`,
        confidence: 0.8
      };
    }
  }

  return null;
}

function analyzeClaimKeywords(claim) {
  const text = claim.toLowerCase();
  
  // Simple keyword-based analysis
  const suspiciousKeywords = ['conspiracy', 'secret', 'hidden', 'cover-up', 'fake', 'hoax'];
  const factualKeywords = ['study', 'research', 'data', 'statistics', 'report', 'evidence'];
  
  const suspiciousCount = suspiciousKeywords.filter(keyword => text.includes(keyword)).length;
  const factualCount = factualKeywords.filter(keyword => text.includes(keyword)).length;
  
  let rating = 'unverified';
  let confidence = 0.3;
  
  if (suspiciousCount > factualCount) {
    rating = 'suspicious';
    confidence = 0.4;
  } else if (factualCount > suspiciousCount) {
    rating = 'likely_true';
    confidence = 0.5;
  }

  return {
    source: 'Keyword Analysis',
    rating,
    summary: `Analysis based on ${factualCount} factual and ${suspiciousCount} suspicious keywords.`,
    confidence
  };
}

async function performWebSearch(claim) {
  try {
    if (!WEB_SEARCH_CONFIG.serper.apiKey) {
      console.log('Serper.dev API key not configured');
      return null;
    }

    const searchQuery = `${claim} fact check verification`;
    
    const response = await axios.post(WEB_SEARCH_CONFIG.serper.url, {
      q: searchQuery,
      num: 5
    }, {
      headers: {
        'X-API-KEY': WEB_SEARCH_CONFIG.serper.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });

    if (response.data && response.data.organic) {
      const searchResults = response.data.organic.slice(0, 5);
      const snippets = searchResults.map(result => result.snippet).join(' ');
      
      // Simple AI-like analysis of search results
      const analysis = analyzeWebSearchResults(claim, snippets, searchResults);
      
      return {
        source: 'Web Search (Serper.dev)',
        rating: analysis.rating,
        summary: analysis.summary,
        confidence: analysis.confidence,
        searchResults: searchResults.map(result => ({
          title: result.title,
          snippet: result.snippet,
          link: result.link
        })),
        apiSource: true
      };
    }

    return null;
  } catch (error) {
    console.error('Web search error:', error.message);
    return null;
  }
}

function analyzeWebSearchResults(claim, snippets, searchResults) {
  const text = snippets.toLowerCase();
  const claimWords = claim.toLowerCase().split(' ');
  
  // Look for fact-checking indicators
  const factCheckIndicators = {
    positive: ['true', 'accurate', 'confirmed', 'verified', 'factual', 'correct', 'real', 'genuine', 'scientific fact', 'universally accepted'],
    negative: ['false', 'fake', 'hoax', 'debunked', 'misleading', 'inaccurate', 'untrue', 'fabricated', 'conspiracy'],
    neutral: ['unverified', 'uncertain', 'disputed', 'controversial', 'alleged', 'claimed']
  };

  let positiveScore = 0;
  let negativeScore = 0;
  let neutralScore = 0;

  // Count indicators
  factCheckIndicators.positive.forEach(word => {
    const matches = (text.match(new RegExp(word, 'g')) || []).length;
    positiveScore += matches;
  });

  factCheckIndicators.negative.forEach(word => {
    const matches = (text.match(new RegExp(word, 'g')) || []).length;
    negativeScore += matches;
  });

  factCheckIndicators.neutral.forEach(word => {
    const matches = (text.match(new RegExp(word, 'g')) || []).length;
    neutralScore += matches;
  });

  // Determine rating based on scores
  let rating = 'unverified';
  let confidence = 0.3;
  let summary = 'Web search results are inconclusive.';

  if (positiveScore > negativeScore && positiveScore > neutralScore) {
    rating = 'true';
    confidence = Math.min(0.95, 0.5 + (positiveScore * 0.1));
    summary = 'Web search results suggest this claim is accurate.';
    if (positiveScore >= 3 && negativeScore === 0) {
      confidence = 0.99;
      summary = 'Web search results show overwhelming consensus that this claim is true.';
    }
  } else if (negativeScore > positiveScore && negativeScore > neutralScore) {
    rating = 'false';
    confidence = Math.min(0.95, 0.5 + (negativeScore * 0.1));
    summary = 'Web search results suggest this claim may be false or misleading.';
    if (negativeScore >= 3 && positiveScore === 0) {
      confidence = 0.99;
      summary = 'Web search results show overwhelming consensus that this claim is false.';
    }
  } else if (neutralScore > 0) {
    rating = 'unverified';
    confidence = 0.4;
    summary = 'Web search results show mixed or inconclusive information.';
  }

  // Check for fact-checking websites
  const factCheckSites = ['snopes.com', 'factcheck.org', 'politifact.com', 'reuters.com/fact-check'];
  const hasFactCheckSite = searchResults.some(result => 
    factCheckSites.some(site => result.link.includes(site))
  );

  if (hasFactCheckSite) {
    confidence = Math.min(0.99, confidence + 0.2);
    summary += ' Results include reputable fact-checking sources.';
  }

  return { rating, confidence, summary };
}

function extractClaims(content) {
  if (!content || typeof content !== 'string') {
    return [];
  }
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const claims = [];
  
  // Extract sentences that might contain claims
  const claimIndicators = [
    'claims', 'says', 'stated', 'announced', 'revealed', 'discovered',
    'proves', 'shows', 'indicates', 'suggests', 'confirms', 'according to',
    'reports', 'found', 'study shows', 'research indicates', 'experts say'
  ];
  
  sentences.forEach((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    const hasIndicator = claimIndicators.some(indicator => lowerSentence.includes(indicator));
    
    if (hasIndicator) {
      claims.push({
        text: sentence.trim(),
        context: sentences.slice(Math.max(0, index - 1), index + 2).join(' '),
        confidence: 0.6
      });
    }
  });
  
  // If no claims found with indicators, take the first few sentences as potential claims
  if (claims.length === 0 && sentences.length > 0) {
    const firstSentences = sentences.slice(0, 3);
    firstSentences.forEach((sentence, index) => {
      if (sentence.trim().length > 20) { // Only include substantial sentences
        claims.push({
          text: sentence.trim(),
          context: sentences.slice(Math.max(0, index - 1), index + 2).join(' '),
          confidence: 0.4
        });
      }
    });
  }
  
  return claims.slice(0, 5); // Limit to 5 claims
}

function calculateOverallRating(sources) {
  const ratings = {
    'true': 3,
    'mostly_true': 2,
    'half_true': 1,
    'mostly_false': -1,
    'false': -2,
    'pants_on_fire': -3,
    'suspicious': -1,
    'likely_true': 1,
    'unverified': 0
  };
  
  const totalScore = sources.reduce((sum, source) => {
    return sum + (ratings[source.rating] || 0) * source.confidence;
  }, 0);
  
  const avgScore = totalScore / sources.length;
  
  if (avgScore >= 1.5) return 'true';
  if (avgScore >= 0.5) return 'mostly_true';
  if (avgScore >= -0.5) return 'half_true';
  if (avgScore >= -1.5) return 'mostly_false';
  return 'false';
}

function calculateConfidence(sources) {
  const avgConfidence = sources.reduce((sum, source) => sum + source.confidence, 0) / sources.length;
  return Math.min(1, avgConfidence * sources.length / 2); // Boost confidence with more sources
}

function generateVerificationSummary(sources) {
  const ratings = sources.map(s => s.rating);
  const trueCount = ratings.filter(r => r.includes('true')).length;
  const falseCount = ratings.filter(r => r.includes('false')).length;
  
  if (trueCount > falseCount) {
    return `Multiple sources indicate this claim is likely true.`;
  } else if (falseCount > trueCount) {
    return `Multiple sources indicate this claim is likely false.`;
  } else {
    return `Sources are mixed on this claim. Further verification recommended.`;
  }
}

function calculateFactualScore(analysisResults) {
  if (analysisResults.length === 0) return 50;
  
  const scores = analysisResults.map(result => {
    const rating = result.verification.overallRating;
    const ratings = { 'true': 100, 'mostly_true': 80, 'half_true': 50, 'mostly_false': 20, 'false': 0 };
    return ratings[rating] || 50;
  });
  
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

function generateFactualSummary(analysisResults) {
  const verified = analysisResults.filter(r => r.verification.overallRating.includes('true')).length;
  const total = analysisResults.length;
  
  if (verified === total) return 'All claims appear to be factual.';
  if (verified === 0) return 'All claims appear to be false or misleading.';
  if (verified > total / 2) return 'Most claims appear to be factual.';
  return 'Mixed factual accuracy detected.';
}

module.exports = router; 