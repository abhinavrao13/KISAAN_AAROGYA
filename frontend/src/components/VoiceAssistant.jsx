import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Sparkles } from 'lucide-react';

export default function VoiceAssistant({ textToSpeak, language = 'en', onQueryReceived, t }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognizedText, setRecognizedText] = useState('');

  const langMap = {
    en: 'en-IN',
    hi: 'hi-IN',
    pa: 'pa-IN',
    mr: 'mr-IN',
    te: 'te-IN',
    ta: 'ta-IN'
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !textToSpeak) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 0.95; // Clear natural pacing for farmers
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleListen = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = langMap[language] || 'hi-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedText(transcript);
        setIsListening(false);
        if (onQueryReceived) {
          onQueryReceived(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
      
      {/* Left info */}
      <div className="flex items-center space-x-3 w-full md:w-auto">
        <div className="relative flex items-center justify-center">
          <div className={`w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 ${isPlaying ? 'ring-4 ring-emerald-400/40 animate-pulse' : ''}`}>
            {isPlaying ? <Volume2 className="w-6 h-6 animate-bounce" /> : <Sparkles className="w-6 h-6" />}
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h4 className="font-bold text-sm sm:text-base tracking-wide">
              {isPlaying ? t.voice_speaking : "Voice AI Assistant (आवाज में साथी)"}
            </h4>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
              Regional Audio
            </span>
          </div>
          <p className="text-xs text-emerald-200/80 mt-0.5 line-clamp-1">
            {recognizedText ? `Recognized: "${recognizedText}"` : "Tap speaker to hear diagnosis aloud or mic to speak"}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
        {/* Speak / Listen Output Button */}
        {textToSpeak && (
          <button
            onClick={handleSpeak}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-600 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold'
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlaying ? "Stop Audio" : t.voice_listen}</span>
          </button>
        )}

        {/* Mic Input Button */}
        <button
          onClick={handleToggleListen}
          title={t.voice_mic_hint}
          className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-md ${
            isListening
              ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
              : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          <span>{isListening ? t.voice_mic_listening : "Ask by Voice"}</span>
        </button>
      </div>

    </div>
  );
}
