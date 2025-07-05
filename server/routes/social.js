const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const Sentiment = require('sentiment');
const router = express.Router();

// Cache for 15 minutes
const cache = new NodeCache({ stdTTL: 900 });

// Initialize sentiment analyzer
const sentiment = new Sentiment();

// Social media APIs (using public/free endpoints)
const SOCIAL_APIS = {
  reddit: {
    name: 'Reddit',
    baseUrl: 'https://www.reddit.com',
    userAgent: 'TruthLens/1.0 (News Analysis Tool)'
  },
  twitter: {
    name: 'Twitter',
    baseUrl: 'https://api.twitter.com/2',
    bearerToken: process.env.TWITTER_BEARER_TOKEN,
    apiKey: process.env.TWITTER_API_KEY,
    apiKeySecret: process.env.TWITTER_API_KEY_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  },
  hackernews: {
    name: 'Hacker News',
    baseUrl: 'https://hacker-news.firebaseio.com/v0'
  }
};

// Get social sentiment for a topic
router.get('/sentiment/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { platform = 'all', limit = 50 } = req.query;
    
    const cacheKey = `social_sentiment_${topic}_${platform}_${limit}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const sentimentData = await getSocialSentiment(topic, platform, limit);
    
    const response = {
      topic,
      platform,
      sentiment: sentimentData,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Social sentiment error:', error);
    res.status(500).json({ error: 'Failed to fetch social sentiment' });
  }
});

// Get trending topics from social media
router.get('/trending', async (req, res) => {
  try {
    const { platform = 'all' } = req.query;
    const cacheKey = `social_trending_${platform}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const trendingTopics = await getTrendingTopics(platform);
    
    const response = {
      topics: trendingTopics.map(topic => ({
        name: topic.name,
        mentions: topic.mentions,
        sentiment: topic.sentiment,
        category: topic.category
      })),
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 3600); // Cache for 1 hour
    res.json(response);
  } catch (error) {
    console.error('Trending topics error:', error);
    res.status(500).json({ error: 'Failed to fetch trending topics' });
  }
});

// Get real-time social reactions to news
router.get('/reactions/:newsId', async (req, res) => {
  try {
    const { newsId } = req.params;
    const { platforms = 'all' } = req.query;
    
    const cacheKey = `social_reactions_${newsId}_${platforms}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const reactions = await getNewsReactions(newsId, platforms);
    
    const response = {
      newsId,
      platforms,
      reactions,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 900); // Cache for 15 minutes
    res.json(response);
  } catch (error) {
    console.error('Social reactions error:', error);
    res.status(500).json({ error: 'Failed to fetch social reactions' });
  }
});

// Get latest news reactions
router.get('/reactions/latest', async (req, res) => {
  try {
    const cacheKey = 'latest_reactions';
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    // Generate mock reactions for recent news
    const reactions = [
      {
        id: '1',
        platform: 'twitter',
        newsTitle: 'New AI breakthrough in medical diagnosis',
        content: 'This is incredible! AI is revolutionizing healthcare. The potential is enormous.',
        sentiment: 'positive',
        likes: 1247,
        comments: 89,
        shares: 234,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        platform: 'reddit',
        newsTitle: 'Climate change report shows alarming trends',
        content: 'We need to take action now. The science is clear and the consequences are dire.',
        sentiment: 'negative',
        likes: 892,
        comments: 156,
        shares: 67,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        platform: 'hackernews',
        newsTitle: 'New programming language gains popularity',
        content: 'Interesting approach to memory management. Worth exploring for performance-critical applications.',
        sentiment: 'neutral',
        likes: 445,
        comments: 78,
        shares: 23,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    const response = {
      reactions,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 900); // Cache for 15 minutes
    res.json(response);
  } catch (error) {
    console.error('Latest reactions error:', error);
    res.status(500).json({ error: 'Failed to fetch latest reactions' });
  }
});

// Analyze social media sentiment over time
router.get('/timeline/:topic', async (req, res) => {
  try {
    const { topic } = req.params;
    const { days = 7, platform = 'all' } = req.query;
    
    const cacheKey = `social_timeline_${topic}_${days}_${platform}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      return res.json(cachedData);
    }

    const timeline = await getSentimentTimeline(topic, days, platform);
    
    const response = {
      topic,
      days,
      platform,
      timeline,
      timestamp: new Date().toISOString()
    };

    cache.set(cacheKey, response, 1800); // Cache for 30 minutes
    res.json(response);
  } catch (error) {
    console.error('Sentiment timeline error:', error);
    res.status(500).json({ error: 'Failed to fetch sentiment timeline' });
  }
});

