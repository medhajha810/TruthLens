import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import { ErrorBoundary } from 'react-error-boundary';

// Components
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import News from './pages/News';
import Analysis from './pages/Analysis';
import FactCheck from './pages/FactCheck';
import Social from './pages/Social';
import About from './pages/About';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ErrorFallback from './components/ErrorFallback';
import DynamicThemeWrapper from './components/DynamicThemeWrapper';
import AccessibilityPanel from './components/AccessibilityPanel';
import VoiceNavigation from './components/VoiceNavigation';
import ScreenReader from './components/ScreenReader';
import KeyboardNavigation from './components/KeyboardNavigation';
import AccessibilityWrapper from './components/AccessibilityWrapper';
import StoryMode from './components/StoryMode';
import GlobalStoryModeTrigger from './components/GlobalStoryModeTrigger';

// Context
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { DynamicThemeProvider } from './context/DynamicThemeContext';
import { TranslationProvider } from './context/TranslationContext';
import { StoryModeProvider, useStoryMode } from './context/StoryModeContext';

// Styles
import './index.css';
import './styles/accessibility.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Component to render Story Mode when active - moved inside provider
const AppContent = () => {
  const { isOpen, closeStoryMode } = useStoryMode();
  
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/fact-check" element={<FactCheck />} />
          <Route path="/social" element={<Social />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      
      {/* Global Components */}
      <GlobalStoryModeTrigger />
      {isOpen && <StoryMode onClose={closeStoryMode} />}
      
      {/* Accessibility Components */}
      <AccessibilityPanel />
      <VoiceNavigation />
      <ScreenReader />
      <KeyboardNavigation />
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ThemeProvider>
              <DynamicThemeProvider>
                <AppProvider>
                  <NotificationProvider>
                    <TranslationProvider>
                      <StoryModeProvider>
                        <AccessibilityWrapper>
                          <DynamicThemeWrapper>
                            <AppContent />
                          </DynamicThemeWrapper>
                        </AccessibilityWrapper>
                      </StoryModeProvider>
                    </TranslationProvider>
                  </NotificationProvider>
                </AppProvider>
              </DynamicThemeProvider>
            </ThemeProvider>
          </Router>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App; 