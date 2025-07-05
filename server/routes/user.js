const express = require('express');
const router = express.Router();

// In-memory storage for demo (in production, use a database)
let users = new Map();
let userFeedback = new Map();
let userVotes = new Map();
let userPreferences = new Map();

// User feedback and voting
router.post('/feedback', (req, res) => {
  try {
    const { userId, articleId, rating, comment, category } = req.body;
    
    if (!userId || !articleId || !rating) {
      return res.status(400).json({ error: 'userId, articleId, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const feedback = {
      id: Date.now().toString(),
      userId,
      articleId,
      rating: parseInt(rating),
      comment: comment || '',
      category: category || 'general',
      timestamp: new Date().toISOString()
    };

    if (!userFeedback.has(articleId)) {
      userFeedback.set(articleId, []);
    }
    userFeedback.get(articleId).push(feedback);

    res.json({
      success: true,
      feedback,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Vote on article trustworthiness
router.post('/vote', (req, res) => {
  try {
    const { userId, articleId, vote, reason } = req.body;
    
    if (!userId || !articleId || !vote) {
      return res.status(400).json({ error: 'userId, articleId, and vote are required' });
    }

    if (!['trustworthy', 'untrustworthy', 'neutral'].includes(vote)) {
      return res.status(400).json({ error: 'Vote must be trustworthy, untrustworthy, or neutral' });
    }

    const voteData = {
      id: Date.now().toString(),
      userId,
      articleId,
      vote,
      reason: reason || '',
      timestamp: new Date().toISOString()
    };

    if (!userVotes.has(articleId)) {
      userVotes.set(articleId, []);
    }
    userVotes.get(articleId).push(voteData);

    res.json({
      success: true,
      vote: voteData,
      message: 'Vote submitted successfully'
    });
  } catch (error) {
    console.error('Vote submission error:', error);
    res.status(500).json({ error: 'Failed to submit vote' });
  }
});

// Get article feedback and votes
router.get('/article/:articleId', (req, res) => {
  try {
    const { articleId } = req.params;
    
    const feedback = userFeedback.get(articleId) || [];
    const votes = userVotes.get(articleId) || [];

    // Calculate statistics
    const avgRating = feedback.length > 0 
      ? feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length 
      : 0;

    const voteStats = {
      trustworthy: votes.filter(v => v.vote === 'trustworthy').length,
      untrustworthy: votes.filter(v => v.vote === 'untrustworthy').length,
      neutral: votes.filter(v => v.vote === 'neutral').length,
      total: votes.length
    };

    const trustScore = voteStats.total > 0 
      ? ((voteStats.trustworthy - voteStats.untrustworthy) / voteStats.total) * 100 
      : 0;

    res.json({
      articleId,
      feedback: {
        items: feedback.slice(-10), // Last 10 feedback items
        averageRating: Math.round(avgRating * 100) / 100,
        totalCount: feedback.length
      },
      votes: {
        items: votes.slice(-10), // Last 10 votes
        statistics: voteStats,
        trustScore: Math.round(trustScore)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Article feedback error:', error);
    res.status(500).json({ error: 'Failed to fetch article feedback' });
  }
});

// User preferences management
router.post('/preferences', (req, res) => {
  try {
    const { userId, preferences } = req.body;
    
    if (!userId || !preferences) {
      return res.status(400).json({ error: 'userId and preferences are required' });
    }

    const userPrefs = {
      userId,
      preferences: {
        topics: preferences.topics || [],
        sources: preferences.sources || [],
        biasPreference: preferences.biasPreference || 'balanced',
        factCheckLevel: preferences.factCheckLevel || 'standard',
        notifications: preferences.notifications || false,
        language: preferences.language || 'en',
        ...preferences
      },
      updatedAt: new Date().toISOString()
    };

    userPreferences.set(userId, userPrefs);

    res.json({
      success: true,
      preferences: userPrefs,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Get user preferences
router.get('/preferences/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const preferences = userPreferences.get(userId);
    
    if (!preferences) {
      return res.status(404).json({ error: 'User preferences not found' });
    }

    res.json(preferences);
  } catch (error) {
    console.error('Preferences fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// User reading history
router.post('/history', (req, res) => {
  try {
    const { userId, articleId, action = 'view' } = req.body;
    
    if (!userId || !articleId) {
      return res.status(400).json({ error: 'userId and articleId are required' });
    }

    const historyEntry = {
      id: Date.now().toString(),
      userId,
      articleId,
      action,
      timestamp: new Date().toISOString()
    };

    if (!users.has(userId)) {
      users.set(userId, { history: [] });
    }
    
    const user = users.get(userId);
    user.history.push(historyEntry);
    
    // Keep only last 100 entries
    if (user.history.length > 100) {
      user.history = user.history.slice(-100);
    }

    res.json({
      success: true,
      history: historyEntry,
      message: 'History updated successfully'
    });
  } catch (error) {
    console.error('History update error:', error);
    res.status(500).json({ error: 'Failed to update history' });
  }
});

// Get user reading history
router.get('/history/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20, action } = req.query;
    
    const user = users.get(userId);
    
    if (!user) {
      return res.json({ history: [], totalCount: 0 });
    }

    let history = user.history;
    
    if (action) {
      history = history.filter(entry => entry.action === action);
    }

    res.json({
      history: history.slice(-parseInt(limit)),
      totalCount: history.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

// User statistics
router.get('/stats/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.get(userId);
    const feedback = Array.from(userFeedback.values()).flat().filter(f => f.userId === userId);
    const votes = Array.from(userVotes.values()).flat().filter(v => v.userId === userId);
    const preferences = userPreferences.get(userId);

    const stats = {
      userId,
      totalArticlesRead: user ? user.history.length : 0,
      totalFeedback: feedback.length,
      totalVotes: votes.length,
      averageRating: feedback.length > 0 
        ? Math.round(feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length * 100) / 100 
        : 0,
      voteDistribution: {
        trustworthy: votes.filter(v => v.vote === 'trustworthy').length,
        untrustworthy: votes.filter(v => v.vote === 'untrustworthy').length,
        neutral: votes.filter(v => v.vote === 'neutral').length
      },
      preferences: preferences ? preferences.preferences : null,
      lastActivity: user && user.history.length > 0 
        ? user.history[user.history.length - 1].timestamp 
        : null,
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user statistics' });
  }
});

// Community statistics
router.get('/community/stats', (req, res) => {
  try {
    const allFeedback = Array.from(userFeedback.values()).flat();
    const allVotes = Array.from(userVotes.values()).flat();
    const allUsers = Array.from(users.keys());

    const stats = {
      totalUsers: allUsers.length,
      totalFeedback: allFeedback.length,
      totalVotes: allVotes.length,
      averageRating: allFeedback.length > 0 
        ? Math.round(allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length * 100) / 100 
        : 0,
      voteDistribution: {
        trustworthy: allVotes.filter(v => v.vote === 'trustworthy').length,
        untrustworthy: allVotes.filter(v => v.vote === 'untrustworthy').length,
        neutral: allVotes.filter(v => v.vote === 'neutral').length
      },
      topCategories: getTopCategories(allFeedback),
      mostActiveUsers: getMostActiveUsers(allUsers, allFeedback, allVotes),
      timestamp: new Date().toISOString()
    };

    res.json(stats);
  } catch (error) {
    console.error('Community stats error:', error);
    res.status(500).json({ error: 'Failed to fetch community statistics' });
  }
});

// Helper functions
function getTopCategories(feedback) {
  const categories = {};
  
  feedback.forEach(f => {
    categories[f.category] = (categories[f.category] || 0) + 1;
  });

  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([category, count]) => ({ category, count }));
}

function getMostActiveUsers(users, feedback, votes) {
  const userActivity = {};
  
  users.forEach(userId => {
    const userFeedback = feedback.filter(f => f.userId === userId).length;
    const userVotes = votes.filter(v => v.userId === userId).length;
    userActivity[userId] = userFeedback + userVotes;
  });

  return Object.entries(userActivity)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([userId, activity]) => ({ userId, activity }));
}

module.exports = router; 