
import React, { useState, useRef, useEffect } from 'react';
import { solveWordProblem } from '../services/geminiService';
import { AssistantMessage } from '../types';

const GeminiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    { 
      id: '1', 
      role: 'assistant', 
      content: "Hello! I'm your Lumina math assistant. Need help with a complex word problem or a mathematical concept? Just ask!" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: AssistantMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputValue,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const result = await solveWordProblem(inputValue);
      const aiMsg: AssistantMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: result,
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I ran into an error processing that. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 custom-scrollbar"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white/10 text-slate-200 rounded-bl-none border border-white/5'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your math problem..."
          className="w-full bg-slate-900/50 border border-white/10 rounded-2xl p-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none h-24 transition-all"
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !inputValue.trim()}
          className={`absolute bottom-4 right-4 p-2 rounded-xl transition-all ${
            isLoading || !inputValue.trim() 
              ? 'bg-slate-800 text-slate-600' 
              : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
      <p className="text-[10px] text-slate-600 mt-2 text-center uppercase tracking-widest font-semibold">
        Powered by Gemini AI
      </p>
    </div>
  );
};

export default GeminiAssistant;
