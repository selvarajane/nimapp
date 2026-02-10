import React, { useState, useRef, useEffect } from 'react';
import { SparklesIcon } from './Icons';
import { suggestGroceries } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm your Grocery Genie. Need help finding daily essentials, fresh produce, or planning a meal? Just ask!" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    const suggestion = await suggestGroceries(userText);
    
    setMessages(prev => [...prev, { role: 'ai', text: suggestion }]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      <div className="bg-gradient-to-r from-brand to-brand-dark p-4 text-white flex gap-3 items-center shadow-sm sticky top-0 z-20">
        <SparklesIcon className="w-6 h-6 text-yellow-200" />
        <div>
          <h2 className="font-bold text-lg leading-tight">Grocery Genie</h2>
          <p className="text-[10px] uppercase tracking-wider opacity-90 font-bold">AI Recommendations</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3.5 rounded-2xl ${
              msg.role === 'user' 
                ? 'bg-brand text-white rounded-tr-sm' 
                : 'bg-white border border-gray-100 shadow-sm text-gray-800 rounded-tl-sm'
            }`}>
              <p className="text-sm leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm p-3.5 rounded-2xl rounded-tl-sm flex gap-1.5 items-center h-12">
              <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-brand/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-200 flex gap-2 sticky bottom-0 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="I need ingredients for a cake..."
          className="flex-1 border border-gray-200 bg-gray-50 rounded-full px-4 py-3 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand text-sm"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-brand text-white rounded-full w-12 h-12 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -mr-1">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;