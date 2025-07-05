import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccessibilityProvider } from '../context/AccessibilityContext';

const AccessibilityWrapper = ({ children }) => {
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  return (
    <AccessibilityProvider navigateRef={navigateRef}>
      {children}
    </AccessibilityProvider>
  );
};

export default AccessibilityWrapper; 