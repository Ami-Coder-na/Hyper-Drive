import React, { useState, useEffect } from 'react';
import { Home, ShoppingBag, User as UserIcon, Hexagon, Bot, Heart, MapPin, Zap, Bell, Settings as SettingsIcon, LogOut, Gavel, Sun, Moon, Plus, Search, MessageCircle } from 'lucide-react';
import Marketplace from './components/Marketplace';
import Feed from './components/Feed';
import VehicleDetail from './components/VehicleDetail';
import AIChatBot from './components/AIChatBot';
import Settings from './components/Settings';
import CreateListing from './components/CreateListing';
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

  useEffect(() => {
    analyzeMarketTrends().then(setMarketTicker);
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

  const handleCreateListing = (newVehicle: Vehicle) => {
    setVehicles(prev => [newVehicle, ...prev]);
    setView(ViewState.MARKETPLACE);
    // Optional: Show success notification logic here
  };

  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    if (confirm("Terminating session. Confirm disconnect?")) {
        setView(ViewState.FEED);
    }
  };

  const renderContent = () => {
    switch (view) {
      case ViewState.FEED: return <Feed />;
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
      case ViewState.PROFILE:
        const wishlistedVehicles = vehicles.filter(v => wishlist.has(v.id));
        return (
          <div className="space-y-8 pb-24 max-w-5xl mx-auto animate-slide-up">
            <div className="glass rounded-3xl p-8 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-32 bg-neon-blue/5 rounded-full blur-3xl group-hover:bg-neon-blue/10 transition-colors" />
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                 <div className="relative">
                   <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-neon-blue to-neon-purple shadow-[0_0_30px_rgba(0,243,255,0.3)]">
                     <img src={MOCK_USER.avatar} className="w-full h-full rounded-full object-cover border-4 border-theme-bg" alt="Profile" />
                   </div>
                   <div className="absolute -bottom-2 -right-2 bg-theme-card p-1.5 rounded-full border border-theme-border">
                     <div className="bg-neon-green w-4 h-4 rounded-full animate-pulse shadow-[0_0_10px_#0aff68]" />
                   </div>
                 </div>
                 <div className="text-center md:text-left">
                   <h2 className="text-4xl font-display font-bold text-theme-text mb-2">{MOCK_USER.name}</h2>
                   <p className="font-mono text-neon-blue mb-4 tracking-wider">{MOCK_USER.handle}</p>
                   <div className="flex gap-8 justify-center md:justify-start">
                     <div className="text-center">
                       <span className="block text-2xl font-bold text-theme-text">{wishlistedVehicles.length}</span>
                       <span className="text-xs font-bold text-theme-muted tracking-widest">SAVED</span>
                     </div>
                     <div className="text-center">
                       <span className="block text-2xl font-bold text-theme-text">12</span>
                       <span className="text-xs font-bold text-theme-muted tracking-widest">POSTS</span>
                     </div>
                     <div className="text-center">
                       <span className="block text-2xl font-bold text-theme-text">4.9</span>
                       <span className="text-xs font-bold text-theme-muted tracking-widest">RATING</span>
                     </div>
                   </div>
                 </div>
                 <div className="md:ml-auto">
                    <button className="px-6 py-3 bg-theme-surface border border-theme-border rounded-xl font-bold text-theme-text hover:border-neon-purple transition-all shadow-sm">
                      Edit Profile
                    </button>
                 </div>
               </div>
            </div>

            <div>
              <h3 className="text-xl font-display font-bold text-theme-text mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-neon-purple rounded-full" />
                Wishlist
              </h3>
              
              {wishlistedVehicles.length === 0 ? (
                <div className="glass-card rounded-2xl p-12 text-center text-theme-muted border-dashed border-2">
                  <Heart className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg">Your garage is empty.</p>
                  <button onClick={() => setView(ViewState.MARKETPLACE)} className="mt-6 text-neon-blue font-bold hover:underline">
                    Browse Vehicles
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistedVehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      onClick={() => handleVehicleSelect(vehicle)}
                      className="group glass-card rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-neon-purple/50 hover:shadow-[0_0_20px_rgba(188,19,254,0.1)]"
                    >
                      <div className="relative h-48">
                        <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg to-transparent opacity-80" />
                        <div className="absolute bottom-4 left-4">
                          <h4 className="font-bold text-theme-text text-lg">{vehicle.model}</h4>
                          <p className="text-neon-blue text-sm font-mono">${vehicle.price.toLocaleString()}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(vehicle.id); }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md hover:bg-neon-purple hover:text-white transition-all text-neon-purple"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      default: return <Feed />;
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
              <SidebarItem icon={<Heart />} label="Wishlist" active={false} onClick={() => setView(ViewState.PROFILE)} />
              <SidebarItem icon={<Gavel />} label="Bids" active={false} onClick={() => {}} badge="Live" />
              
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

              {/* Ticker */}
              <div className="hidden md:flex items-center gap-3 flex-1 max-w-2xl mx-6 overflow-hidden">
                <Zap className="w-4 h-4 text-neon-green shrink-0 animate-pulse" />
                <span className="text-xs font-mono text-theme-muted truncate">{marketTicker}</span>
              </div>

              {/* Right Actions */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-theme-muted hover:text-theme-text cursor-pointer transition-colors" />
                </div>
                <div className="relative">
                  <Bell className="w-5 h-5 text-theme-muted hover:text-theme-text cursor-pointer transition-colors" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-neon-pink rounded-full border border-theme-bg" />
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

        {/* AI Assistant */}
        <button
          onClick={() => setShowChat(!showChat)}
          className="fixed bottom-24 md:bottom-8 right-4 md:right-8 bg-gradient-to-r from-neon-purple to-fuchsia-600 text-white p-4 rounded-2xl shadow-[0_0_30px_rgba(188,19,254,0.4)] z-50 transition-all hover:scale-105 hover:rotate-3 active:scale-95 group flex items-center gap-2"
        >
          {showChat ? <MessageCircle className="w-6 h-6" /> : <Bot className="w-6 h-6 group-hover:animate-bounce" />}
          <span className="hidden md:inline font-bold pr-1">AI Chat</span>
        </button>
        {showChat && <AIChatBot onClose={() => setShowChat(false)} />}

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