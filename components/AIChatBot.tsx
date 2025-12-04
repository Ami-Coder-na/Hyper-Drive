import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { generateVehicleInsight } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatBotProps {
  onClose: () => void;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Greetings. I am the HyperDrive AI. Ask me about vehicle specs, maintenance, or current market trends.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      // Simulate context-aware chat
      const responseText = await generateVehicleInsight('General Query', input);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[500px] bg-theme-card border border-neon-purple/50 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.2)] flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-900 to-indigo-900 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neon-purple rounded-lg shadow-[0_0_10px_#bc13fe]">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white font-display">HyperDrive AI</span>
        </div>
        <button onClick={onClose} className="text-white/70 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-theme-bg/95">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              msg.role === 'user' 
                ? 'bg-neon-blue text-black font-medium rounded-tr-none' 
                : 'bg-theme-surface border border-theme-border text-theme-text rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
           <div className="flex justify-start">
            <div className="bg-theme-surface border border-theme-border p-3 rounded-xl rounded-tl-none flex gap-1 items-center">
              <div className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-1.5 h-1.5 bg-theme-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-theme-card border-t border-theme-border">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI..."
            className="flex-1 bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-theme-text text-sm focus:outline-none focus:border-neon-purple placeholder:text-theme-muted"
          />
          <button 
            type="submit"
            className="p-2 bg-neon-purple hover:bg-fuchsia-500 rounded-lg text-white transition-colors disabled:opacity-50"
            disabled={!input.trim() || isTyping}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIChatBot;