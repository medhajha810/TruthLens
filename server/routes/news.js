const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const router = express.Router();

// Cache for 15 minutes
const cache = new NodeCache({ stdTTL: 900 });

// Public news sources (using free APIs and RSS feeds)
const NEWS_SOURCES = {
  guardian: {
    name: 'The Guardian',
    url: 'https://content.guardianapis.com/search',
    apiKey: process.env.GUARDIAN_API_KEY || 'test',
    bias: 'center-left'
  },
  newsapi: {
    name: 'NewsAPI',
    url: 'https://newsapi.org/v2/top-headlines',
    apiKey: process.env.NEWS_API_KEY || 'test',
    bias: 'neutral'
  },
  hackernews: {
    name: 'Hacker News',
    url: 'https://hacker-news.firebaseio.com/v0',
    bias: 'tech-focused'
  }
};

// Demo news data for when APIs are not available
const DEMO_NEWS = [
  {
    id: 'demo_1',
    title: 'AI Breakthrough in Medical Diagnosis Shows 95% Accuracy',
    description: 'Researchers at Stanford University have developed a new AI system that can diagnose rare diseases with unprecedented accuracy, potentially revolutionizing healthcare.',
    url: 'https://example.com/ai-medical-breakthrough',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    source: 'Tech News Daily',
    bias: 'neutral',
    category: 'technology'
  },
  {
    id: 'demo_2',
    title: 'Climate Change Report: Global Temperatures Rising Faster Than Predicted',
    description: 'New research indicates that global temperatures are increasing at a rate 20% faster than previous models predicted, raising concerns about climate action.',
    url: 'https://example.com/climate-report',
    image: 'https://images.unsplash.com/photo-1569163139394-de4e1c3123a9?w=400&h=300&fit=crop',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    source: 'Environmental Times',
    bias: 'left-leaning',
    category: 'environment'
  },
  {
    id: 'demo_3',
    title: 'Economic Recovery Shows Strong Signs in Q3 Report',
    description: 'The latest economic indicators show robust growth in the third quarter, with unemployment rates dropping to pre-pandemic levels.',
    url: 'https://example.com/economic-recovery',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    source: 'Business Weekly',
    bias: 'center',
    category: 'business'
  },
  {
    id: 'demo_4',
    title: 'New Space Mission Discovers Potential Signs of Life on Mars',
    description: 'NASA\'s latest Mars rover has detected organic compounds that could indicate the presence of microbial life, scientists announced today.',
    url: 'https://example.com/mars-life-discovery',
    image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    source: 'Science Daily',
    bias: 'neutral',
    category: 'science'
  },
  {
    id: 'demo_5',
    title: 'Cybersecurity Breach Affects Millions of Users Worldwide',
    description: 'A major cybersecurity incident has compromised data from over 50 million users across multiple platforms, raising concerns about digital privacy.',
    url: 'https://example.com/cybersecurity-breach',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
    publishedAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    source: 'Digital Security News',
    bias: 'sensationalist',
    category: 'technology'
  }
];

