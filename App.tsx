
import React, { useState, useEffect, useRef } from 'react';
import { Home, ShoppingBag, User as UserIcon, Hexagon, Bot, Heart, MapPin, Zap, Bell, Settings as SettingsIcon, LogOut, Gavel, Sun, Moon, Plus, Search, MessageSquareText, Check, X, ChevronRight, Megaphone, ArrowRight, ExternalLink } from 'lucide-react';
import Marketplace from './components/Marketplace';
import Feed from './components/Feed';
import VehicleDetail from './components/VehicleDetail';
import AIChatBot from './components/AIChatBot';
import Settings from './components/Settings';
import CreateListing from './components/CreateListing';
import Inbox from './components/Inbox';
import NotificationsPage from './components/NotificationsPage';
import Profile from './components/Profile';
import { ViewState, Vehicle, User } from './types';
import { MOCK_USER, VEHICLES as INITIAL_VEHICLES } from './constants';
import { analyzeMarketTrends } from './services/geminiService';

const SidebarItem = ({ icon, label, active, onClick, badge }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
      active 
        ? 'bg-gradient-to-r from-neon-blue/10 to-transparent text-neon-blue' 
        : 'text-theme-muted hover:text-theme-text hover:bg-theme-surface'
    }`}
  >
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue rounded-full" />}
    <div className={`relative z-10 p-1 rounded-lg transition-transform group-hover:scale-110 ${active ? 'bg-neon-blue/20' : ''}`}>
      {React.cloneElement(icon, {
        className: `w-5 h-5 ${active ? 'text-neon-blue' : 'text-theme-muted group-hover:text-theme-text'} transition-colors`
      })}
    </div>
    <span className={`font-medium text-sm tracking-wide z-10 ${active ? 'font-bold' : ''}`}>{label}</span>
    {badge && (
      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-neon-purple/20 text-neon-purple border border-neon-purple/20 shadow-[0_0_10px_rgba(188,19,254,0.3)]">
        {badge}
      </span>
    )}
  </button>
);

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.FEED);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [marketTicker, setMarketTicker] = useState<string>("Initializing secure connection...");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [isDark, setIsDark] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [following, setFollowing] = useState<Set<string>>(new Set());

  // Header Interactions State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessagesMenu, setShowMessagesMenu] = useState(false);

  // Refs for click outside
  const notificationRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    analyzeMarketTrends().then(setMarketTicker);

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (messageRef.current && !messageRef.current.contains(event.target as Node)) {
        setShowMessagesMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setView(ViewState.VEHICLE_DETAIL);
  };

  const toggleWishlist = (id: string) => {
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  
  const toggleFollow = (userId: string) => {
      setFollowing(prev => {
          const next = new Set(prev);
          if (next.has(userId)) next.delete(userId);
          else next.add(userId);
          return next;
      });
  };

  const handleCreateListing = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    setView(ViewState.MARKETPLACE);
  };

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    if (confirm("Terminating session. Confirm disconnect?")) {
        setView(ViewState.FEED);
    }
  };

  // Mock Data for Dropdowns
  const NOTIFICATIONS = [
    { id: 1, text: "Tesla Cybertruck price dropped by 5%", time: "10m", type: "alert", read: false },
    { id: 2, text: "@driftking_alex liked your post", time: "1h", type: "social", read: true },
    { id: 3, text: "Auction for R1M ending in 30 mins", time: "2h", type: "urgent", read: false },
  ];

  const DIRECT_MESSAGES = [
    { id: 1, user: "Sarah Connor", text: "Is the flux capacitor still available?", time: "5m", unread: 2, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100" },
    { id: 2, user: "SpeedDemon", text: "Let's race tonight.", time: "1h", unread: 0, avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100" },
    { id: 3, user: "EuroImports", text: "Order shipped.", time: "1d", unread: 0, avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100" },
  ];

  const renderContent = () => {
    switch (view) {
      case ViewState.FEED: return <Feed following={following} onToggleFollow={toggleFollow} />;
      case ViewState.MARKETPLACE:
        return <Marketplace vehicles={vehicles} onSelectVehicle={handleVehicleSelect} wishlist={wishlist} onToggleWishlist={toggleWishlist} />;
      case ViewState.VEHICLE_DETAIL:
        return selectedVehicle ? (
          <VehicleDetail 
            vehicle={selectedVehicle} 
            onBack={() => setView(ViewState.MARKETPLACE)}
            isWishlisted={wishlist.has(selectedVehicle.id)}
            onToggleWishlist={() => toggleWishlist(selectedVehicle.id)}
          />
        ) : <Marketplace vehicles={vehicles} onSelectVehicle={handleVehicleSelect} wishlist={wishlist} onToggleWishlist={toggleWishlist} />;
      case ViewState.SETTINGS:
        return <Settings user={MOCK_USER} isDark={isDark} toggleTheme={toggleTheme} onLogout={handleLogout} />;
      case ViewState.CREATE_LISTING:
        return <CreateListing onCancel={() => setView(ViewState.MARKETPLACE)} onSubmit={handleCreateListing} user={MOCK_USER} />;
      case ViewState.MESSAGES:
        return <Inbox currentUser={MOCK_USER} onBack={() => setView(ViewState.FEED)} />;
      case ViewState.NOTIFICATIONS:
        return <NotificationsPage onBack={() => setView(ViewState.FEED)} />;
      case ViewState.PROFILE:
        return (
          <Profile 
            user={MOCK_USER} 
            currentUser={MOCK_USER}
            vehicles={vehicles}
            wishlist={wishlist}
            onSelectVehicle={handleVehicleSelect}
            onToggleWishlist={toggleWishlist}
            onCreateListing={() => setView(ViewState.CREATE_LISTING)}
          />
        );
      default: return <Feed following={following} onToggleFollow={toggleFollow} />;
    }
  };

  return (
    <div className={`${isDark ? 'dark' : ''} h-full overflow-hidden`}>
      <div className="flex h-screen bg-theme-bg text-theme-text selection:bg-neon-blue selection:text-black font-sans transition-colors duration-500">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-72 p-6 fixed h-full z-50">
          <div className="glass rounded-3xl h-full flex flex-col p-4 shadow-2xl">
            {/* Logo */}
            <div className="px-4 py-4 flex items-center gap-3 mb-6 cursor-pointer" onClick={() => setView(ViewState.FEED)}>
               <div className="relative">
                 <Hexagon className="w-10 h-10 text-neon-blue fill-neon-blue/10" strokeWidth={1.5} />
                 <div className="absolute inset-0 animate-pulse-slow bg-neon-blue/20 blur-xl rounded-full" />
               </div>
               <div>
                 <h1 className="text-2xl font-display font-bold tracking-widest leading-none">
                   HYPER<span className="text-neon-blue">DRIVE</span>
                 </h1>
                 <span className="text-[10px] text-theme-muted tracking-[0.2em] font-bold block ml-0.5">MARKETPLACE</span>
               </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
              <div className="px-4 py-2 text-xs font-bold text-theme-muted/50 tracking-widest mt-2 mb-1">DISCOVER</div>
              <SidebarItem icon={<Home />} label="Feed" active={view === ViewState.FEED} onClick={() => setView(ViewState.FEED)} />
              <SidebarItem icon={<ShoppingBag />} label="Market" active={view === ViewState.MARKETPLACE || view === ViewState.VEHICLE_DETAIL} onClick={() => setView(ViewState.MARKETPLACE)} />
              
              <div className="px-4 py-2 text-xs font-bold text-theme-muted/50 tracking-widest mt-6 mb-1">PERSONAL</div>
              <SidebarItem icon={<UserIcon />} label="Profile" active={view === ViewState.PROFILE} onClick={() => setView(ViewState.PROFILE)} />
              <SidebarItem icon={<MessageSquareText />} label="Inbox" active={view === ViewState.MESSAGES} onClick={() => setView(ViewState.MESSAGES)} />
              <SidebarItem icon={<Bell />} label="Activity" active={view === ViewState.NOTIFICATIONS} onClick={() => setView(ViewState.NOTIFICATIONS)} />
              
              <div className="px-4 py-2 text-xs font-bold text-theme-muted/50 tracking-widest mt-6 mb-1">SYSTEM</div>
              <SidebarItem icon={<SettingsIcon />} label="Settings" active={view === ViewState.SETTINGS} onClick={() => setView(ViewState.SETTINGS)} />
            </nav>

            {/* Bottom Actions */}
            <div className="pt-4 mt-2 border-t border-theme-border space-y-3">
              <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-theme-surface hover:bg-theme-bg border border-theme-border transition-all"
              >
                <div className="flex items-center gap-3">
                  {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                  <span className="text-sm font-medium">Theme</span>
                </div>
                <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`}>
                  <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${isDark ? 'translate-x-4' : ''}`} />
                </div>
              </button>
              
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-theme-surface/50 transition-colors cursor-pointer group" onClick={() => setView(ViewState.PROFILE)}>
                <img src={MOCK_USER.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-theme-border group-hover:border-neon-blue transition-colors" />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold truncate text-theme-text group-hover:text-neon-blue transition-colors">{MOCK_USER.name}</p>
                  <p className="text-xs text-theme-muted truncate">{MOCK_USER.handle}</p>
                </div>
                <LogOut className="w-4 h-4 text-theme-muted ml-auto hover:text-red-400" onClick={(e) => { e.stopPropagation(); handleLogout(); }} />
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col md:pl-80 h-full">
          
          {/* Header */}
          <header className="sticky top-0 z-40 px-4 md:px-8 py-4 pointer-events-none">
            <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-lg pointer-events-auto">
              
              {/* Mobile Menu Trigger */}
              <div className="md:hidden flex items-center gap-2 cursor-pointer" onClick={() => setView(ViewState.FEED)}>
                <Hexagon className="w-6 h-6 text-neon-blue" />
                <span className="font-display font-bold">HYPERDRIVE</span>
              </div>

              {/* Announcement Banner */}
              <div className={`hidden md:flex items-center justify-center flex-1 px-4 transition-all duration-300 ${isSearchOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
                  <div className="bg-theme-surface/80 backdrop-blur-md border border-neon-green/30 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-[0_0_15px_rgba(10,255,104,0.1)] max-w-lg w-full relative overflow-hidden group hover:border-neon-green/60 transition-colors cursor-default">
                      <div className="shrink-0 flex items-center gap-2 pr-3 border-r border-theme-border/50">
                          <Megaphone className="w-4 h-4 text-neon-green animate-pulse" />
                          <span className="text-[10px] font-bold text-neon-green tracking-wider uppercase">System</span>
                      </div>
                      <div className="flex-1 overflow-hidden">
                           <p className="text-xs text-theme-text font-medium truncate group-hover:whitespace-normal transition-all">
                              {marketTicker}
                           </p>
                      </div>
                  </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-2 md:gap-4 ml-auto">
                
                {/* Search */}
                <div className={`flex items-center bg-theme-surface/50 rounded-full transition-all duration-300 relative ${isSearchOpen ? 'w-48 pl-3 pr-2 py-1.5 border border-theme-border bg-theme-card' : 'w-8 h-8 justify-center bg-transparent'}`}>
                    {isSearchOpen ? (
                        <Search className="w-4 h-4 text-theme-muted shrink-0" />
                    ) : (
                        <Search 
                            onClick={() => { setIsSearchOpen(true); }}
                            className="w-5 h-5 text-theme-muted hover:text-theme-text cursor-pointer transition-colors" 
                        />
                    )}
                    
                    {isSearchOpen && (
                        <>
                            <input 
                                autoFocus
                                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-theme-text placeholder:text-theme-muted/50"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={() => !searchQuery && setIsSearchOpen(false)}
                            />
                            <button onClick={() => setIsSearchOpen(false)} className="p-0.5 hover:bg-theme-surface rounded-full">
                                <X className="w-3 h-3 text-theme-muted" />
                            </button>
                        </>
                    )}
                </div>

                {/* Messages Dropdown */}
                <div className="relative" ref={messageRef}>
                   <button 
                      onClick={() => { setShowMessagesMenu(!showMessagesMenu); setShowNotifications(false); }}
                      className={`relative p-1.5 rounded-full transition-colors ${showMessagesMenu || view === ViewState.MESSAGES ? 'bg-theme-card text-neon-blue' : 'text-theme-muted hover:text-theme-text'}`}
                   >
                      <MessageSquareText className="w-5 h-5" />
                      <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-neon-blue rounded-full border border-theme-bg" />
                   </button>

                   {/* Modern Dropdown */}
                   {showMessagesMenu && (
                      <div className="absolute top-full right-0 mt-4 w-96 bg-theme-card border border-theme-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right ring-1 ring-white/5">
                          <div className="p-4 border-b border-theme-border bg-theme-surface/50 backdrop-blur-md flex justify-between items-center">
                             <h3 className="font-display font-bold text-sm text-theme-text tracking-wide">MESSAGES</h3>
                             <button className="text-xs font-bold text-neon-blue hover:text-white bg-neon-blue/10 hover:bg-neon-blue px-2 py-1 rounded transition-colors">
                                + New
                             </button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                              {DIRECT_MESSAGES.map((msg) => (
                                  <div key={msg.id} className="p-4 hover:bg-white/5 cursor-pointer flex gap-4 transition-colors border-b border-theme-border/30 last:border-0 group relative">
                                      {msg.unread > 0 && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-blue" />}
                                      <div className="relative shrink-0">
                                         <img src={msg.avatar} className="w-12 h-12 rounded-full object-cover border border-theme-border group-hover:border-neon-blue transition-colors" alt="avatar" />
                                         <div className="absolute bottom-0 right-0 w-3 h-3 bg-neon-green rounded-full border-2 border-theme-card" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className="flex justify-between items-baseline mb-0.5">
                                              <span className={`text-sm truncate ${msg.unread > 0 ? 'font-bold text-white' : 'font-medium text-theme-text'}`}>{msg.user}</span>
                                              <span className="text-[10px] text-theme-muted">{msg.time} ago</span>
                                          </div>
                                          <p className={`text-xs truncate ${msg.unread > 0 ? 'text-theme-text font-medium' : 'text-theme-muted'}`}>
                                              {msg.text}
                                          </p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <button 
                            onClick={() => { setView(ViewState.MESSAGES); setShowMessagesMenu(false); }}
                            className="w-full p-3 text-xs font-bold text-theme-muted hover:text-theme-text hover:bg-theme-surface transition-colors flex items-center justify-center gap-2 border-t border-theme-border"
                          >
                              Open Inbox <ArrowRight className="w-3 h-3" />
                          </button>
                      </div>
                   )}
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notificationRef}>
                  <button 
                     onClick={() => { setShowNotifications(!showNotifications); setShowMessagesMenu(false); }}
                     className={`relative p-1.5 rounded-full transition-colors ${showNotifications || view === ViewState.NOTIFICATIONS ? 'bg-theme-surface text-neon-pink' : 'text-theme-muted hover:text-theme-text'}`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-neon-pink rounded-full border border-theme-bg animate-pulse" />
                  </button>

                  {/* Modern Dropdown */}
                  {showNotifications && (
                      <div className="absolute top-full right-0 mt-4 w-80 bg-theme-card border border-theme-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 origin-top-right ring-1 ring-white/5">
                          <div className="p-4 border-b border-theme-border bg-theme-surface/50 backdrop-blur-md flex justify-between items-center">
                             <h3 className="font-display font-bold text-sm text-theme-text tracking-wide">ACTIVITY</h3>
                             <button className="text-xs text-theme-muted hover:text-theme-text transition-colors">Mark all read</button>
                          </div>
                          <div className="max-h-[300px] overflow-y-auto">
                              {NOTIFICATIONS.map((notif) => (
                                  <div key={notif.id} className="p-4 hover:bg-white/5 cursor-pointer flex gap-3 transition-colors border-b border-theme-border/30 last:border-0 relative group">
                                      <div className={`mt-1 p-2 rounded-xl h-fit shrink-0 ${
                                          notif.type === 'alert' ? 'bg-neon-pink/10 text-neon-pink' : 
                                          notif.type === 'urgent' ? 'bg-red-500/10 text-red-500' : 'bg-neon-blue/10 text-neon-blue'
                                      }`}>
                                          {notif.type === 'alert' ? <Zap className="w-4 h-4" /> : notif.type === 'urgent' ? <Gavel className="w-4 h-4" /> : <Heart className="w-4 h-4" />}
                                      </div>
                                      <div className="flex-1">
                                          <p className={`text-xs leading-relaxed ${!notif.read ? 'font-bold text-theme-text' : 'text-theme-muted'}`}>
                                              {notif.text}
                                          </p>
                                          <span className="text-[10px] text-theme-muted/60 mt-1 block">{notif.time} ago</span>
                                      </div>
                                      {!notif.read && <div className="absolute right-3 top-4 w-1.5 h-1.5 rounded-full bg-neon-pink shadow-[0_0_5px_rgba(255,0,153,0.5)]" />}
                                  </div>
                              ))}
                          </div>
                          <button 
                             onClick={() => { setView(ViewState.NOTIFICATIONS); setShowNotifications(false); }}
                             className="w-full p-3 text-xs font-bold text-theme-muted hover:text-theme-text hover:bg-theme-surface transition-colors flex items-center justify-center gap-2 border-t border-theme-border"
                          >
                              View All Activity <ExternalLink className="w-3 h-3" />
                          </button>
                      </div>
                   )}
                </div>

                <button 
                  onClick={() => setView(ViewState.CREATE_LISTING)}
                  className="hidden md:flex items-center gap-2 bg-neon-blue hover:bg-cyan-400 text-black px-4 py-1.5 rounded-full font-bold text-sm transition-all shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Listing</span>
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Main */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-0 scroll-smooth">
             {renderContent()}
          </main>
        </div>

        {/* Global Floating Elements */}
        
        {/* Mobile Create Button */}
        <button 
          onClick={() => setView(ViewState.CREATE_LISTING)}
          className="md:hidden fixed bottom-24 right-4 bg-neon-blue text-black p-4 rounded-full shadow-lg z-50 transition-transform active:scale-95"
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* AI Assistant - Only visible on FEED */}
        {view === ViewState.FEED && (
          <>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`fixed bottom-24 md:bottom-8 right-4 md:right-8 p-4 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.4)] z-50 transition-all hover:scale-105 active:scale-95 group flex items-center gap-2 ${
                showChat 
                  ? 'bg-theme-card border border-theme-border text-theme-text' 
                  : 'bg-gradient-to-r from-neon-purple to-fuchsia-600 text-white hover:rotate-3'
              }`}
            >
              {showChat ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6 group-hover:animate-bounce" />}
              <span className="hidden md:inline font-bold pr-1">{showChat ? 'Close' : 'AI Chat'}</span>
            </button>
            {showChat && <AIChatBot onClose={() => setShowChat(false)} />}
          </>
        )}

        {/* Mobile Nav Bar */}
        <div className="md:hidden fixed bottom-0 w-full glass border-t-0 z-50 pb-safe">
          <div className="flex justify-between items-center px-8 py-4">
            <button onClick={() => setView(ViewState.FEED)} className={view === ViewState.FEED ? 'text-neon-blue' : 'text-theme-muted'}>
              <Home className="w-6 h-6" />
            </button>
            <button onClick={() => setView(ViewState.MARKETPLACE)} className={view === ViewState.MARKETPLACE ? 'text-neon-blue' : 'text-theme-muted'}>
              <ShoppingBag className="w-6 h-6" />
            </button>
            <div className="w-px h-8 bg-theme-border" />
            <button onClick={() => setView(ViewState.PROFILE)} className={view === ViewState.PROFILE ? 'text-neon-blue' : 'text-theme-muted'}>
              <UserIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setView(ViewState.SETTINGS)} className={view === ViewState.SETTINGS ? 'text-neon-blue' : 'text-theme-muted'}>
              <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
