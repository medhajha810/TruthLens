import React from 'react';
import { motion } from 'framer-motion';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Shield, 
  Zap,
  Eye,
  ArrowLeft
} from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }

    // Here you could send error to your error reporting service
    // Example: Sentry.captureException(error, { extra: errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  toggleDetails = () => {
    this.setState(prevState => ({ showDetails: !prevState.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Bug className="w-12 h-12 text-white" />
            </motion.div>

            {/* Error Message */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Oops! Something went wrong
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-300 mb-8"
            >
              TruthLens encountered an unexpected error. Our team has been notified and is working to fix it.
            </motion.p>

            {/* Error Details Toggle */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mb-6"
            >
              <button
                onClick={this.toggleDetails}
                className="flex items-center justify-center space-x-2 mx-auto text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>{this.state.showDetails ? 'Hide' : 'Show'} Error Details</span>
              </button>
            </motion.div>

            {/* Error Details */}
            <AnimatePresence>
              {this.state.showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 text-left border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Error Details:
                  </h3>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-auto max-h-32">
                    {this.state.error && (
                      <div className="mb-2">
                        <strong>Error:</strong> {this.state.error.toString()}
                      </div>
                    )}
                    {this.state.errorInfo && (
                      <div>
                        <strong>Stack Trace:</strong>
                        <pre className="mt-1 text-xs">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <button
                onClick={this.handleRetry}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </motion.div>

            {/* Helpful Information */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                What you can do:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Refresh the page</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Sometimes a simple refresh can fix the issue.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Check your connection</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Ensure you have a stable internet connection.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Clear browser cache</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Try clearing your browser's cache and cookies.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Contact support</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">If the problem persists, contact our support team.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute top-20 left-10 text-red-200 opacity-30"
            >
              <AlertTriangle className="w-8 h-8" />
            </motion.div>
            
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute top-40 right-20 text-orange-200 opacity-30"
            >
              <Bug className="w-6 h-6" />
            </motion.div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 