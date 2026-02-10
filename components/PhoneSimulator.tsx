import React, { useState, useEffect, useRef } from 'react';
import { Send, Shield, AlertTriangle, CheckCircle, Smartphone, Wifi } from 'lucide-react';
import { ChatMessage, RiskAnalysis, Sender } from '../types';
//import { createChatSession, analyzeConversationRisk } from '../services/geminiService';
import { INITIAL_GREETING } from '../constants';
//import { sendToLocalhost } from '../services/apiService';
import { sendChatMessage } from '../services/chatApi';

const PhoneSimulator: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [risk, setRisk] = useState<RiskAnalysis>({ score: 0, label: 'SAFE', reasoning: 'Monitoring...' })
  
  // Use a ref for the scroll container instead of an element at the bottom
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef(`call-${Math.random().toString(36).substr(2, 9)}`);
  const isFirstRender = useRef(true);

  // Initialize Chat
useEffect(() => {
  setMessages([{
    id: 'init',
    sender: 'bot',
    text: INITIAL_GREETING,
    timestamp: new Date()
  }]);
}, []);

  // Auto-scroll logic that doesn't scroll the main window
  useEffect(() => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScroll = scrollHeight - clientHeight;
      
      if (maxScroll > 0) {
        if (isFirstRender.current) {
          // Instant jump on first render to avoid visual jitter
          scrollContainerRef.current.scrollTop = maxScroll;
          isFirstRender.current = false;
        } else {
          // Smooth scroll for updates
          scrollContainerRef.current.scrollTo({
            top: maxScroll,
            behavior: 'smooth'
          });
        }
      }
    }
  }, [messages]);

  // Risk Check Effect

const handleSend = async () => {
  if (!input.trim()) return;

  const userMsg: ChatMessage = {
    id: Date.now().toString(),
    sender: 'user',
    text: input,
    timestamp: new Date()
  };

  setMessages(prev => [...prev, userMsg]);
  setInput('');
  setIsLoading(true);

  try {
    const result = await sendChatMessage(
      userMsg.text,
      conversationId.current
    );

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      sender: 'bot',
      text: result.response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);

    // Optional: reflect backend fraud score in UI
    if (typeof result.fraud_confidence === 'number') {
      setRisk({
        score: Math.round(result.fraud_confidence * 100),
        label:
          result.fraud_confidence > 0.85
            ? "SCAM"
            : result.fraud_confidence > 0.5
            ? "SUSPICIOUS"
            : "SAFE",
        reasoning: "Server-side fraud model"
      });
    }

  } catch (err) {
    console.error(err);
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender: 'bot',
      text: "(Backend unavailable. Please try again.)",
      timestamp: new Date()
    }]);
  } finally {
    setIsLoading(false);
  }
};

  const getHeaderColor = () => {
    switch (risk.label) {
      case 'SCAM': return 'bg-red-600';
      case 'SUSPICIOUS': return 'bg-orange-500';
      default: return 'bg-emerald-600';
    }
  };

  const getStatusIcon = () => {
    switch (risk.label) {
      case 'SCAM': return <AlertTriangle size={20} className="text-white animate-pulse" />;
      case 'SUSPICIOUS': return <Shield size={20} className="text-white" />;
      default: return <CheckCircle size={20} className="text-white" />;
    }
  };

  return (
    <div className="relative mx-auto border-slate-800 bg-slate-900 border-[8px] rounded-[2.5rem] h-[650px] w-[350px] shadow-2xl flex flex-col overflow-hidden">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-xl w-32 mx-auto z-20"></div>

      {/* Dynamic Header */}
      <div className={`h-24 ${getHeaderColor()} transition-colors duration-700 p-4 pt-8 flex items-center justify-between shadow-lg z-10 relative`}>
        <div>
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            CallSentry
          </h2>
          <p className="text-white/80 text-xs font-mono">{risk.label} • RISK: {risk.score}%</p>
        </div>
        <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
          {getStatusIcon()}
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 bg-slate-50 overflow-y-auto p-4 space-y-4"
      >
        <div className="text-center text-xs text-slate-400 my-4">
          Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-primary text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-slate-100 flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Roleplay as caller..."
            className="flex-1 bg-slate-100 text-slate-900 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 inset-x-0 mx-auto w-32 h-1 bg-slate-300 rounded-full"></div>
    </div>
  );
};

export default PhoneSimulator;