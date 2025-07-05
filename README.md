# TruthLens: A Multi-Perspective News Analyzer

TruthLens is an advanced platform designed to aggregate news from diverse sources, analyze sentiment and bias, and integrate fact-checking to provide users with a comprehensive and transparent view of current events. Our mission is to promote media literacy, combat misinformation, and empower users to critically evaluate news coverage from multiple perspectives.

![TruthLens Demo](https://via.placeholder.com/800x400/2563eb/ffffff?text=TruthLens+Demo)

## 🚀 Key Features

- **Multi-Source News Aggregation** ✅  
  Collects news articles from multiple trusted sources (e.g., BBC, CNN, Reuters, NY Times) to ensure balanced and diverse coverage of events.

- **Sentiment & Bias Analysis** ✅  
  Utilizes advanced algorithms to assess the tone of articles and highlight potential biases in news outlets.

- **Social Media Sentiment Integration** ✅  
  Analyzes public sentiment and user-generated content from platforms like Twitter and Reddit to gauge real-time reactions to news stories.

- **Fact-Checking Integration** ✅  
  Automatically cross-references news articles with reputable fact-checking organizations (e.g., PolitiFact, FactCheck.org) to verify claims.

- **Interactive Visualizations** ✅  
  Presents charts, heatmaps, and side-by-side comparisons to provide insights into different interpretations of the same event.

- **User Feedback & Voting** ✅  
  Enables users to rate the trustworthiness of articles and contribute their perspectives on the accuracy of information.

- **Real-time Notifications** ✅  
  Provides live updates on trending topics, bias alerts, and fact-checking results.

- **Global Search** ✅  
  Search across news, analysis, and fact-checking features with intelligent filtering.

## 🛠️ Technologies Used

**Frontend**
- React.js 18 with modern hooks and context
- Tailwind CSS for responsive, modern UI
- Framer Motion for smooth animations
- React Query for data fetching and caching
- React Router for navigation
- Lucide React for beautiful icons

**Backend**
- Node.js with Express.js
- Socket.io for real-time features
- Natural language processing libraries
- Caching with Node-Cache
- Rate limiting and security middleware

**APIs & Services**
- NewsAPI for news aggregation
- The Guardian API for additional news sources
- Hacker News API for tech news
- Reddit API for social sentiment
- Various fact-checking APIs

## ⚡ Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Georgian-86/TruthLens.git
cd TruthLens
```

### 2. Install Dependencies

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and configure your API keys:

```bash
cp env.example .env
```

Edit `.env` with your API keys:

```ini
# Server Configuration
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000

# News APIs (Optional - app works without these)
NEWS_API_KEY=your_news_api_key_here
GUARDIAN_API_KEY=your_guardian_api_key_here

# Social Media APIs (Optional)
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
REDDIT_API_KEY=your_reddit_api_key_here

# Fact-Checking APIs (Optional)
SNOPES_API_KEY=your_snopes_api_key_here
POLITIFACT_API_KEY=your_politifact_api_key_here
FACTCHECK_API_KEY=your_factcheck_api_key_here
```

### 4. Running the Project

**Development Mode (Recommended):**
```bash
# Install all dependencies
npm run install-all

# Start both backend and frontend
npm run dev
```

**Or run separately:**

**Backend:**
```bash
npm run server
```

**Frontend (in a separate terminal):**
```bash
cd client
npm start
```

The app will be available at:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000](http://localhost:5000)

## 📱 Features Overview

### 🏠 Home Page ✅
- Engaging hero section with animated statistics
- Feature showcase with interactive elements
- Live platform statistics with real-time updates
- Call-to-action sections

### 📰 News Aggregation ✅
- Multi-source news collection with demo data fallback
- Advanced filtering and search functionality
- Grid and list view modes
- Real-time trending topics
- Bias indicators for each article
- User feedback and voting system
- Article bookmarking and sharing

### 📊 Analysis Dashboard ✅
- Real-time sentiment analysis for articles and text
- Bias detection algorithms with detailed insights
- Source credibility scoring
- Interactive visualizations and comparisons
- Article comparison tools
- Keyword extraction and analysis

### ✅ Fact Checking ✅
- Claim verification against databases
- Integration with fact-checking organizations
- Trending fact-checks with verdicts
- Article analysis for false claims
- Source credibility assessment
- Related claims suggestions

### 💬 Social Sentiment ✅
- Social media sentiment analysis
- Trending topics from multiple platforms
- Real-time reactions to news
- Sentiment timeline tracking
- Platform-specific analysis
- Public sentiment insights

### 👥 User Features ✅
- User feedback and voting system
- Article rating with star system
- Trustworthiness voting (Trust/Neutral/Untrust)
- Reading history tracking
- Personalized preferences
- Community statistics

### 🔍 Global Search ✅
- Cross-platform search functionality
- Intelligent filtering by category
- Real-time search results
- Search across news, analysis, and fact checks

### 🔔 Real-time Notifications ✅
- Live platform updates
- Bias detection alerts
- Fact-checking completions
- Trending topic notifications

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Accessibility**: WCAG compliant with keyboard navigation
- **Performance**: Optimized loading with lazy loading and caching
- **Animations**: Smooth transitions and micro-interactions
- **Real-time Updates**: Live statistics and notifications

## 🔧 API Endpoints

### News ✅
- `GET /api/news/aggregate` - Get aggregated news with demo data fallback
- `GET /api/news/trending` - Get trending topics
- `GET /api/news/search` - Search news articles

### Analysis ✅
- `POST /api/analysis/sentiment` - Analyze sentiment with detailed insights
- `POST /api/analysis/compare` - Compare articles
- `POST /api/analysis/credibility` - Check source credibility

### Fact Checking ✅
- `POST /api/fact-check/verify` - Verify claims with verdicts
- `GET /api/fact-check/trending` - Get trending fact-checks
- `POST /api/fact-check/analyze-article` - Analyze article for claims

### Social ✅
- `GET /api/social/sentiment/:topic` - Get social sentiment with percentages
- `GET /api/social/trending` - Get trending social topics
- `GET /api/social/reactions/:newsId` - Get news reactions
- `GET /api/social/reactions/latest` - Get latest reactions

### User ✅
- `POST /api/user/feedback` - Submit feedback with ratings
- `POST /api/user/vote` - Vote on articles
- `GET /api/user/article/:articleId` - Get article feedback
- `POST /api/user/preferences` - Update preferences

## 🚀 Deployment

### Production Build

```bash
# Build the frontend
cd client
npm run build

# Start production server
npm start
```

### Environment Variables for Production

Set these environment variables in your production environment:

```bash
NODE_ENV=production
PORT=5000
CLIENT_URL=https://yourdomain.com
```

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork the repository to your GitHub account
2. Create a new branch:  
   `git checkout -b feature-branch`
3. Make your changes and add tests if applicable
4. Commit your changes:  
   `git commit -am 'Add new feature'`
5. Push to your branch:  
   `git push origin feature-branch`
6. Create a pull request to the main repository

### Development Guidelines

- Follow the existing code style and conventions
- Add proper error handling and loading states
- Include responsive design considerations
- Write meaningful commit messages
- Test your changes thoroughly

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 📬 Contact

For questions or support, please reach out:

- **Email:** optimus4586prime@gmail.com
- **GitHub:** https://github.com/Georgian-86
- **LinkedIn:** https://www.linkedin.com/in/golukumar15/

## 🙏 Acknowledgments

- NewsAPI for providing news aggregation services
- The Guardian for their open API
- Hacker News for their public API
- All the open-source libraries that make this project possible

## 📈 Roadmap

- [x] Advanced AI-powered bias detection
- [x] Real-time fact-checking alerts
- [ ] Mobile app development
- [ ] Multi-language support
- [x] Advanced analytics dashboard
- [x] API rate limiting improvements
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication system
- [x] Advanced search filters
- [ ] Export functionality

---

**TruthLens** - See through the noise, find the truth. 🔍✨