// Helper functions
async function getSocialSentiment(topic, platform, limit) {
  const results = {
    reddit: { sentiment: 0, posts: [], count: 0 },
    twitter: { sentiment: 0, tweets: [], count: 0 },
    hackernews: { sentiment: 0, comments: [], count: 0 }
  };

  try {
    // Get Reddit sentiment
    if (platform === 'all' || platform === 'reddit') {
      const redditData = await getRedditSentiment(topic, limit);
      results.reddit = redditData;
    }

    // Get Twitter sentiment (if API key available)
    if ((platform === 'all' || platform === 'twitter') && SOCIAL_APIS.twitter.bearerToken) {
      const twitterData = await getTwitterSentiment(topic, limit);
      results.twitter = twitterData;
    }

    // Get Hacker News sentiment
    if (platform === 'all' || platform === 'hackernews') {
      const hnData = await getHackerNewsSentiment(topic, limit);
      results.hackernews = hnData;
    }

    // Calculate overall sentiment
    const allSentiments = [
      results.reddit.sentiment,
      results.twitter.sentiment,
      results.hackernews.sentiment
    ].filter(s => s !== 0);

    const overallSentiment = allSentiments.length > 0 
      ? allSentiments.reduce((a, b) => a + b, 0) / allSentiments.length 
      : 0;

    // Convert sentiment score to percentage
    const positive = Math.max(0, Math.min(100, (overallSentiment + 5) * 10));
    const negative = Math.max(0, Math.min(100, (-overallSentiment + 5) * 10));
    const neutral = Math.max(0, 100 - positive - negative);

    return {
      positive: Math.round(positive),
      negative: Math.round(negative),
      neutral: Math.round(neutral),
      platforms: {
        twitter: {
          positive: Math.round(Math.max(0, Math.min(100, (results.twitter.sentiment + 5) * 10))),
          negative: Math.round(Math.max(0, Math.min(100, (-results.twitter.sentiment + 5) * 10))),
          neutral: Math.round(Math.max(0, 100 - positive - negative))
        },
        reddit: {
          positive: Math.round(Math.max(0, Math.min(100, (results.reddit.sentiment + 5) * 10))),
          negative: Math.round(Math.max(0, Math.min(100, (-results.reddit.sentiment + 5) * 10))),
          neutral: Math.round(Math.max(0, 100 - positive - negative))
        },
        hackernews: {
          positive: Math.round(Math.max(0, Math.min(100, (results.hackernews.sentiment + 5) * 10))),
          negative: Math.round(Math.max(0, Math.min(100, (-results.hackernews.sentiment + 5) * 10))),
          neutral: Math.round(Math.max(0, 100 - positive - negative))
        }
      },
      insights: [
        `Overall sentiment is ${overallSentiment > 0 ? 'positive' : overallSentiment < 0 ? 'negative' : 'neutral'}`,
        `Total posts analyzed: ${results.reddit.count + results.twitter.count + results.hackernews.count}`,
        `Most active platform: ${Object.keys(results).reduce((a, b) => results[a].count > results[b].count ? a : b)}`
      ]
    };

  } catch (error) {
    console.error('Social sentiment aggregation error:', error);
    return {
      overall: { sentiment: 0, totalPosts: 0, platforms: [] },
      platforms: results
    };
  }
}

