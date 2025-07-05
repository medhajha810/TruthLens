import { useCallback } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useNavigate } from 'react-router-dom';

export const useAccessibilityFeatures = () => {
  const accessibility = useAccessibility();
  const navigate = useNavigate();

  // Enhanced navigation with voice feedback
  const navigateWithFeedback = useCallback((path, pageName) => {
    navigate(path);
    accessibility.speak(`Navigating to ${pageName}`);
  }, [navigate, accessibility]);

  // Quick navigation functions
  const goHome = useCallback(() => {
    navigateWithFeedback('/', 'Home');
  }, [navigateWithFeedback]);

  const goToNews = useCallback(() => {
    navigateWithFeedback('/news', 'News');
  }, [navigateWithFeedback]);

  const goToAnalysis = useCallback(() => {
    navigateWithFeedback('/analysis', 'Analysis');
  }, [navigateWithFeedback]);

  const goToFactCheck = useCallback(() => {
    navigateWithFeedback('/fact-check', 'Fact Check');
  }, [navigateWithFeedback]);

  const goToSocial = useCallback(() => {
    navigateWithFeedback('/social', 'Social');
  }, [navigateWithFeedback]);

  const goToSettings = useCallback(() => {
    navigateWithFeedback('/settings', 'Settings');
  }, [navigateWithFeedback]);

  const goToProfile = useCallback(() => {
    navigateWithFeedback('/profile', 'Profile');
  }, [navigateWithFeedback]);

  const goToAbout = useCallback(() => {
    navigateWithFeedback('/about', 'About');
  }, [navigateWithFeedback]);

  // Enhanced element focus with voice feedback
  const focusElement = useCallback((selector, description) => {
    const element = document.querySelector(selector);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      accessibility.speak(`Focused on ${description}`);
    } else {
      accessibility.speak(`${description} not found`);
    }
  }, [accessibility]);

  // Enhanced button click with voice feedback
  const clickButton = useCallback((selector, description) => {
    const button = document.querySelector(selector);
    if (button) {
      button.click();
      accessibility.speak(`Clicked ${description}`);
    } else {
      accessibility.speak(`${description} not found`);
    }
  }, [accessibility]);

  // Enhanced form interaction
  const fillFormField = useCallback((selector, value, fieldName) => {
    const field = document.querySelector(selector);
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      accessibility.speak(`Filled ${fieldName} with ${value}`);
    } else {
      accessibility.speak(`${fieldName} field not found`);
    }
  }, [accessibility]);

  // Enhanced reading functions
  const readElement = useCallback((selector, description) => {
    const element = document.querySelector(selector);
    if (element) {
      const text = element.textContent || element.innerText;
      accessibility.speak(`${description}: ${text}`);
    } else {
      accessibility.speak(`${description} not found`);
    }
  }, [accessibility]);

  // Enhanced error handling with voice feedback
  const announceError = useCallback((error, context) => {
    console.error(`Error in ${context}:`, error);
    accessibility.speak(`Error in ${context}: ${error.message}`);
  }, [accessibility]);

  // Enhanced success feedback
  const announceSuccess = useCallback((message) => {
    accessibility.speak(`Success: ${message}`);
  }, [accessibility]);

  // Enhanced loading feedback
  const announceLoading = useCallback((action) => {
    accessibility.speak(`Loading ${action}...`);
  }, [accessibility]);

  // Enhanced completion feedback
  const announceCompletion = useCallback((action) => {
    accessibility.speak(`${action} completed`);
  }, [accessibility]);

  // Enhanced search functionality
  const performSearch = useCallback((query) => {
    const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
    if (searchInput) {
      searchInput.value = query;
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      searchInput.form?.submit();
      accessibility.speak(`Searching for ${query}`);
    } else {
      accessibility.speak('Search field not found');
    }
  }, [accessibility]);

  // Enhanced menu interaction
  const toggleMenu = useCallback(() => {
    const menuButton = document.querySelector('[aria-label*="menu"], [aria-label*="Menu"]');
    if (menuButton) {
      menuButton.click();
      accessibility.speak('Menu toggled');
    } else {
      accessibility.speak('Menu button not found');
    }
  }, [accessibility]);

  // Enhanced modal interaction
  const closeModal = useCallback(() => {
    const closeButton = document.querySelector('[aria-label*="close"], [aria-label*="Close"]');
    if (closeButton) {
      closeButton.click();
      accessibility.speak('Modal closed');
    } else {
      accessibility.speak('Close button not found');
    }
  }, [accessibility]);

  // Enhanced scroll functions
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    accessibility.speak('Scrolled to top');
  }, [accessibility]);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    accessibility.speak('Scrolled to bottom');
  }, [accessibility]);

  const scrollToElement = useCallback((selector, description) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      accessibility.speak(`Scrolled to ${description}`);
    } else {
      accessibility.speak(`${description} not found`);
    }
  }, [accessibility]);

  // Enhanced accessibility status
  const getAccessibilityStatus = useCallback(() => {
    const status = {
      voiceNavigation: accessibility.isVoiceNavigationEnabled,
      screenReader: accessibility.isScreenReaderEnabled,
      colorblindMode: accessibility.isColorblindModeEnabled,
      highContrast: accessibility.isHighContrastEnabled,
      fontSize: accessibility.fontSize,
      isListening: accessibility.isListening,
      isReading: accessibility.isReading
    };

    const statusText = Object.entries(status)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    accessibility.speak(`Accessibility status: ${statusText}`);
    return status;
  }, [accessibility]);

  // Enhanced theme switching
  const switchTheme = useCallback((theme) => {
    // This would integrate with your theme context
    accessibility.speak(`Switched to ${theme} theme`);
  }, [accessibility]);

  // Enhanced language switching
  const switchLanguage = useCallback((language) => {
    // This would integrate with your translation context
    accessibility.speak(`Switched to ${language} language`);
  }, [accessibility]);

  return {
    // Original accessibility context
    ...accessibility,
    
    // Enhanced navigation
    navigateWithFeedback,
    goHome,
    goToNews,
    goToAnalysis,
    goToFactCheck,
    goToSocial,
    goToSettings,
    goToProfile,
    goToAbout,
    
    // Enhanced interactions
    focusElement,
    clickButton,
    fillFormField,
    readElement,
    
    // Enhanced feedback
    announceError,
    announceSuccess,
    announceLoading,
    announceCompletion,
    
    // Enhanced functionality
    performSearch,
    toggleMenu,
    closeModal,
    scrollToTop,
    scrollToBottom,
    scrollToElement,
    
    // Enhanced status and settings
    getAccessibilityStatus,
    switchTheme,
    switchLanguage
  };
}; 