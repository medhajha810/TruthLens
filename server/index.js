const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const newsRoutes = require('./routes/news');
const analysisRoutes = require('./routes/analysis');
const factCheckRoutes = require('./routes/factCheck');
const socialRoutes = require('./routes/social');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);

// Trust proxy for rate limiting
app.set('trust proxy', 1);

const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use(express.static('public'));

// API Routes
app.use('/api/news', newsRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/fact-check', factCheckRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/user', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('join-news-room', (topic) => {
    socket.join(`news-${topic}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 TruthLens server running on port ${PORT}`);
  console.log(`📰 News analysis platform ready`);
  console.log(`🔍 Fact-checking services active`);
  console.log(`📊 Sentiment analysis enabled`);
  
  // Log API key status
  if (process.env.GUARDIAN_API_KEY && process.env.GUARDIAN_API_KEY !== 'test') {
    console.log(`✅ Guardian API key configured`);
  } else {
    console.log(`⚠️  Guardian API key not configured - using demo data`);
  }
  
  if (process.env.NEWS_API_KEY && process.env.NEWS_API_KEY !== 'test') {
    console.log(`✅ NewsAPI key configured`);
  } else {
    console.log(`⚠️  NewsAPI key not configured - using demo data`);
  }
  
  if (process.env.TWITTER_BEARER_TOKEN && process.env.TWITTER_BEARER_TOKEN !== 'test') {
    console.log(`✅ Twitter API configured`);
  } else {
    console.log(`⚠️  Twitter API not configured - using demo data`);
  }
  
  if (process.env.FACTCHECK_API_KEY && process.env.FACTCHECK_API_KEY !== 'test') {
    console.log(`✅ FactCheck.org API configured`);
  } else {
    console.log(`⚠️  FactCheck.org API not configured - using keyword analysis`);
  }
  
  if (process.env.SERPER_API_KEY && process.env.SERPER_API_KEY !== 'test') {
    console.log(`✅ Serper.dev Web Search API configured`);
  } else {
    console.log(`⚠️  Serper.dev Web Search API not configured - web search fallback disabled`);
  }
});

module.exports = { app, io }; 