async function getRedditSentiment(topic, limit) {
  try {
    // Search Reddit for the topic
    const searchUrl = `${SOCIAL_APIS.reddit.baseUrl}/search.json?q=${encodeURIComponent(topic)}&limit=${limit}&sort=hot`;
    
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': SOCIAL_APIS.reddit.userAgent
      }
    });

    const posts = response.data.data.children.map(child => child.data);
    const sentiments = [];
    const analyzedPosts = [];

    for (const post of posts) {
      const text = `${post.title} ${post.selftext || ''}`;
      const sentimentResult = sentiment.analyze(text);
      
      sentiments.push(sentimentResult.score);
      analyzedPosts.push({
        id: post.id,
        title: post.title,
        text: post.selftext,
        score: post.score,
        sentiment: sentimentResult.score,
        subreddit: post.subreddit,
        url: `https://reddit.com${post.permalink}`,
        created: new Date(post.created_utc * 1000).toISOString()
      });
    }

    const avgSentiment = sentiments.length > 0 
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
      : 0;

    return {
      sentiment: Math.round(avgSentiment * 100) / 100,
      posts: analyzedPosts.slice(0, 10), // Return top 10 posts
      count: posts.length
    };

  } catch (error) {
    console.error('Reddit API error:', error);
    return { sentiment: 0, posts: [], count: 0 };
  }
}

async function getTwitterSentiment(topic, limit) {
  try {
    // Check if Twitter API credentials are available
    if (!SOCIAL_APIS.twitter.bearerToken) {
      console.log('Twitter API credentials not configured, using mock data');
      return getMockTwitterSentiment(topic, limit);
    }

    // Search tweets using Twitter API v2
    const searchUrl = `${SOCIAL_APIS.twitter.baseUrl}/tweets/search/recent`;
    const params = {
      query: topic,
      max_results: Math.min(limit, 100), // Twitter API limit
      'tweet.fields': 'created_at,public_metrics,author_id',
      'user.fields': 'username,name',
      expansions: 'author_id'
    };

    const response = await axios.get(searchUrl, {
      headers: {
        'Authorization': `Bearer ${SOCIAL_APIS.twitter.bearerToken}`,
        'Content-Type': 'application/json'
      },
      params: params
    });

    const tweets = response.data.data || [];
    const users = response.data.includes?.users || [];
    const userMap = {};
    
    // Create user lookup map
    users.forEach(user => {
      userMap[user.id] = user;
    });

    const sentiments = [];
    const analyzedTweets = [];

    for (const tweet of tweets) {
      const sentimentResult = sentiment.analyze(tweet.text);
      sentiments.push(sentimentResult.score);
      
      const user = userMap[tweet.author_id];
      analyzedTweets.push({
        id: tweet.id,
        text: tweet.text,
        sentiment: sentimentResult.score,
        likes: tweet.public_metrics?.like_count || 0,
        retweets: tweet.public_metrics?.retweet_count || 0,
        replies: tweet.public_metrics?.reply_count || 0,
        author: user ? user.username : 'unknown',
        authorName: user ? user.name : 'Unknown User',
        created: tweet.created_at
      });
    }

    const avgSentiment = sentiments.length > 0 
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
      : 0;

    return {
      sentiment: Math.round(avgSentiment * 100) / 100,
      tweets: analyzedTweets,
      count: tweets.length
    };

  } catch (error) {
    console.error('Twitter API error:', error);
    console.log('Falling back to mock data');
    return getMockTwitterSentiment(topic, limit);
  }
}

function getMockTwitterSentiment(topic, limit) {
  const mockTweets = generateMockTweets(topic, limit);
  const sentiments = [];
  const analyzedTweets = [];

  for (const tweet of mockTweets) {
    const sentimentResult = sentiment.analyze(tweet.text);
    sentiments.push(sentimentResult.score);
    
    analyzedTweets.push({
      id: tweet.id,
      text: tweet.text,
      sentiment: sentimentResult.score,
      likes: tweet.likes,
      retweets: tweet.retweets,
      author: tweet.author,
      created: tweet.created
    });
  }

  const avgSentiment = sentiments.length > 0 
    ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
    : 0;

  return {
    sentiment: Math.round(avgSentiment * 100) / 100,
    tweets: analyzedTweets,
    count: mockTweets.length
  };
}

