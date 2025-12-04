import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageSquare, Sparkles, Cpu, Paperclip } from 'lucide-react';
import { generateVehicleInsight } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatBotProps {
  onClose: () => void;
}

const AIChatBot: React.FC<AIChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: 'Neural Link established. I am HyperDrive AI. How can I assist with your vehicle diagnostics or market analysis today?', timestamp: new Date() }
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
      // Fallback message
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'model',
          text: "Connection interrupted. Realigning satellite array...",
          timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 w-[90vw] md:w-96 h-[600px] max-h-[70vh] flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Glow Effects */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl rounded-3xl border border-neon-blue/30 shadow-[0_0_50px_rgba(0,243,255,0.15)] overflow-hidden">
         {/* Grid Background */}
         <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      </div>

      {/* Header */}
      <div className="relative z-10 px-5 py-4 flex justify-between items-center border-b border-white/10 bg-gradient-to-r from-neon-blue/10 to-transparent rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2 bg-gradient-to-tr from-neon-blue to-blue-600 rounded-xl shadow-lg shadow-neon-blue/20">
                <Cpu className="w-5 h-5 text-white animate-pulse-slow" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-white/20">
                <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
            </div>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-none tracking-wide">HYPER<span className="text-neon-blue">CHAT</span></h3>
            <div className="flex items-center gap-1.5 mt-1">
                <Sparkles className="w-3 h-3 text-neon-purple" />
                <span className="text-[10px] font-mono text-neon-blue/80">ONLINE // V2.5</span>
            </div>
          </div>
        </div>
        <button 
            onClick={onClose} 
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="relative z-10 flex-1 overflow-y-auto p-5 space-y-6 scroll-smooth custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                msg.role === 'user' 
                ? 'bg-neon-purple/20 border-neon-purple/50' 
                : 'bg-neon-blue/20 border-neon-blue/50'
            }`}>
                {msg.role === 'user' ? <MessageSquare className="w-4 h-4 text-neon-purple" /> : <Bot className="w-4 h-4 text-neon-blue" />}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed backdrop-blur-md shadow-sm ${
                msg.role === 'user' 
                    ? 'bg-gradient-to-br from-neon-purple/20 to-fuchsia-600/20 border border-neon-purple/30 text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                {msg.text}
                </div>
                <span className="text-[10px] text-white/30 mt-1 px-1 font-mono">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
            </div>
          </div>
        ))}
        
        {isTyping && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-neon-blue/20 border border-neon-blue/50 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-neon-blue" />
             </div>
             <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1 items-center w-16">
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-4 bg-black/40 border-t border-white/10 rounded-b-3xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative flex items-center gap-2"
        >
          <button type="button" className="p-2 text-white/50 hover:text-neon-blue transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Transmitting message..."
                className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-neon-blue/50 rounded-full pl-4 pr-12 py-3 text-white text-sm focus:outline-none transition-all placeholder:text-white/20"
            />
            <div className="absolute right-1 top-1 bottom-1">
                <button 
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="h-full aspect-square bg-neon-blue hover:bg-cyan-400 text-black rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(0,243,255,0.3)]"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatBot;