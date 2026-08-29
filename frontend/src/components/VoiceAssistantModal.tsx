import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, Volume2, Loader2, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

// We need to declare the webkit variants for TypeScript since they aren't standard
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const VoiceAssistantModal: React.FC = () => {
  const { isVoiceModalOpen, setIsVoiceModalOpen } = useApp();
  
  // States: 'idle', 'listening', 'processing', 'speaking', 'error'
  const [assistantState, setAssistantState] = useState<'idle' | 'listening' | 'processing' | 'speaking' | 'error'>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [language, setLanguage] = useState<'en-IN' | 'hi-IN' | 'mr-IN'>('hi-IN'); // default to Hindi
  const [errorMsg, setErrorMsg] = useState('');

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onstart = () => {
          setAssistantState('listening');
          setTranscript('');
          setResponse('');
          setErrorMsg('');
        };

        recognitionRef.current.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setAssistantState('error');
          setErrorMsg(`Microphone error: ${event.error}`);
        };

        recognitionRef.current.onend = () => {
          // If we were listening and it ended naturally, we should process
          setAssistantState(prev => {
            if (prev === 'listening') {
              // trigger processing
              return 'processing';
            }
            return prev;
          });
        };
      } else {
        setAssistantState('error');
        setErrorMsg('Speech recognition not supported in this browser.');
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  // Effect to handle the transition from listening -> processing
  useEffect(() => {
    if (assistantState === 'processing') {
      if (transcript.trim() === '') {
        setAssistantState('idle');
        return;
      }
      handleProcessVoice(transcript);
    }
  }, [assistantState]);

  const handleProcessVoice = async (text: string) => {
    try {
      // Backend call
      const res = await fetch('/api/voice-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: text, language }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch AI response');
      }

      setResponse(data.text);
      setAssistantState('speaking');
      speakResponse(data.text);

    } catch (err: any) {
      console.error(err);
      setAssistantState('error');
      setErrorMsg(err.message || 'Something went wrong processing your request.');
    }
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      
      // Try to find a good voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.startsWith(language.split('-')[0])) || voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.default);
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onend = () => {
        setAssistantState('idle');
      };
      
      utterance.onerror = (e) => {
        console.error('Speech synthesis error', e);
        setAssistantState('idle'); // fail gracefully back to idle
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // fallback if no TTS
      setTimeout(() => setAssistantState('idle'), 3000);
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      window.speechSynthesis.cancel(); // Stop talking if we are talking
      recognitionRef.current.lang = language;
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Already started
      }
    }
  };

  const stopInteractions = () => {
    if (recognitionRef.current) recognitionRef.current.abort();
    window.speechSynthesis.cancel();
    setAssistantState('idle');
  };

  const closeModal = () => {
    stopInteractions();
    setIsVoiceModalOpen(false);
  };

  if (!isVoiceModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200 p-4">
      <div className="w-full max-w-md bg-[#0e120f] shadow-2xl border border-emerald-500/30 rounded-3xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-emerald-500/20 bg-gradient-to-r from-emerald-950/50 to-transparent">
          <div className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white tracking-wide">Krishi Voice</h3>
          </div>
          <button
            onClick={closeModal}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
          
          {/* Status Indicator */}
          <div className="text-center mb-8 h-8">
            {assistantState === 'idle' && (
              <p className="text-neutral-400 font-medium">Tap the microphone and ask me a question.</p>
            )}
            {assistantState === 'listening' && (
              <p className="text-emerald-400 font-bold animate-pulse">Listening...</p>
            )}
            {assistantState === 'processing' && (
              <p className="text-amber-400 font-bold flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </p>
            )}
            {assistantState === 'speaking' && (
              <p className="text-emerald-400 font-bold">Speaking...</p>
            )}
            {assistantState === 'error' && (
              <p className="text-red-400 font-medium text-sm max-w-xs">{errorMsg}</p>
            )}
          </div>

          {/* Big Mic Button */}
          <button
            onClick={assistantState === 'listening' ? stopInteractions : startListening}
            disabled={assistantState === 'processing'}
            className={`relative group rounded-full p-8 transition-all duration-300 ${
              assistantState === 'listening' 
                ? 'bg-red-500/20 text-red-500 border-2 border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)]' 
                : assistantState === 'processing'
                ? 'bg-amber-500/20 text-amber-500 border-2 border-amber-500/50 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/50 border-2 border-emerald-400/30'
            }`}
          >
            {assistantState === 'listening' && (
              <div className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-ping" />
            )}
            <Mic className={`w-12 h-12 ${assistantState === 'listening' ? 'animate-pulse' : ''}`} />
          </button>

          {/* Text Area display */}
          <div className="mt-8 w-full text-center h-[80px] overflow-hidden flex flex-col justify-end">
            {transcript && (
              <p className={`text-sm italic mb-2 ${assistantState === 'speaking' ? 'text-neutral-500' : 'text-white'}`}>
                "{transcript}"
              </p>
            )}
            {response && assistantState === 'speaking' && (
              <p className="text-emerald-300 font-medium text-sm line-clamp-3 overflow-y-auto">
                {response}
              </p>
            )}
          </div>

        </div>

        {/* Footer Language Selection */}
        <div className="p-4 bg-[#0a0d0b] border-t border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
            <Globe className="w-4 h-4" />
            Language
          </div>
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
            {[
              { code: 'en-IN', label: 'English' },
              { code: 'hi-IN', label: 'हिंदी' },
              { code: 'mr-IN', label: 'मराठी' }
            ].map(lang => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  language === lang.code 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