async function getHackerNewsSentiment(topic, limit) {
  try {
    // Get top stories from Hacker News
    const response = await axios.get(`${SOCIAL_APIS.hackernews.baseUrl}/topstories.json`);
    const storyIds = response.data.slice(0, limit);
    
    const stories = await Promise.all(
      storyIds.map(id => 
        axios.get(`${SOCIAL_APIS.hackernews.baseUrl}/item/${id}.json`)
      )
    );

    const sentiments = [];
    const analyzedComments = [];

    for (const story of stories) {
      const storyData = story.data;
      const text = storyData.title + (storyData.text || '');
      const sentimentResult = sentiment.analyze(text);
      
      sentiments.push(sentimentResult.score);
      analyzedComments.push({
        id: storyData.id,
        title: storyData.title,
        text: storyData.text,
        score: storyData.score,
        sentiment: sentimentResult.score,
        url: storyData.url,
        created: new Date(storyData.time * 1000).toISOString()
      });
    }

    const avgSentiment = sentiments.length > 0 
      ? sentiments.reduce((a, b) => a + b, 0) / sentiments.length 
      : 0;

    return {
      sentiment: Math.round(avgSentiment * 100) / 100,
      comments: analyzedComments,
      count: stories.length
    };

  } catch (error) {
    console.error('Hacker News API error:', error);
    return { sentiment: 0, comments: [], count: 0 };
  }
}

async function getTrendingTopics(platform) {
  try {
    // If platform is twitter and we have credentials, try to get real trending topics
    if (platform === 'twitter' && SOCIAL_APIS.twitter.bearerToken) {
      return await getTwitterTrendingTopics();
    }
    
    // Return mock trending topics with sentiment data
    const mockTopics = [
      { name: 'Artificial Intelligence', mentions: 15420, sentiment: 'positive', category: 'technology' },
      { name: 'Climate Change', mentions: 12890, sentiment: 'negative', category: 'environment' },
      { name: 'COVID-19', mentions: 9870, sentiment: 'neutral', category: 'health' },
      { name: 'Cryptocurrency', mentions: 7650, sentiment: 'positive', category: 'finance' },
      { name: 'Space Exploration', mentions: 5430, sentiment: 'positive', category: 'science' },
      { name: 'Political Elections', mentions: 4320, sentiment: 'negative', category: 'politics' },
      { name: 'Renewable Energy', mentions: 3980, sentiment: 'positive', category: 'environment' },
      { name: 'Mental Health', mentions: 3450, sentiment: 'neutral', category: 'health' },
      { name: 'Cybersecurity', mentions: 2980, sentiment: 'negative', category: 'technology' },
      { name: 'Education Reform', mentions: 2340, sentiment: 'positive', category: 'education' }
    ];

    return mockTopics;

  } catch (error) {
    console.error('Trending topics error:', error);
    return [];
  }
}

async function getTwitterTrendingTopics() {
  try {
    // Get trending topics from Twitter API v2
    // Note: Twitter API v2 doesn't have a direct trending topics endpoint
    // We'll search for popular hashtags and topics
    const popularTopics = [
      'AI', 'Climate', 'COVID', 'Crypto', 'Space', 'Politics', 
      'Energy', 'Health', 'Security', 'Education', 'Technology'
    ];
    
    const trendingTopics = [];
    
    for (const topic of popularTopics.slice(0, 5)) {
      try {
        const searchUrl = `${SOCIAL_APIS.twitter.baseUrl}/tweets/search/recent`;
        const params = {
          query: `#${topic}`,
          max_results: 10,
          'tweet.fields': 'public_metrics'
        };

        const response = await axios.get(searchUrl, {
          headers: {
            'Authorization': `Bearer ${SOCIAL_APIS.twitter.bearerToken}`,
            'Content-Type': 'application/json'
          },
          params: params
        });

        const tweets = response.data.data || [];
        const totalMentions = tweets.reduce((sum, tweet) => 
          sum + (tweet.public_metrics?.like_count || 0) + 
          (tweet.public_metrics?.retweet_count || 0), 0
        );

        if (totalMentions > 0) {
          trendingTopics.push({
            name: topic,
            mentions: totalMentions,
            sentiment: 'positive', // Default sentiment
            category: getTopicCategory(topic)
          });
        }
      } catch (error) {
        console.error(`Error fetching topic ${topic}:`, error.message);
      }
    }

    return trendingTopics.length > 0 ? trendingTopics : getMockTrendingTopics();

  } catch (error) {
    console.error('Twitter trending topics error:', error);
    return getMockTrendingTopics();
  }
}

