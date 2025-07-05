# TruthLens Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `truthlens` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings: `N`

### Option 2: Deploy via GitHub

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

## ⚙️ Environment Variables Setup

### Required Environment Variables

Set these in your Vercel project dashboard:

```bash
# Server Configuration
NODE_ENV=production
CLIENT_URL=https://your-vercel-domain.vercel.app

# Optional API Keys (app works without these)
NEWS_API_KEY=your_news_api_key_here
GUARDIAN_API_KEY=your_guardian_api_key_here
TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
REDDIT_API_KEY=your_reddit_api_key_here
SNOPES_API_KEY=your_snopes_api_key_here
POLITIFACT_API_KEY=your_politifact_api_key_here
FACTCHECK_API_KEY=your_factcheck_api_key_here
```

### How to Set Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add each variable with the appropriate environment (Production, Preview, Development)

## 📁 Project Structure for Vercel

```
truthlens/
├── vercel.json              # Vercel configuration
├── package.json             # Root package.json
├── server.js               # Main server file
├── client/                 # React frontend
│   ├── package.json
│   ├── public/
│   └── src/
├── routes/                 # API routes
├── middleware/             # Custom middleware
└── DEPLOYMENT.md          # This file
```

## 🔧 Build Configuration

### Vercel Build Settings

- **Framework Preset**: Node.js
- **Build Command**: `npm run vercel-build`
- **Output Directory**: `client/build`
- **Install Command**: `npm run install-all`

### Build Process

1. **Install Dependencies**: Both root and client dependencies
2. **Build Frontend**: React app builds to `client/build`
3. **Deploy Backend**: Node.js server runs as serverless functions
4. **Serve Static Files**: React build served by Express

## 🌐 Domain Configuration

### Custom Domain (Optional)

1. **Add Custom Domain**:
   - Go to Vercel project settings
   - Click "Domains"
   - Add your custom domain

2. **Update Environment Variables**:
   ```bash
   CLIENT_URL=https://your-custom-domain.com
   ```

## 📊 Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**:
   - Go to project settings
   - Enable "Vercel Analytics"

2. **View Metrics**:
   - Performance metrics
   - Error tracking
   - User analytics

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**:
   ```bash
   # Check build logs
   vercel logs
   
   # Rebuild locally
   npm run build
   ```

2. **API Errors**:
   - Check environment variables
   - Verify CORS settings
   - Check rate limiting

3. **Static File Issues**:
   - Ensure `client/build` exists
   - Check `vercel.json` configuration

### Debug Commands

```bash
# Test build locally
npm run build

# Test server locally
npm start

# Check Vercel deployment
vercel ls

# View deployment logs
vercel logs [deployment-url]
```

## 🚀 Post-Deployment

### Verify Deployment

1. **Check Health Endpoint**:
   ```
   https://your-domain.vercel.app/api/health
   ```

2. **Test Features**:
   - Story Mode
   - News aggregation
   - Analysis tools
   - Accessibility features

3. **Performance Check**:
   - Page load times
   - API response times
   - Mobile responsiveness

### Continuous Deployment

- **Automatic Deploys**: Every push to main branch
- **Preview Deploys**: Pull requests get preview URLs
- **Rollback**: Easy rollback to previous deployments

## 📈 Scaling Considerations

### Vercel Limits

- **Serverless Functions**: 10-second timeout (can be extended)
- **Bandwidth**: 100GB/month on Hobby plan
- **Build Time**: 45 minutes on Hobby plan

### Optimization Tips

1. **Image Optimization**: Use Vercel's image optimization
2. **Caching**: Implement proper caching headers
3. **CDN**: Vercel provides global CDN automatically

## 🔐 Security

### Security Headers

- **Helmet.js**: Automatic security headers
- **CORS**: Configured for Vercel domains
- **Rate Limiting**: API protection
- **Content Security Policy**: XSS protection

### API Security

- **Environment Variables**: Secure API key storage
- **Input Validation**: Sanitize all inputs
- **Error Handling**: No sensitive data in errors

## 📞 Support

### Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [TruthLens Issues](https://github.com/your-repo/issues)

### Contact

For deployment issues:
- Check Vercel logs first
- Review this deployment guide
- Create an issue in the repository

---

**Happy Deploying! 🎉**

Your TruthLens app should now be live on Vercel with all features working, including the enhanced Story Mode with dynamic positioning and voice guidance! 