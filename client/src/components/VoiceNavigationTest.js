import React, { useState } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';

const VoiceNavigationTest = () => {
  const {
    isVoiceNavigationEnabled,
    isListening,
    lastSpokenText,
    speak,
    toggleVoiceNavigation,
    VOICE_COMMANDS
  } = useAccessibility();

  const [testCommand, setTestCommand] = useState('');

  const handleTestCommand = () => {
    if (testCommand.trim()) {
      speak(`Testing command: ${testCommand}`);
      // Simulate voice command processing
      console.log('Testing voice command:', testCommand);
    }
  };

  const testVoiceRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      speak('Speech recognition is available');
    } else {
      speak('Speech recognition is not available');
    }
  };

  return (
    <div className="fixed bottom-20 left-6 z-40 bg-white p-4 rounded-lg shadow-lg border max-w-sm">
      <h3 className="font-semibold text-gray-800 mb-2">Voice Navigation Test</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Status: </span>
          <span className={isVoiceNavigationEnabled ? 'text-green-600' : 'text-red-600'}>
            {isVoiceNavigationEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>
        
        <div>
          <span className="font-medium">Listening: </span>
          <span className={isListening ? 'text-green-600' : 'text-red-600'}>
            {isListening ? 'Yes' : 'No'}
          </span>
        </div>
        
        {lastSpokenText && (
          <div>
            <span className="font-medium">Last spoken: </span>
            <span className="text-gray-600">{lastSpokenText}</span>
          </div>
        )}
      </div>

      <div className="mt-3 space-y-2">
        <button
          onClick={toggleVoiceNavigation}
          className="w-full bg-blue-600 text-white py-1 px-2 rounded text-sm hover:bg-blue-700"
        >
          Toggle Voice Navigation
        </button>
        
        <button
          onClick={testVoiceRecognition}
          className="w-full bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700"
        >
          Test Speech Recognition
        </button>
        
        <div className="flex space-x-1">
          <input
            type="text"
            value={testCommand}
            onChange={(e) => setTestCommand(e.target.value)}
            placeholder="Test command"
            className="flex-1 px-2 py-1 border rounded text-sm"
          />
          <button
            onClick={handleTestCommand}
            className="bg-purple-600 text-white py-1 px-2 rounded text-sm hover:bg-purple-700"
          >
            Test
          </button>
        </div>
      </div>

      <div className="mt-3">
        <details className="text-xs">
          <summary className="cursor-pointer font-medium">Available Commands</summary>
          <div className="mt-1 space-y-1 max-h-32 overflow-y-auto">
            {Object.entries(VOICE_COMMANDS).map(([command, action]) => (
              <div key={command} className="bg-gray-50 p-1 rounded">
                <span className="font-medium">"{command}"</span> → {action}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
};

export default VoiceNavigationTest; 