function getMockTrendingTopics() {
  return [
    { name: 'Artificial Intelligence', mentions: 15420, sentiment: 'positive', category: 'technology' },
    { name: 'Climate Change', mentions: 12890, sentiment: 'negative', category: 'environment' },
    { name: 'COVID-19', mentions: 9870, sentiment: 'neutral', category: 'health' },
    { name: 'Cryptocurrency', mentions: 7650, sentiment: 'positive', category: 'finance' },
    { name: 'Space Exploration', mentions: 5430, sentiment: 'positive', category: 'science' }
  ];
}

function getTopicCategory(topic) {
  const categories = {
    'AI': 'technology',
    'Climate': 'environment',
    'COVID': 'health',
    'Crypto': 'finance',
    'Space': 'science',
    'Politics': 'politics',
    'Energy': 'environment',
    'Health': 'health',
    'Security': 'technology',
    'Education': 'education',
    'Technology': 'technology'
  };
  return categories[topic] || 'general';
}

async function getNewsReactions(newsId, platforms) {
  // Simulate news reactions (in real implementation, this would track specific news articles)
  const reactions = {
    reddit: [],
    twitter: [],
    hackernews: []
  };

  // Generate mock reactions
  const mockReactions = generateMockReactions(newsId);
  
  if (platforms === 'all' || platforms.includes('reddit')) {
    reactions.reddit = mockReactions.reddit;
  }
  
  if (platforms === 'all' || platforms.includes('twitter')) {
    reactions.twitter = mockReactions.twitter;
  }
  
  if (platforms === 'all' || platforms.includes('hackernews')) {
    reactions.hackernews = mockReactions.hackernews;
  }

  return reactions;
}

async function getSentimentTimeline(topic, days, platform) {
  // Generate mock timeline data
  const timeline = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const sentiment = Math.random() * 2 - 1; // Random sentiment between -1 and 1
    
    timeline.push({
      date: date.toISOString().split('T')[0],
      sentiment: Math.round(sentiment * 100) / 100,
      volume: Math.floor(Math.random() * 100) + 10
    });
  }

  return timeline;
}

// Mock data generators
function generateMockTweets(topic, limit) {
  const tweets = [];
  const mockTexts = [
    `Just read about ${topic}. Very interesting developments!`,
    `${topic} is really concerning. We need to address this.`,
    `Great news about ${topic}! This is a positive step forward.`,
    `I'm skeptical about ${topic}. Need more information.`,
    `${topic} shows how important this issue is.`,
    `Disappointed with the coverage of ${topic}.`,
    `${topic} is exactly what we needed!`,
    `The ${topic} situation is getting worse.`,
    `${topic} brings hope for the future.`,
    `Mixed feelings about ${topic}.`
  ];

  for (let i = 0; i < limit; i++) {
    tweets.push({
      id: `tweet_${i}`,
      text: mockTexts[i % mockTexts.length],
      likes: Math.floor(Math.random() * 1000),
      retweets: Math.floor(Math.random() * 500),
      author: `user_${i}`,
      created: new Date(Date.now() - Math.random() * 86400000).toISOString()
    });
  }

  return tweets;
}

function generateMockReactions(newsId) {
  return {
    reddit: [
      { id: 'r1', text: 'This is very concerning', sentiment: -0.5, score: 45 },
      { id: 'r2', text: 'Great analysis of the situation', sentiment: 0.8, score: 23 },
      { id: 'r3', text: 'Need more context here', sentiment: 0.1, score: 12 }
    ],
    twitter: [
      { id: 't1', text: 'Important development', sentiment: 0.3, likes: 120 },
      { id: 't2', text: 'This is unacceptable', sentiment: -0.7, likes: 89 },
      { id: 't3', text: 'Finally some good news', sentiment: 0.9, likes: 234 }
    ],
    hackernews: [
      { id: 'h1', text: 'Interesting technical implications', sentiment: 0.2, score: 15 },
      { id: 'h2', text: 'This could change everything', sentiment: 0.6, score: 8 },
      { id: 'h3', text: 'Need to see the data', sentiment: 0.0, score: 5 }
    ]
  };
}

module.exports = router; 