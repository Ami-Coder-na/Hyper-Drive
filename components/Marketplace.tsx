
import React, { useState, useMemo } from 'react';
import { Search, Filter, Zap, MapPin, Heart, ShoppingCart, Check, SlidersHorizontal, Scale, X, Trash2, ArrowUpDown, Calendar, DollarSign, RotateCcw, Activity, Gauge, Cpu, ChevronDown, Flame, Tag, Star, LayoutGrid, List as ListIcon, TrendingUp, ArrowRight, Car, Bike, Wrench, Layers } from 'lucide-react';
import { Vehicle } from '../types';

interface MarketplaceProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  wishlist: Set<string>;
  onToggleWishlist: (id: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ vehicles, onSelectVehicle, wishlist, onToggleWishlist }) => {
  const [filter, setFilter] = useState<'ALL' | 'CAR' | 'BIKE' | 'EV' | 'PART'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [cartFeedback, setCartFeedback] = useState<Set<string>>(new Set());
  const [compareList, setCompareList] = useState<Set<string>>(new Set());
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [yearRange, setYearRange] = useState({ min: 2015, max: 2025 });
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRICE_LOW' | 'PRICE_HIGH'>('NEWEST');

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200'; // Fallback tech background
  };

  // Category Theme Configuration
  const categoryThemes: Record<string, { title: string; desc: string; icon: any; color: string; border: string; bg: string; shadow: string }> = {
    CAR: { 
      title: 'AUTOMOTIVE SECTOR', 
      desc: 'High-performance combustion and hybrid platforms. From classic restomods to track weapons.',
      icon: Car, 
      color: 'text-neon-blue',
      border: 'border-neon-blue',
      bg: 'bg-neon-blue/10',
      shadow: 'shadow-[0_0_20px_rgba(0,243,255,0.2)]'
    },
    BIKE: { 
      title: 'TWO-WHEEL DIVISION', 
      desc: 'Superbikes, Cruisers, and Hyper-Agile Units. Experience raw speed.',
      icon: Bike, 
      color: 'text-neon-purple',
      border: 'border-neon-purple',
      bg: 'bg-neon-purple/10',
      shadow: 'shadow-[0_0_20px_rgba(188,19,254,0.2)]'
    },
    EV: { 
      title: 'ZERO EMISSIONS', 
      desc: 'Next-Gen Electric Drive Systems & Autonomous Pods. The silent revolution.',
      icon: Zap, 
      color: 'text-neon-green',
      border: 'border-neon-green',
      bg: 'bg-neon-green/10',
      shadow: 'shadow-[0_0_20px_rgba(10,255,104,0.2)]'
    },
    PART: { 
      title: 'COMPONENT MARKET', 
      desc: 'Upgrades, Spares, and Cybernetic Enhancements. Build your dream machine.',
      icon: Wrench, 
      color: 'text-orange-500',
      border: 'border-orange-500',
      bg: 'bg-orange-500/10',
      shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.2)]'
    }
  };

  const handleAddToCart = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCartFeedback(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });

    setTimeout(() => {
      setCartFeedback(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 2000);
  };

  const toggleCompare = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCompareList(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 3) {
            alert("System Limit: You can compare up to 3 units simultaneously.");
            return prev;
        }
        next.add(id);
      }
      return next;
    });
  };

  const clearCompare = () => {
    setCompareList(new Set());
    setShowCompareModal(false);
  };

  const resetFilters = () => {
    setFilter('ALL');
    setSearchTerm('');
    setPriceRange({ min: 0, max: 500000 });
    setYearRange({ min: 2015, max: 2025 });
    setSortBy('NEWEST');
  };

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter(v => {
        const matchesFilter = filter === 'ALL' || v.type === filter;
        const matchesSearch = v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              v.model.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = v.price >= priceRange.min && v.price <= priceRange.max;
        const matchesYear = v.year >= yearRange.min && v.year <= yearRange.max;
        
        return matchesFilter && matchesSearch && matchesPrice && matchesYear;
      })
      .sort((a, b) => {
          switch (sortBy) {
              case 'PRICE_LOW': return a.price - b.price;
              case 'PRICE_HIGH': return b.price - a.price;
              case 'OLDEST': return a.year - b.year;
              case 'NEWEST': return b.year - a.year;
              default: return 0;
          }
      });
  }, [vehicles, filter, searchTerm, priceRange, yearRange, sortBy]);

  const compareVehicles = vehicles.filter(v => compareList.has(v.id));
  const featuredVehicle = vehicles.length > 0 ? vehicles[0] : null;

  // Category Stats Calculation
  const categoryStats = useMemo(() => {
      if (filter === 'ALL') return null;
      const subset = vehicles.filter(v => v.type === filter);
      const total = subset.length;
      const avg = total > 0 ? subset.reduce((acc, v) => acc + v.price, 0) / total : 0;
      return { total, avg };
  }, [filter, vehicles]);

  const activeTheme = categoryThemes[filter];

  return (
    <div className="space-y-6 pb-32 max-w-[1800px] mx-auto animate-slide-up relative px-4 md:px-8 pt-4">
      
      {/* Dynamic Hero Section */}
      {filter === 'ALL' && featuredVehicle && !searchTerm ? (
        // ALL: Featured Vehicle Hero
        <div className="mb-8 hidden md:block">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 group cursor-pointer shadow-2xl" onClick={() => onSelectVehicle(featuredVehicle)}>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
                <img 
                    src={featuredVehicle.image} 
                    className="w-full h-80 object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000" 
                    alt="Featured" 
                    // Eager load LCP image
                    fetchPriority="high"
                    decoding="async"
                    onError={handleImageError}
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-center px-12">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-neon-blue text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Spotlight</span>
                        <div className="flex items-center gap-1 text-neon-blue text-xs font-bold animate-pulse">
                            <TrendingUp className="w-3 h-3" /> Trending High
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">{featuredVehicle.model}</h1>
                    <p className="text-xl text-theme-muted mb-6 max-w-lg">{featuredVehicle.description}</p>
                    <div className="flex items-center gap-4">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neon-blue transition-colors flex items-center gap-2">
                            View Details <ArrowRight className="w-4 h-4" />
                        </button>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">${featuredVehicle.price.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>
      ) : activeTheme && !searchTerm ? (
        // SPECIFIC CATEGORY: Thematic Header
        <div className="mb-8 hidden md:block">
            <div className={`relative rounded-3xl overflow-hidden border ${activeTheme.border} border-opacity-30 group shadow-2xl`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${activeTheme.bg.replace('bg-', 'from-')} via-theme-bg to-theme-bg z-0 opacity-20`} />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20" />
                
                <div className="relative z-10 p-10 flex items-center justify-between">
                    <div>
                        <div className={`flex items-center gap-3 mb-2 ${activeTheme.color}`}>
                            <activeTheme.icon className="w-8 h-8" />
                            <span className="text-xs font-bold tracking-[0.3em] uppercase border border-current px-2 py-1 rounded">
                                {filter} DIVISION
                            </span>
                        </div>
                        <h1 className="text-5xl font-display font-bold text-theme-text mb-2 tracking-wide">{activeTheme.title}</h1>
                        <p className="text-xl text-theme-muted max-w-2xl">{activeTheme.desc}</p>
                    </div>

                    {/* Category Live Stats */}
                    {categoryStats && (
                        <div className="flex gap-6">
                            <div className="bg-theme-bg/60 backdrop-blur-md border border-theme-border rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-theme-muted font-bold uppercase mb-1">Active Units</p>
                                <p className={`text-3xl font-display font-bold ${activeTheme.color}`}>{categoryStats.total}</p>
                            </div>
                            <div className="bg-theme-bg/60 backdrop-blur-md border border-theme-border rounded-2xl p-4 min-w-[140px]">
                                <p className="text-xs text-theme-muted font-bold uppercase mb-1">Avg Market Value</p>
                                <p className="text-3xl font-display font-bold text-theme-text">${(categoryStats.avg / 1000).toFixed(1)}k</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
      ) : null}

      {/* Control Deck (Sticky Filters) - Refactored to solid bar */}
      <div className="sticky top-0 z-40 -mx-4 md:-mx-8 bg-theme-bg border-b border-white/5 shadow-xl transition-all duration-300">
         <div className="px-4 md:px-8 py-3 flex flex-col gap-3">
             
             {/* Desktop: Single Row Layout */}
             <div className="flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                 
                 {/* Left: Search & Categories */}
                 <div className="flex flex-col sm:flex-row gap-3 flex-1 min-w-0">
                    <div className="relative w-full sm:w-64 group shrink-0">
                        <input 
                            type="text" 
                            placeholder="Search Grid..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 bg-theme-surface border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:border-neon-blue/50 transition-all placeholder:text-theme-muted/50 font-medium h-10"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-muted group-hover:text-neon-blue transition-colors" />
                        {searchTerm && (
                            <button 
                                onClick={() => setSearchTerm('')}
                                className="absolute right-3 top-2.5 text-theme-muted hover:text-theme-text"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-r">
                        {['ALL', 'CAR', 'BIKE', 'EV', 'PART'].map((cat) => {
                             const isActive = filter === cat;
                             const theme = categoryThemes[cat];
                             // Determine colors based on active state and theme
                             let activeClass = 'bg-neon-blue/10 border-neon-blue text-neon-blue';
                             if (isActive && theme) {
                                 activeClass = `${theme.bg} ${theme.border} ${theme.color}`;
                             } else if (isActive) {
                                 // Default for ALL
                                 activeClass = 'bg-white/10 border-white text-white';
                             }

                             return (
                                <button
                                    key={cat}
                                    onClick={() => setFilter(cat as any)}
                                    className={`relative px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all whitespace-nowrap shrink-0 border ${
                                        isActive
                                        ? activeClass
                                        : 'border-transparent text-theme-muted hover:text-theme-text hover:bg-theme-surface'
                                    }`}
                                >
                                    {cat === 'ALL' && <Layers className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                                    {cat === 'CAR' && <Car className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                                    {cat === 'BIKE' && <Bike className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                                    {cat === 'EV' && <Zap className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                                    {cat === 'PART' && <Wrench className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />}
                                    {cat}
                                </button>
                             );
                        })}
                    </div>
                 </div>

                 {/* Right: View Toggle & Actions */}
                 <div className="flex items-center gap-2 self-end lg:self-auto">
                    <div className="flex bg-theme-surface p-1 rounded-lg border border-theme-border">
                        <button 
                            onClick={() => setViewMode('GRID')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'GRID' ? 'bg-theme-card text-theme-text shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('LIST')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'LIST' ? 'bg-theme-card text-theme-text shadow-sm' : 'text-theme-muted hover:text-theme-text'}`}
                            title="List View"
                        >
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="h-6 w-px bg-theme-border mx-1" />

                    <button 
                        onClick={() => setShowFilters(true)}
                        className={`h-10 px-4 border rounded-xl transition-all flex items-center gap-2 shrink-0 ${
                            showFilters 
                            ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                            : 'bg-theme-surface border-theme-border hover:bg-theme-card text-theme-text hover:border-theme-border/80'
                        }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline text-xs font-bold">FILTERS</span>
                        {(priceRange.min > 0 || priceRange.max < 500000 || filter !== 'ALL') && (
                            <div className="w-1.5 h-1.5 rounded-full bg-neon-pink animate-pulse sm:hidden" />
                        )}
                    </button>
                 </div>
             </div>
         </div>
      </div>

      {/* Advanced Filter Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[420px] bg-theme-bg border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 transform transition-transform duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <div className="p-6 border-b border-white/10 flex items-center justify-between relative z-10 bg-gradient-to-b from-black/20 to-transparent">
                <div>
                    <h3 className="font-display font-bold text-xl text-theme-text tracking-wide flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-neon-blue" />
                        CONFIG PANEL
                    </h3>
                </div>
                <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-theme-muted hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar relative z-10">
                {/* Sort Section */}
                <div className="space-y-4">
                    <label className="text-xs font-bold text-neon-blue uppercase tracking-widest flex items-center gap-2 mb-2">
                        <ArrowUpDown className="w-3 h-3" /> Sort Priority
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { id: 'NEWEST', label: 'Newest Year', icon: Calendar },
                            { id: 'OLDEST', label: 'Oldest Year', icon: Calendar },
                            { id: 'PRICE_LOW', label: 'Price: Low', icon: DollarSign },
                            { id: 'PRICE_HIGH', label: 'Price: High', icon: DollarSign },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as any)}
                                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                                    sortBy === opt.id 
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue shadow-[inset_0_0_15px_rgba(0,243,255,0.1)]' 
                                    : 'bg-black/40 border-white/5 text-theme-muted hover:text-white hover:border-white/20'
                                }`}
                            >
                                <opt.icon className="w-3 h-3 shrink-0" />
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-5">
                    <div className="flex justify-between items-center">
                        <label className="text-xs font-bold text-neon-green uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-3 h-3" /> Credit Limit
                        </label>
                        <span className="text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded border border-neon-green/20 font-mono">
                            ${(priceRange.min / 1000).toFixed(0)}k - ${(priceRange.max / 1000).toFixed(0)}k
                        </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 group">
                             <input 
                                type="number" 
                                min="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: Math.max(0, Number(e.target.value))})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-green font-mono text-theme-text transition-colors"
                            />
                            <span className="absolute right-3 top-3.5 text-[10px] text-theme-muted font-bold tracking-wider">MIN</span>
                        </div>
                        <div className="w-4 h-[2px] bg-white/10" />
                        <div className="relative flex-1 group">
                            <input 
                                type="number" 
                                min="0"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: Math.max(0, Number(e.target.value))})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-green font-mono text-theme-text transition-colors"
                            />
                            <span className="absolute right-3 top-3.5 text-[10px] text-theme-muted font-bold tracking-wider">MAX</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {[50000, 100000, 250000].map(p => (
                            <button 
                                key={p} 
                                onClick={() => setPriceRange(prev => ({ ...prev, max: p }))}
                                className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-full text-[10px] font-bold text-theme-muted hover:bg-neon-green/10 hover:text-neon-green hover:border-neon-green/30 transition-all"
                            >
                                &lt; ${p/1000}k
                            </button>
                        ))}
                    </div>
                </div>

                {/* Year Range */}
                <div className="space-y-5">
                    <label className="text-xs font-bold text-neon-purple uppercase tracking-widest flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Model Year
                    </label>
                    <div className="flex items-center gap-3">
                         <div className="relative flex-1 group">
                            <input 
                                type="number"
                                min="1900" 
                                value={yearRange.min}
                                onChange={(e) => setYearRange({...yearRange, min: Number(e.target.value)})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple font-mono text-theme-text transition-colors"
                            />
                            <span className="absolute right-3 top-3.5 text-[10px] text-theme-muted font-bold tracking-wider">FROM</span>
                        </div>
                        <div className="w-4 h-[2px] bg-white/10" />
                        <div className="relative flex-1 group">
                            <input 
                                type="number"
                                min="1900" 
                                value={yearRange.max}
                                onChange={(e) => setYearRange({...yearRange, max: Number(e.target.value)})}
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-neon-purple font-mono text-theme-text transition-colors"
                            />
                            <span className="absolute right-3 top-3.5 text-[10px] text-theme-muted font-bold tracking-wider">TO</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-white/10 bg-theme-surface/30 backdrop-blur-md space-y-3 relative z-10">
                <button 
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-400 transition-all uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] active:scale-[0.98]"
                >
                    Apply Config
                </button>
                <button 
                    onClick={resetFilters}
                    className="w-full py-3 text-theme-muted hover:text-theme-text font-bold text-xs transition-colors flex items-center justify-center gap-2 hover:bg-white/5 rounded-xl"
                >
                    <RotateCcw className="w-3 h-3" /> Reset Default
                </button>
            </div>
         </div>
      </div>
      
      {/* Backdrop */}
      {showFilters && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300" 
            onClick={() => setShowFilters(false)}
        />
      )}

      {/* Grid vs List View Display */}
      {viewMode === 'GRID' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-6">
            {filteredVehicles.map((vehicle) => (
            <div
                key={vehicle.id}
                onClick={() => onSelectVehicle(vehicle)}
                // Using solid theme-card background to prevent transparency overlap issues
                className={`group relative bg-theme-card rounded-3xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                    compareList.has(vehicle.id) ? 'border-neon-blue ring-1 ring-neon-blue bg-neon-blue/5' : 'border-theme-border hover:border-theme-text/20'
                }`}
            >
                {/* Image Area */}
                <div className="aspect-[16/10] relative overflow-hidden bg-black/40">
                    <img
                        src={vehicle.image}
                        alt={vehicle.model}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        onError={handleImageError}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-theme-card via-transparent to-transparent opacity-90" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest shadow-lg">
                            {vehicle.type}
                        </span>
                        {vehicle.seller.isVerified && (
                            <span className="w-6 h-6 rounded-lg bg-neon-blue/20 backdrop-blur-md border border-neon-blue/30 flex items-center justify-center text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]">
                                <Zap className="w-3 h-3 fill-current" />
                            </span>
                        )}
                        {vehicle.year >= 2024 && (
                            <span className="px-2.5 py-1 bg-neon-green/90 text-black text-[10px] font-bold rounded-lg uppercase tracking-widest shadow-lg">
                                NEW
                            </span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(vehicle.id);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-lg backdrop-blur-md transition-all border shadow-lg z-10 ${
                            wishlist.has(vehicle.id)
                                ? 'bg-neon-purple/20 border-neon-purple text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.3)]'
                                : 'bg-black/60 border-white/10 text-white/50 hover:bg-white hover:text-black hover:border-white'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${wishlist.has(vehicle.id) ? 'fill-current' : ''}`} />
                    </button>

                    {/* Quick Stats Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
                        <div className="flex gap-4 mb-2">
                            <div className="flex-1 bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neon-blue mb-0.5">
                                    <Gauge className="w-3 h-3" /> SPEED
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon-blue" style={{ width: `${vehicle.stats.speed}%` }} />
                                </div>
                            </div>
                            <div className="flex-1 bg-black/60 backdrop-blur-md rounded-lg p-2 border border-white/10">
                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-neon-purple mb-0.5">
                                    <Activity className="w-3 h-3" /> HANDL
                                </div>
                                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-neon-purple" style={{ width: `${vehicle.stats.handling}%` }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Area */}
                <div className="p-5 pt-2 relative">
                    <div className="flex justify-between items-start mb-2">
                        <div className="min-w-0 pr-2">
                            <h3 className="text-lg font-display font-bold text-theme-text leading-tight group-hover:text-neon-blue transition-colors truncate">
                                {vehicle.model}
                            </h3>
                            <p className="text-xs font-bold text-theme-muted uppercase tracking-wider mt-1">{vehicle.make} • {vehicle.year}</p>
                        </div>
                    </div>

                    <div className="flex items-end justify-between border-b border-theme-border pb-4 mb-4">
                        <div className="flex items-center gap-1.5 text-theme-muted text-xs font-medium bg-theme-surface px-2 py-1 rounded-md max-w-[50%]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{vehicle.location.split(',')[0]}</span>
                        </div>
                        <div className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-theme-text to-theme-muted">
                            ${vehicle.price.toLocaleString()}
                        </div>
                    </div>

                    <div className="grid grid-cols-[1fr_auto] gap-2">
                        <button 
                            onClick={(e) => handleAddToCart(e, vehicle.id)}
                            className={`py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-wider overflow-hidden relative ${
                                cartFeedback.has(vehicle.id)
                                ? 'bg-neon-green text-black border border-neon-green'
                                : 'bg-theme-surface hover:bg-neon-blue hover:text-black text-theme-text border border-theme-border'
                            }`}
                        >
                            {cartFeedback.has(vehicle.id) ? (
                                <>
                                    <Check className="w-4 h-4 animate-in zoom-in" />
                                    <span className="animate-in fade-in">ADDED</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-4 h-4" />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                        
                        <button 
                            onClick={(e) => toggleCompare(e, vehicle.id)}
                            className={`w-12 rounded-xl border transition-all flex items-center justify-center ${
                                compareList.has(vehicle.id) 
                                ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.3)]' 
                                : 'bg-theme-surface text-theme-muted border-theme-border hover:border-theme-text/30 hover:text-theme-text'
                            }`}
                        >
                            <Scale className={`w-4 h-4 ${compareList.has(vehicle.id) ? 'fill-current' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>
            ))}
        </div>
      ) : (
        // List View
        <div className="flex flex-col gap-3 mt-6">
             {filteredVehicles.map((vehicle) => (
                 <div
                    key={vehicle.id}
                    onClick={() => onSelectVehicle(vehicle)}
                    // Using solid theme-card background
                    className={`group bg-theme-card border rounded-2xl p-3 flex flex-col sm:flex-row gap-4 transition-all hover:border-neon-blue/50 hover:bg-theme-surface ${
                        compareList.has(vehicle.id) ? 'border-neon-blue bg-neon-blue/5' : 'border-theme-border'
                    }`}
                 >
                    <div className="w-full sm:w-64 aspect-[16/9] rounded-xl overflow-hidden relative shrink-0">
                        <img 
                            src={vehicle.image} 
                            alt={vehicle.model} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            onError={handleImageError}
                        />
                         <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur rounded text-[9px] font-bold text-white border border-white/10 uppercase">
                            {vehicle.type}
                        </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                            <div className="flex justify-between items-start gap-3">
                                 <div className="min-w-0">
                                    <h3 className="text-lg font-display font-bold text-theme-text group-hover:text-neon-blue transition-colors truncate">{vehicle.model}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-theme-muted font-bold uppercase tracking-wide mt-1">
                                        <span>{vehicle.make}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span>{vehicle.year}</span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vehicle.location.split(',')[0]}</span>
                                    </div>
                                 </div>
                                 <div className="text-right shrink-0">
                                    <div className="text-xl font-display font-bold text-theme-text">${vehicle.price.toLocaleString()}</div>
                                 </div>
                            </div>
                            
                            <p className="text-sm text-theme-muted mt-2 line-clamp-2 sm:line-clamp-1 md:line-clamp-2">{vehicle.description}</p>
                        </div>

                        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                             {/* Dense Stats */}
                             <div className="flex gap-4">
                                 <div className="flex items-center gap-2 text-xs">
                                    <span className="text-theme-muted font-bold">SPD</span>
                                    <div className="w-12 h-1 bg-theme-surface rounded-full overflow-hidden border border-theme-border">
                                        <div className="h-full bg-neon-blue" style={{ width: `${vehicle.stats.speed}%` }} />
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2 text-xs">
                                    <span className="text-theme-muted font-bold">HND</span>
                                    <div className="w-12 h-1 bg-theme-surface rounded-full overflow-hidden border border-theme-border">
                                        <div className="h-full bg-neon-purple" style={{ width: `${vehicle.stats.handling}%` }} />
                                    </div>
                                 </div>
                            </div>

                            <div className="flex justify-end gap-2 flex-1">
                                 <button 
                                    onClick={(e) => toggleCompare(e, vehicle.id)}
                                    className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        compareList.has(vehicle.id) 
                                        ? 'bg-neon-blue text-black border-neon-blue' 
                                        : 'bg-theme-surface text-theme-muted border-theme-border hover:text-theme-text'
                                    }`}
                                >
                                    <Scale className="w-3.5 h-3.5" /> <span className="hidden md:inline">Compare</span>
                                </button>
                                <button 
                                    onClick={(e) => handleAddToCart(e, vehicle.id)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                        cartFeedback.has(vehicle.id)
                                        ? 'bg-neon-green text-black border border-neon-green'
                                        : 'bg-theme-surface hover:bg-neon-blue hover:text-black text-theme-text border border-theme-border'
                                    }`}
                                >
                                    {cartFeedback.has(vehicle.id) ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            <span>Added</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-3.5 h-3.5" />
                                            <span>Add</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
             ))}
        </div>
      )}
      
      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-theme-muted bg-theme-card rounded-3xl border border-dashed border-theme-border mt-6">
            <div className="w-24 h-24 bg-theme-surface rounded-full flex items-center justify-center mb-6 relative">
                 <Search className="w-10 h-10 opacity-30" />
                 <div className="absolute top-0 right-0 w-3 h-3 bg-neon-blue rounded-full animate-ping" />
            </div>
            <h3 className="text-2xl font-display font-bold text-theme-text">No Units Located</h3>
            <p className="max-w-xs text-center mt-2 opacity-60 text-sm">Your search parameters yielded no results on the current grid.</p>
            <button 
                onClick={resetFilters}
                className="mt-8 px-8 py-3 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-400 transition-colors uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(0,243,255,0.2)]"
            >
                Reset System Config
            </button>
        </div>
      )}

      {/* Floating Compare Dock */}
      <div className={`fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out ${compareList.size > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <div className="bg-theme-card/90 backdrop-blur-xl pl-2 pr-4 py-2 rounded-full flex items-center gap-4 shadow-2xl border border-white/10 ring-1 ring-white/5">
                <div className="flex -space-x-3 pl-2">
                    {compareVehicles.map(v => (
                        <div key={v.id} className="w-10 h-10 rounded-full border-2 border-theme-card overflow-hidden relative shadow-lg bg-theme-bg">
                            <img src={v.image} className="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
                        </div>
                    ))}
                    {Array.from({ length: Math.max(0, 3 - compareVehicles.length) }).map((_, i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-theme-card bg-theme-surface flex items-center justify-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-theme-muted/30" />
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col pr-2">
                    <span className="text-[10px] font-bold text-neon-blue uppercase tracking-wider hidden sm:inline">Analysis Deck</span>
                    <span className="text-xs font-bold text-theme-text">{compareList.size} <span className="text-theme-muted">/ 3</span><span className="sm:hidden"> Selected</span></span>
                </div>

                <div className="h-8 w-px bg-white/10 mx-1" />

                <button 
                    onClick={() => setShowCompareModal(true)}
                    className="h-9 px-4 sm:px-5 bg-neon-blue text-black rounded-full text-xs font-bold hover:bg-cyan-400 transition-colors flex items-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.3)] whitespace-nowrap"
                >
                    <Scale className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Compare</span>
                </button>
                
                <button 
                    onClick={clearCompare}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 text-theme-muted hover:text-theme-text transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
      </div>

      {/* Comparison Holographic Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-theme-bg/95 w-full max-w-7xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col relative">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

                {/* Modal Header */}
                <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-black/40 relative z-10 backdrop-blur-md">
                    <div>
                        <div className="flex items-center gap-2 text-neon-blue mb-1">
                            <Activity className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-widest">System Analysis</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-display font-bold text-theme-text">Side-by-Side Comparison</h2>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={clearCompare}
                            className="px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 uppercase tracking-wider"
                        >
                            <Trash2 className="w-3 h-3" /> <span className="hidden sm:inline">Clear Deck</span>
                        </button>
                        <button 
                            onClick={() => setShowCompareModal(false)}
                            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-theme-text transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Comparison Content */}
                <div className="flex-1 overflow-auto p-4 sm:p-8 relative z-10 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {compareVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="space-y-4 sm:space-y-6 min-w-[280px] group">
                                {/* Header Card */}
                                <div className="bg-white/5 backdrop-blur rounded-3xl p-4 sm:p-5 border border-white/10 group-hover:border-neon-blue/50 transition-colors relative overflow-hidden">
                                    <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-5 relative bg-black/50">
                                        <img 
                                            src={vehicle.image} 
                                            className="w-full h-full object-cover" 
                                            alt={vehicle.model} 
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-neon-blue border border-neon-blue/30 text-[10px] font-bold rounded uppercase">
                                            {vehicle.type}
                                        </div>
                                    </div>
                                    <h3 className="font-display font-bold text-lg sm:text-xl text-theme-text leading-none mb-1">{vehicle.model}</h3>
                                    <p className="text-theme-muted text-sm font-bold uppercase tracking-wider mb-4">{vehicle.make}</p>
                                    
                                    <div className="flex items-end justify-between border-t border-white/10 pt-4">
                                         <p className="text-xl sm:text-2xl font-display font-bold text-neon-blue">${vehicle.price.toLocaleString()}</p>
                                         <button 
                                            onClick={() => { setShowCompareModal(false); onSelectVehicle(vehicle); }}
                                            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all uppercase tracking-wider flex items-center gap-1"
                                        >
                                            View <ChevronDown className="-rotate-90 w-3 h-3" />
                                        </button>
                                    </div>
                                </div>

                                {/* Specs Module */}
                                <div className="space-y-3 bg-white/5 rounded-3xl p-5 border border-white/10">
                                    <h4 className="text-xs font-bold text-theme-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                                        <Cpu className="w-3 h-3" /> Core Metrics
                                    </h4>
                                    
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-theme-muted">SPEED</span>
                                                <span className="text-neon-blue">{vehicle.stats.speed}</span>
                                            </div>
                                            <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-neon-blue" style={{ width: `${vehicle.stats.speed}%` }} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-theme-muted">HANDLING</span>
                                                <span className="text-neon-purple">{vehicle.stats.handling}</span>
                                            </div>
                                            <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-neon-purple" style={{ width: `${vehicle.stats.handling}%` }} />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-xs font-bold">
                                                <span className="text-theme-muted">RANGE</span>
                                                <span className="text-neon-green">{vehicle.stats.range}</span>
                                            </div>
                                            <div className="h-1 bg-black/50 rounded-full overflow-hidden">
                                                <div className="h-full bg-neon-green" style={{ width: `${vehicle.stats.range}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 mt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-[10px] text-theme-muted uppercase font-bold block">Year</span>
                                            <span className="text-sm font-bold text-theme-text">{vehicle.year}</span>
                                        </div>
                                        <div>
                                            <span className="text-[10px] text-theme-muted uppercase font-bold block">Origin</span>
                                            <span className="text-sm font-bold text-theme-text truncate">{vehicle.location.split(',')[0]}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;
