import React, { useRef, useState } from 'react';
import { Volume2, Pause, Square, Play } from 'lucide-react';

const TextToSpeechButton = ({ text, lang = 'en-US', rate = 1, pitch = 1, volume = 1 }) => {
  const utteranceRef = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handlePlay = () => {
    if (!window.speechSynthesis) return alert('Text-to-speech not supported in this browser.');
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }
    if (isSpeaking) return;
    const utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (window.speechSynthesis && isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={handlePlay}
        aria-label={isSpeaking && !isPaused ? 'Reading' : 'Read text aloud'}
        className={`p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition ${isSpeaking ? 'ring-2 ring-blue-400' : ''}`}
        disabled={isSpeaking && !isPaused}
      >
        <Volume2 className="w-5 h-5" />
      </button>
      {isSpeaking && !isPaused && (
        <button
          onClick={handlePause}
          aria-label="Pause reading"
          className="p-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
        >
          <Pause className="w-5 h-5" />
        </button>
      )}
      {(isSpeaking || isPaused) && (
        <button
          onClick={handleStop}
          aria-label="Stop reading"
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition"
        >
          <Square className="w-5 h-5" />
        </button>
      )}
      {isPaused && (
        <button
          onClick={handlePlay}
          aria-label="Resume reading"
          className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 transition"
        >
          <Play className="w-5 h-5" />
        </button>
      )}
      <span className="ml-2 text-sm text-gray-600">
        {isSpeaking ? (isPaused ? 'Paused' : 'Reading...') : 'Text-to-Speech'}
      </span>
    </div>
  );
};

export default TextToSpeechButton; 