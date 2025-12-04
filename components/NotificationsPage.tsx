import React from 'react';
import { Bell, Heart, Gavel, DollarSign, MessageCircle, ChevronLeft, Check, Trash2, Zap, Settings as SettingsIcon } from 'lucide-react';

interface NotificationsPageProps {
  onBack?: () => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack }) => {
  const ACTIVITIES = [
    { id: 1, type: 'price', title: 'Price Drop Alert', desc: 'The Tesla Cybertruck you are watching dropped by 5%', time: '10 min ago', read: false },
    { id: 2, type: 'auction', title: 'Auction Ending', desc: 'Auction for Yamaha R1M ends in 30 minutes.', time: '2 hours ago', read: false },
    { id: 3, type: 'social', title: 'New Like', desc: '@driftking_alex liked your post "Night Ride".', time: '5 hours ago', read: true },
    { id: 4, type: 'social', title: 'New Comment', desc: '@sarah_connor commented: "Absolute beast of a machine!"', time: '1 day ago', read: true },
    { id: 5, type: 'system', title: 'System Update', desc: 'Marketplace fees updated for Q4.', time: '2 days ago', read: true },
  ];

  const getIcon = (type: string) => {
    switch(type) {
        case 'price': return <DollarSign className="w-5 h-5 text-neon-green" />;
        case 'auction': return <Gavel className="w-5 h-5 text-red-500" />;
        case 'social': return <Heart className="w-5 h-5 text-neon-pink" />;
        case 'system': return <Zap className="w-5 h-5 text-neon-blue" />;
        default: return <Bell className="w-5 h-5 text-theme-muted" />;
    }
  };

  const getBgColor = (type: string) => {
    switch(type) {
        case 'price': return 'bg-neon-green/10';
        case 'auction': return 'bg-red-500/10';
        case 'social': return 'bg-neon-pink/10';
        case 'system': return 'bg-neon-blue/10';
        default: return 'bg-theme-surface';
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 px-4">
        
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
                {onBack && (
                    <button onClick={onBack} className="p-2 hover:bg-theme-surface rounded-full text-theme-muted">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}
                <div>
                    <h1 className="text-3xl font-display font-bold text-theme-text">Activity</h1>
                    <p className="text-theme-muted text-sm">Stay updated with your network and market</p>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-text bg-theme-card border border-theme-border rounded-lg hover:bg-theme-surface transition-colors flex items-center gap-2">
                    <Check className="w-3 h-3" /> Mark all read
                </button>
                <button className="px-4 py-2 text-xs font-bold text-theme-muted hover:text-theme-text bg-theme-card border border-theme-border rounded-lg hover:bg-theme-surface transition-colors">
                    <SettingsIcon className="w-3 h-3" />
                </button>
            </div>
        </div>

        <div className="space-y-6">
            
            {/* Today Section */}
            <div>
                <h3 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-4 ml-2">Today</h3>
                <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-sm">
                    {ACTIVITIES.slice(0, 2).map((item) => (
                        <div key={item.id} className={`p-5 flex gap-4 border-b border-theme-border last:border-0 hover:bg-theme-surface/30 transition-colors relative group cursor-pointer ${!item.read ? 'bg-theme-surface/10' : ''}`}>
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className={`text-sm ${!item.read ? 'font-bold text-theme-text' : 'font-medium text-theme-text/80'}`}>{item.title}</h4>
                                    <span className="text-xs text-theme-muted">{item.time}</span>
                                </div>
                                <p className="text-sm text-theme-muted mt-0.5">{item.desc}</p>
                            </div>
                            {!item.read && (
                                <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 rounded-full bg-neon-blue" />
                            )}
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-theme-muted hover:text-red-500 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Earlier Section */}
            <div>
                <h3 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-4 ml-2">Earlier</h3>
                <div className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-sm">
                    {ACTIVITIES.slice(2).map((item) => (
                        <div key={item.id} className="p-5 flex gap-4 border-b border-theme-border last:border-0 hover:bg-theme-surface/30 transition-colors relative group cursor-pointer">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getBgColor(item.type)}`}>
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="text-sm font-medium text-theme-text/80">{item.title}</h4>
                                    <span className="text-xs text-theme-muted">{item.time}</span>
                                </div>
                                <p className="text-sm text-theme-muted mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </div>
  );
};

export default NotificationsPage;