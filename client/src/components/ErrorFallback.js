import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-300 mb-4">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 dark:text-slate-300 mb-6">
            We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                Error Details
              </summary>
              <pre className="text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
                {error.message}
                {error.stack}
              </pre>
            </details>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={resetErrorBoundary}
              className="btn-primary inline-flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            
            <Link
              to="/"
              className="btn-secondary inline-flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback; 