// Get news from multiple sources
router.get('/aggregate', async (req, res) => {
  try {
    const { topic = 'general', country = 'us', page = 1, limit = 20, sortBy = 'publishedAt' } = req.query;
    const cacheKey = `news_${topic}_${country}_${page}_${limit}_${sortBy}`;
    
    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    const newsPromises = [];
    
    // Guardian API - Enhanced integration
    if (process.env.GUARDIAN_API_KEY && process.env.GUARDIAN_API_KEY !== 'test') {
      try {
        // Build Guardian API query based on topic
        let guardianQuery = topic;
        let section = '';
        
        // Map topics to Guardian sections
        const topicMapping = {
          'technology': 'technology',
          'business': 'business',
          'politics': 'politics',
          'sports': 'sport',
          'entertainment': 'culture',
          'science': 'science',
          'health': 'society',
          'environment': 'environment'
        };
        
        if (topicMapping[topic]) {
          section = topicMapping[topic];
        }
        
        const guardianUrl = section 
          ? `${NEWS_SOURCES.guardian.url}?section=${section}&api-key=${NEWS_SOURCES.guardian.apiKey}&page=${page}&page-size=${Math.min(limit, 50)}&show-fields=trailText,thumbnail,headline,standfirst&order-by=newest`
          : `${NEWS_SOURCES.guardian.url}?q=${guardianQuery}&api-key=${NEWS_SOURCES.guardian.apiKey}&page=${page}&page-size=${Math.min(limit, 50)}&show-fields=trailText,thumbnail,headline,standfirst&order-by=newest`;
        
        newsPromises.push(
          axios.get(guardianUrl)
            .then(response => {
              console.log(`Guardian API: Fetched ${response.data.response.results.length} articles`);
              return {
                source: 'guardian',
                articles: response.data.response.results.map(article => ({
                  id: article.id,
                  title: article.webTitle,
                  description: article.fields?.trailText || article.fields?.standfirst || '',
                  url: article.webUrl,
                  image: article.fields?.thumbnail || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
                  publishedAt: article.webPublicationDate,
                  source: 'The Guardian',
                  bias: NEWS_SOURCES.guardian.bias,
                  category: article.sectionName || topic,
                  author: article.fields?.byline || '',
                  readTime: article.fields?.wordcount ? Math.ceil(article.fields.wordcount / 200) : null
                }))
              };
            })
            .catch(err => {
              console.error('Guardian API error:', err.message);
              return { source: 'guardian', articles: [], error: err.message };
            })
        );
      } catch (err) {
        console.error('Guardian API setup error:', err.message);
      }
    }

    // NewsAPI
    if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'test') {
      newsPromises.push(
        axios.get(`${NEWS_SOURCES.newsapi.url}?country=${country}&category=${topic}&apiKey=${NEWS_SOURCES.newsapi.apiKey}&page=${page}&pageSize=${limit}`)
          .then(response => ({
            source: 'newsapi',
            articles: response.data.articles.map(article => ({
              id: article.url,
              title: article.title,
              description: article.description,
              url: article.url,
              image: article.urlToImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
              publishedAt: article.publishedAt,
              source: article.source.name,
              bias: NEWS_SOURCES.newsapi.bias,
              category: topic,
              author: article.author || '',
              readTime: null
            }))
          }))
          .catch(err => ({ source: 'newsapi', articles: [], error: err.message }))
      );
    }

    // Hacker News (free API)
    newsPromises.push(
      axios.get(`${NEWS_SOURCES.hackernews.url}/topstories.json`)
        .then(response => {
          const topStoryIds = response.data.slice(0, Math.min(limit, 30));
          return Promise.all(
            topStoryIds.map(id => 
              axios.get(`${NEWS_SOURCES.hackernews.url}/item/${id}.json`)
            )
          );
        })
        .then(stories => ({
          source: 'hackernews',
          articles: stories
            .filter(story => story.data.url && story.data.title) // Only stories with URLs
            .map(story => ({
              id: story.data.id,
              title: story.data.title,
              description: '',
              url: story.data.url,
              image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
              publishedAt: new Date(story.data.time * 1000).toISOString(),
              source: 'Hacker News',
              bias: NEWS_SOURCES.hackernews.bias,
              category: 'technology',
              score: story.data.score,
              author: story.data.by || '',
              readTime: null
            }))
        }))
        .catch(err => ({ source: 'hackernews', articles: [], error: err.message }))
    );

    const results = await Promise.all(newsPromises);
    
    // Combine and deduplicate articles
    const allArticles = results.flatMap(result => result.articles);
    const uniqueArticles = deduplicateArticles(allArticles);
    
    // Sort articles based on sortBy parameter
    if (sortBy === 'publishedAt') {
      uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'relevance') {
      // Keep original order for relevance
    }
    
    // Add demo articles if no real articles are available
    let finalArticles = uniqueArticles;
    if (finalArticles.length === 0) {
      console.log('No real articles available, using demo data');
      finalArticles = DEMO_NEWS;
    }
    
    const response = {
      articles: finalArticles.slice(0, limit),
      totalResults: finalArticles.length,
      sources: results.map(r => ({ 
        name: r.source, 
        count: r.articles.length,
        error: r.error || null 
      })),
      timestamp: new Date().toISOString(),
      guardianApiKey: process.env.GUARDIAN_API_KEY ? 'configured' : 'not configured'
    };

    // Cache the result
    cache.set(cacheKey, response);
    
    res.json(response);
  } catch (error) {
    console.error('News aggregation error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      message: error.message,
      articles: DEMO_NEWS.slice(0, 10)
    });
  }
});

