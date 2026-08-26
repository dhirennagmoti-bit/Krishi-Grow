import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Lightbulb, MessageSquare } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { queryGeminiAgriAI } from '../services/gemini';

export const AIAssistantModal: React.FC = () => {
  const { isAIModalOpen, setIsAIModalOpen } = useApp();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am **AgriAI**, your value-chain intelligence advisor powered by Gemini AI. Ask me anything about crop protection, pesticide dosages, mandi price forecasts, cold storage, transport, or food processing!'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAIModalOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        scrollToBottom();
      }, 100);
    }
  }, [isAIModalOpen, messages, isTyping]);

  if (!isAIModalOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || prompt).trim();
    if (!q) return;

    const currentHistory = [...messages];
    setMessages(prev => [...prev, { sender: 'user', text: q }]);
    setPrompt('');
    setIsTyping(true);

    try {
      const response = await queryGeminiAgriAI(q, currentHistory);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: '🌾 I am here to help. Please try asking your question again or choose from the suggested questions above.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const samplePrompts = [
    '🧅 10 tonnes onion storage advice',
    '🚛 Lowest freight to Vashi Mandi',
    '🍅 Tomato processing into puree',
    '🛡️ Best pesticide for early blight'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#0e120f] h-full shadow-2xl border-l border-emerald-500/20 flex flex-col justify-between overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-[#0e1712] to-black border-b border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-950">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white tracking-tight">AgriAI Advisor</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live AI
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">Krishi Grow Agricultural Intelligence</p>
            </div>
          </div>
          <button
            onClick={() => setIsAIModalOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#0a0d0b]">
          
          {/* Sample Quick Prompts */}
          <div className="space-y-2 pb-2 border-b border-white/5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Suggested Topics
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {samplePrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sp)}
                  className="text-[11px] font-medium bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 px-2.5 py-2 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 transition-all text-left truncate cursor-pointer shadow-xs"
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Messages */}
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-xs shadow-lg shadow-emerald-950 font-medium'
                    : 'bg-white/10 text-neutral-100 border border-white/10 rounded-bl-xs shadow-md backdrop-blur-md'
                }`}
              >
                {m.text.split('\n').map((line, i) => {
                  if (line.startsWith('• ') || line.startsWith('- ')) {
                    return (
                      <p key={i} className="mt-1 pl-2 text-neutral-200">
                        {line}
                      </p>
                    );
                  }
                  return (
                    <p key={i} className={i > 0 ? 'mt-1.5' : ''}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-xs border border-white/10 text-xs text-neutral-300 flex items-center gap-2.5 shadow-md">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
                <span className="font-medium">AgriAI is formulating advice...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div className="p-3.5 bg-[#0e120f] border-t border-emerald-500/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your question here (e.g. crop health, market price)..."
              className="flex-1 px-4 py-3 text-xs bg-white/10 text-white placeholder-neutral-400 border border-white/15 rounded-2xl focus:outline-none focus:border-emerald-500 focus:bg-white/15 transition-all"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-2xl transition-all shadow-lg shadow-emerald-950 cursor-pointer flex items-center justify-center shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-neutral-500 text-center mt-2">
            Instant insights on agronomy, cold chain, mandis & logistics.
          </p>
        </div>
      </div>
    </div>
  );
};
