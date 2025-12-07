
import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Send, Paperclip, Smile, Image as ImageIcon, Mic, Check, CheckCheck, ChevronLeft } from 'lucide-react';
import { User } from '../types';

interface InboxProps {
  currentUser: User;
  onBack?: () => void;
}

const Inbox: React.FC<InboxProps> = ({ currentUser, onBack }) => {
  const [activeChat, setActiveChat] = useState<number>(1);
  const [inputText, setInputText] = useState('');

  // Mock Conversations
  const CONVERSATIONS = [
    { 
      id: 1, 
      user: { name: "Sarah Connor", handle: "@skynet_hunter", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100", status: "online" },
      lastMessage: "Is the flux capacitor still available?",
      time: "5m",
      unread: 2,
      history: [
        { id: 'm1', text: "Hey! Saw your listing.", sender: 'them', time: "10:30 AM" },
        { id: 'm2', text: "Is the flux capacitor still available?", sender: 'them', time: "10:32 AM" },
      ]
    },
    { 
      id: 2, 
      user: { name: "SpeedDemon", handle: "@speedy", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100", status: "offline" },
      lastMessage: "Let's race tonight at the neon district.",
      time: "1h",
      unread: 0,
      history: [
        { id: 'm1', text: "Ready for the run?", sender: 'me', time: "Yesterday" },
        { id: 'm2', text: "Let's race tonight at the neon district.", sender: 'them', time: "1:00 PM" },
      ]
    },
    { 
      id: 3, 
      user: { name: "EuroImports", handle: "@euro_parts", avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100", status: "away" },
      lastMessage: "Your order #4492 has shipped.",
      time: "1d",
      unread: 0,
      history: [
        { id: 'm1', text: "Order confirmed.", sender: 'them', time: "Monday" },
        { id: 'm2', text: "Your order #4492 has shipped.", sender: 'them', time: "Yesterday" },
      ]
    },
  ];

  const currentChat = CONVERSATIONS.find(c => c.id === activeChat) || CONVERSATIONS[0];

  const handleSend = () => {
    if(!inputText.trim()) return;
    // In a real app, this would update state/backend
    setInputText("");
  };

  return (
    <div className="h-[calc(100vh-100px)] max-w-7xl mx-auto pb-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="flex h-full bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-2xl">
            
            {/* Sidebar (Chat List) */}
            <div className={`w-full md:w-80 border-r border-theme-border flex flex-col ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b border-theme-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-display font-bold text-theme-text">Messages</h2>
                        <button className="p-2 bg-theme-surface rounded-full text-neon-blue hover:bg-neon-blue/10 transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search chats..." 
                            className="w-full bg-theme-surface border border-theme-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-neon-blue transition-colors"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-muted" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {CONVERSATIONS.map((chat) => (
                        <div 
                            key={chat.id}
                            onClick={() => setActiveChat(chat.id)}
                            className={`p-4 flex gap-3 cursor-pointer transition-all border-b border-theme-border/30 hover:bg-theme-surface/50 ${activeChat === chat.id ? 'bg-theme-surface border-l-2 border-l-neon-blue' : 'border-l-2 border-l-transparent'}`}
                        >
                            <div className="relative shrink-0">
                                <img src={chat.user.avatar} className="w-12 h-12 rounded-full object-cover" alt={chat.user.name} />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-theme-card ${
                                    chat.user.status === 'online' ? 'bg-neon-green' : 
                                    chat.user.status === 'away' ? 'bg-yellow-500' : 'bg-theme-muted'
                                }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-0.5">
                                    <span className={`font-bold text-sm truncate ${activeChat === chat.id ? 'text-theme-text' : 'text-theme-text/80'}`}>{chat.user.name}</span>
                                    <span className="text-[10px] text-theme-muted">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-xs truncate max-w-[140px] ${chat.unread > 0 ? 'text-theme-text font-bold' : 'text-theme-muted'}`}>{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <span className="bg-neon-blue text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col bg-theme-bg/50 backdrop-blur-sm ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Chat Header */}
                <div className="p-4 border-b border-theme-border flex justify-between items-center bg-theme-card/50 backdrop-blur">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChat(0)} className="md:hidden p-2 -ml-2 text-theme-muted">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <div className="relative">
                             <img src={currentChat.user.avatar} className="w-10 h-10 rounded-full" alt="avatar" />
                             {currentChat.user.status === 'online' && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-neon-green rounded-full border border-theme-card" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-theme-text">{currentChat.user.name}</h3>
                            <span className="text-xs text-theme-muted">{currentChat.user.status === 'online' ? 'Active Now' : `@${currentChat.user.handle.replace('@','')}`}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 text-theme-muted hover:text-neon-blue hover:bg-theme-surface rounded-full transition-colors">
                            <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-2.5 text-theme-muted hover:text-neon-blue hover:bg-theme-surface rounded-full transition-colors">
                            <Video className="w-4 h-4" />
                        </button>
                        <div className="w-px h-6 bg-theme-border mx-1" />
                        <button className="p-2.5 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 flex flex-col">
                    <div className="text-center py-4">
                        <span className="text-xs font-bold text-theme-muted/50 uppercase tracking-widest">Encryption Key Verified</span>
                    </div>
                    
                    {currentChat.history.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] md:max-w-[60%] space-y-1 ${msg.sender === 'me' ? 'items-end flex flex-col' : 'items-start flex flex-col'}`}>
                                <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                                    msg.sender === 'me' 
                                    ? 'bg-neon-blue text-black rounded-tr-none shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                                    : 'bg-theme-surface border border-theme-border text-theme-text rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                <div className="flex items-center gap-1 px-1">
                                    <span className="text-[10px] text-theme-muted">{msg.time}</span>
                                    {msg.sender === 'me' && <CheckCheck className="w-3 h-3 text-neon-blue" />}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-theme-card border-t border-theme-border">
                    <div className="flex items-end gap-2 bg-theme-surface rounded-3xl p-2 border border-theme-border focus-within:border-neon-blue/50 transition-colors">
                        <div className="flex pb-2 pl-2">
                             <button className="p-2 text-theme-muted hover:text-neon-blue hover:bg-theme-bg rounded-full transition-colors">
                                <ImageIcon className="w-5 h-5" />
                             </button>
                             <button className="p-2 text-theme-muted hover:text-neon-blue hover:bg-theme-bg rounded-full transition-colors">
                                <Paperclip className="w-5 h-5" />
                             </button>
                        </div>
                        <div className="flex-1 min-w-0">
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type a message..."
                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-theme-text placeholder:text-theme-muted resize-none max-h-32 py-3"
                                rows={1}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex pb-2 pr-2">
                             {!inputText ? (
                                <button className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-bg rounded-full transition-colors">
                                    <Mic className="w-5 h-5" />
                                </button>
                             ) : (
                                <button 
                                    onClick={handleSend}
                                    className="p-2 bg-neon-blue text-black rounded-full hover:scale-105 transition-transform shadow-[0_0_10px_rgba(0,243,255,0.4)]"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                             )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default Inbox;
