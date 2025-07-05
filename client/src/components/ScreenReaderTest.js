import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const ScreenReaderTest = () => {
  const { speak, isScreenReaderEnabled } = useAccessibility();
  const [testText, setTestText] = useState('This is a test of the screen reader functionality. It should read this entire sentence aloud when you click the test button.');

  const testScreenReader = () => {
    speak(testText, { rate: 0.8, pitch: 1, volume: 0.9 });
  };

  const testLongText = () => {
    const longText = `Welcome to TruthLens, your comprehensive news analysis platform. This is a test of the screen reader functionality to ensure it can properly read longer content. The screen reader should read this entire paragraph without stopping or missing words. TruthLens provides multi-source news aggregation, sentiment analysis, and fact-checking to help you see through the noise and find the truth. Our platform is designed to be accessible to all users, including those using screen readers and other assistive technologies.`;
    speak(longText, { rate: 0.9, pitch: 1, volume: 0.8 });
  };

  if (!isScreenReaderEnabled) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Screen reader is not enabled. Enable it in the accessibility panel to test.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-blue-800 mb-4">Screen Reader Test</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-700 mb-2">
            Test Text:
          </label>
          <textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            className="w-full p-2 border border-blue-300 rounded-md"
            rows={3}
            placeholder="Enter text to test screen reader..."
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={testScreenReader}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Test Short Text
          </button>
          
          <button
            onClick={testLongText}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Test Long Text
          </button>
        </div>

        <div className="text-sm text-blue-600">
          <p><strong>Instructions:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Enter custom text in the textarea above</li>
            <li>Click "Test Short Text" to read your custom text</li>
            <li>Click "Test Long Text" to read a longer paragraph</li>
            <li>The screen reader should read the entire text without stopping</li>
            <li>If it stops early, there may be an issue with speech synthesis</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScreenReaderTest; 