// Get trending topics
router.get('/trending', async (req, res) => {
  try {
    const cacheKey = 'trending_topics';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    let topics = [];

    // Try to get real trending topics from Guardian API
    if (process.env.GUARDIAN_API_KEY && process.env.GUARDIAN_API_KEY !== 'test') {
      try {
        // Get recent articles from different sections to identify trending topics
        const sections = ['technology', 'politics', 'business', 'sport', 'culture', 'science', 'society', 'environment'];
        const sectionPromises = sections.map(section => 
          axios.get(`${NEWS_SOURCES.guardian.url}?section=${section}&api-key=${NEWS_SOURCES.guardian.apiKey}&page-size=10&show-fields=trailText&order-by=newest`)
            .then(response => ({
              section,
              articles: response.data.response.results
            }))
            .catch(err => ({ section, articles: [], error: err.message }))
        );

        const sectionResults = await Promise.all(sectionPromises);
        
        // Extract topics from article titles and content
        const topicCounts = {};
        const sentimentMap = {
          'technology': 'positive',
          'politics': 'neutral', 
          'business': 'neutral',
          'sport': 'positive',
          'culture': 'neutral',
          'science': 'positive',
          'society': 'neutral',
          'environment': 'negative'
        };

        sectionResults.forEach(result => {
          if (result.articles.length > 0) {
            const sectionName = result.section.charAt(0).toUpperCase() + result.section.slice(1);
            const count = result.articles.length;
            
            topics.push({
              name: sectionName,
              count: count * 10 + Math.floor(Math.random() * 50), // Simulate engagement
              category: result.section,
              sentiment: sentimentMap[result.section] || 'neutral',
              articles: result.articles.slice(0, 3).map(article => ({
                title: article.webTitle,
                url: article.webUrl,
                publishedAt: article.webPublicationDate
              }))
            });
          }
        });

        console.log(`Guardian API: Extracted ${topics.length} trending topics`);
      } catch (error) {
        console.error('Guardian trending topics error:', error);
      }
    }

    // Fallback to demo topics if no real data
    if (topics.length === 0) {
      topics = [
        { name: 'Technology', count: 150, category: 'technology', sentiment: 'positive' },
        { name: 'Politics', count: 120, category: 'politics', sentiment: 'neutral' },
        { name: 'Business', count: 95, category: 'business', sentiment: 'neutral' },
        { name: 'Health', count: 80, category: 'health', sentiment: 'neutral' },
        { name: 'Science', count: 75, category: 'science', sentiment: 'positive' },
        { name: 'Sports', count: 65, category: 'sports', sentiment: 'positive' },
        { name: 'Entertainment', count: 55, category: 'entertainment', sentiment: 'neutral' },
        { name: 'Environment', count: 45, category: 'environment', sentiment: 'negative' }
      ];
    }

    const response = {
      topics,
      timestamp: new Date().toISOString(),
      source: process.env.GUARDIAN_API_KEY ? 'Guardian API' : 'Demo Data'
    };

    cache.set(cacheKey, response, 3600); // Cache for 1 hour
    res.json(response);
  } catch (error) {
    console.error('Trending topics error:', error);
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});

// Search news
router.get('/search', async (req, res) => {
  try {
    const { q, source, dateFrom, dateTo, sortBy = 'relevancy' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const cacheKey = `search_${q}_${source}_${dateFrom}_${dateTo}_${sortBy}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    let searchResults = [];

    // Search in Guardian API
    if (!source || source === 'guardian') {
      try {
        const guardianResponse = await axios.get(
          `${NEWS_SOURCES.guardian.url}?q=${encodeURIComponent(q)}&api-key=${NEWS_SOURCES.guardian.apiKey}&show-fields=all`
        );
        
        searchResults.push(...guardianResponse.data.response.results.map(article => ({
          id: article.id,
          title: article.webTitle,
          description: article.fields?.trailText || '',
          url: article.webUrl,
          image: article.fields?.thumbnail || '',
          publishedAt: article.webPublicationDate,
          source: 'The Guardian',
          bias: NEWS_SOURCES.guardian.bias
        })));
      } catch (error) {
        console.error('Guardian search error:', error);
      }
    }

    // Search in NewsAPI
    if (!source || source === 'newsapi') {
      try {
        const newsApiResponse = await axios.get(
          `${NEWS_SOURCES.newsapi.url.replace('/top-headlines', '/everything')}?q=${encodeURIComponent(q)}&apiKey=${NEWS_SOURCES.newsapi.apiKey}&sortBy=${sortBy}`
        );
        
        searchResults.push(...newsApiResponse.data.articles.map(article => ({
          id: article.url,
          title: article.title,
          description: article.description,
          url: article.url,
          image: article.urlToImage,
          publishedAt: article.publishedAt,
          source: article.source.name,
          bias: NEWS_SOURCES.newsapi.bias
        })));
      } catch (error) {
        console.error('NewsAPI search error:', error);
      }
    }

    // Remove duplicates and sort
    const uniqueResults = deduplicateArticles(searchResults);
    
    const response = {
      articles: uniqueResults,
      totalResults: uniqueResults.length,
      query: q,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 1800); // Cache for 30 minutes
    res.json(response);
  } catch (error) {
    console.error('News search error:', error);
    res.status(500).json({ error: 'Failed to search news' });
  }
});

// Test Guardian API connectivity
router.get('/test-guardian', async (req, res) => {
  try {
    if (!process.env.GUARDIAN_API_KEY || process.env.GUARDIAN_API_KEY === 'test') {
      return res.json({
        status: 'not_configured',
        message: 'Guardian API key not configured'
      });
    }

    const response = await axios.get(
      `${NEWS_SOURCES.guardian.url}?section=technology&api-key=${NEWS_SOURCES.guardian.apiKey}&page-size=1&show-fields=trailText`
    );

    res.json({
      status: 'success',
      message: 'Guardian API is working',
      testArticle: response.data.response.results[0] ? {
        title: response.data.response.results[0].webTitle,
        url: response.data.response.results[0].webUrl,
        publishedAt: response.data.response.results[0].webPublicationDate
      } : null,
      totalResults: response.data.response.total
    });
  } catch (error) {
    console.error('Guardian API test error:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Guardian API test failed',
      error: error.message
    });
  }
});

// Helper function to deduplicate articles
function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter(article => {
    const key = article.url || article.id;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

module.exports = router; 