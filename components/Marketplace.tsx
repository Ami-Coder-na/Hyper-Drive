import React, { useState } from 'react';
import { Search, Filter, Zap, MapPin, Heart, ShoppingCart, Check, SlidersHorizontal, Scale, X, Trash2, ArrowUpDown, Calendar, DollarSign, RotateCcw } from 'lucide-react';
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
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500000 });
  const [yearRange, setYearRange] = useState({ min: 2015, max: 2025 });
  const [sortBy, setSortBy] = useState<'NEWEST' | 'OLDEST' | 'PRICE_LOW' | 'PRICE_HIGH'>('NEWEST');

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
            alert("You can compare up to 3 vehicles at a time.");
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

  const filteredVehicles = vehicles
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

  const compareVehicles = vehicles.filter(v => compareList.has(v.id));

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto animate-slide-up relative">
      {/* Filters Area - Sticky & Glass with Offset for Header */}
      <div className="sticky top-[80px] md:top-[88px] z-30 py-4 bg-theme-bg/90 backdrop-blur-xl border-b border-theme-border/50 transition-all -mx-4 px-4 md:-mx-8 md:px-8 shadow-sm">
         <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
             {/* Categories */}
             <div className="flex items-center gap-2 p-1 bg-theme-surface border border-theme-border rounded-xl shadow-sm overflow-x-auto max-w-full no-scrollbar w-full md:w-auto">
                {['ALL', 'CAR', 'BIKE', 'EV', 'PART'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat as any)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all whitespace-nowrap flex-1 md:flex-none ${
                    filter === cat
                      ? 'bg-theme-text text-theme-bg shadow-md'
                      : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg'
                  }`}
                >
                  {cat}
                </button>
              ))}
             </div>

             {/* Search & Filter Toggle */}
             <div className="w-full md:w-auto flex gap-2">
                <div className="relative flex-1 md:w-64 group">
                    <input 
                        type="text" 
                        placeholder="Search model, make..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-theme-card border border-theme-border rounded-xl text-sm focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all placeholder:text-theme-muted/50"
                    />
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-muted group-hover:text-neon-blue transition-colors" />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-2.5 text-theme-muted hover:text-theme-text bg-theme-card rounded-full p-0.5"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <button 
                    onClick={() => setShowFilters(true)}
                    className={`p-2.5 border rounded-xl transition-all flex items-center gap-2 ${
                        showFilters 
                        ? 'bg-neon-blue text-black border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                        : 'bg-theme-card border-theme-border hover:bg-theme-surface text-theme-text'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline text-xs font-bold">Filters</span>
                </button>
             </div>
         </div>
      </div>

      {/* Advanced Filter Drawer */}
      <div className={`fixed inset-y-0 right-0 w-80 bg-theme-card border-l border-theme-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="h-full flex flex-col">
            <div className="p-5 border-b border-theme-border flex items-center justify-between bg-theme-surface/50">
                <h3 className="font-display font-bold text-lg text-theme-text">Advanced Filters</h3>
                <button 
                    onClick={() => setShowFilters(false)}
                    className="p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-full transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
                {/* Sort Section */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-2">
                        <ArrowUpDown className="w-3 h-3" /> Sort By
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'NEWEST', label: 'Newest Year' },
                            { id: 'OLDEST', label: 'Oldest Year' },
                            { id: 'PRICE_LOW', label: 'Price: Low' },
                            { id: 'PRICE_HIGH', label: 'Price: High' },
                        ].map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => setSortBy(opt.id as any)}
                                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                                    sortBy === opt.id 
                                    ? 'bg-neon-blue/10 border-neon-blue text-neon-blue' 
                                    : 'bg-theme-surface border-theme-border text-theme-muted hover:text-theme-text hover:border-theme-muted'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Price Range (Credits)
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="number" 
                                min="0"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange({...priceRange, min: Math.max(0, Number(e.target.value))})}
                                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-blue"
                            />
                            <span className="absolute right-3 top-2 text-xs text-theme-muted">Min</span>
                        </div>
                        <span className="text-theme-muted">-</span>
                        <div className="relative flex-1">
                            <input 
                                type="number" 
                                min="0"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange({...priceRange, max: Math.max(0, Number(e.target.value))})}
                                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-blue"
                            />
                            <span className="absolute right-3 top-2 text-xs text-theme-muted">Max</span>
                        </div>
                    </div>
                </div>

                {/* Year Range */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Model Year
                    </label>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <input 
                                type="number"
                                min="1900" 
                                value={yearRange.min}
                                onChange={(e) => setYearRange({...yearRange, min: Number(e.target.value)})}
                                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-blue"
                            />
                            <span className="absolute right-3 top-2 text-xs text-theme-muted">Min</span>
                        </div>
                        <span className="text-theme-muted">-</span>
                        <div className="relative flex-1">
                            <input 
                                type="number"
                                min="1900" 
                                value={yearRange.max}
                                onChange={(e) => setYearRange({...yearRange, max: Number(e.target.value)})}
                                className="w-full bg-theme-surface border border-theme-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neon-blue"
                            />
                            <span className="absolute right-3 top-2 text-xs text-theme-muted">Max</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-5 border-t border-theme-border bg-theme-surface/50">
                <button 
                    onClick={resetFilters}
                    className="w-full py-3 rounded-xl border border-theme-border text-theme-text font-bold hover:bg-theme-surface hover:text-neon-blue transition-colors flex items-center justify-center gap-2"
                >
                    <RotateCcw className="w-4 h-4" /> Reset Filters
                </button>
            </div>
         </div>
      </div>
      
      {/* Backdrop */}
      {showFilters && (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-300" 
            onClick={() => setShowFilters(false)}
        />
      )}

      {/* Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <div
            key={vehicle.id}
            onClick={() => onSelectVehicle(vehicle)}
            className={`group relative bg-theme-card rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] cursor-pointer ${
                compareList.has(vehicle.id) ? 'border-neon-blue ring-1 ring-neon-blue' : 'border-theme-border hover:border-neon-blue/30'
            }`}
          >
            {/* Image Area */}
            <div className="aspect-[4/3] relative overflow-hidden">
                <img
                    src={vehicle.image}
                    alt={vehicle.model}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-theme-card via-transparent to-transparent opacity-90" />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-wider">
                        {vehicle.type}
                    </span>
                    {vehicle.seller.isVerified && (
                         <span className="px-2 py-1 bg-neon-blue/20 backdrop-blur-md rounded text-[10px] font-bold text-neon-blue border border-neon-blue/20 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> TRUSTED
                         </span>
                    )}
                </div>

                <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(vehicle.id);
                        }}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${
                            wishlist.has(vehicle.id)
                                ? 'bg-neon-purple text-white shadow-[0_0_10px_#bc13fe]'
                                : 'bg-black/30 text-white/70 hover:bg-white hover:text-black'
                        }`}
                    >
                        <Heart className={`w-4 h-4 ${wishlist.has(vehicle.id) ? 'fill-current' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Info Area */}
            <div className="p-5 relative -mt-12">
                <div className="flex justify-between items-end mb-2">
                    <div>
                        <h3 className="text-xl font-display font-bold text-theme-text leading-tight group-hover:text-neon-blue transition-colors">
                            {vehicle.model}
                        </h3>
                        <p className="text-sm text-theme-muted font-medium">{vehicle.make} • {vehicle.year}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-4 pb-2 border-b border-theme-border/50">
                    <div className="flex items-center gap-1.5 text-theme-muted text-xs">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[100px]">{vehicle.location}</span>
                    </div>
                    <div className="text-lg font-bold text-theme-text">
                        ${vehicle.price.toLocaleString()}
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="mt-4 flex gap-2">
                    <button 
                        onClick={(e) => handleAddToCart(e, vehicle.id)}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                             cartFeedback.has(vehicle.id)
                             ? 'bg-neon-green text-black'
                             : 'bg-theme-surface hover:bg-neon-blue hover:text-black text-theme-text border border-theme-border hover:border-transparent'
                        }`}
                    >
                         {cartFeedback.has(vehicle.id) ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                         {cartFeedback.has(vehicle.id) ? 'ADDED' : 'ADD TO CART'}
                    </button>
                    <button 
                        onClick={(e) => toggleCompare(e, vehicle.id)}
                        className={`px-3 py-2.5 rounded-xl border border-theme-border transition-all flex items-center justify-center gap-2 ${
                            compareList.has(vehicle.id) 
                            ? 'bg-neon-blue text-black border-neon-blue' 
                            : 'bg-theme-surface text-theme-text hover:border-neon-blue hover:text-neon-blue'
                        }`}
                        title={compareList.has(vehicle.id) ? "Remove from comparison" : "Compare"}
                    >
                        <Scale className="w-4 h-4" />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-theme-muted">
            <div className="w-24 h-24 bg-theme-surface rounded-full flex items-center justify-center mb-6">
                 <Search className="w-10 h-10 opacity-30" />
            </div>
            <h3 className="text-lg font-bold text-theme-text">No vehicles found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <button 
                onClick={resetFilters}
                className="mt-4 px-6 py-2 bg-neon-blue text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
            >
                Clear Filters
            </button>
        </div>
      )}

      {/* Floating Compare Action Bar */}
      {compareList.size > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
            <div className="glass px-6 py-3 rounded-full flex items-center gap-4 shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-neon-blue/30">
                <div className="flex items-center gap-2">
                    <span className="bg-neon-blue text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {compareList.size}
                    </span>
                    <span className="text-sm font-bold text-theme-text hidden md:inline">Selected for comparison</span>
                </div>
                
                <div className="h-4 w-px bg-theme-border mx-2" />

                <button 
                    onClick={() => setShowCompareModal(true)}
                    className="flex items-center gap-2 text-sm font-bold text-neon-blue hover:text-white transition-colors"
                >
                    <Scale className="w-4 h-4" /> COMPARE
                </button>
                
                <button 
                    onClick={clearCompare}
                    className="p-1 hover:bg-red-500/20 rounded-full text-theme-muted hover:text-red-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-theme-bg w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl border border-theme-border flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-theme-border flex justify-between items-center bg-theme-card">
                    <div>
                        <h2 className="text-2xl font-display font-bold text-theme-text">Vehicle Comparison</h2>
                        <p className="text-theme-muted text-sm">Comparing {compareVehicles.length} vehicles</p>
                    </div>
                    <div className="flex gap-2">
                         <button 
                            onClick={clearCompare}
                            className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Clear
                        </button>
                        <button 
                            onClick={() => setShowCompareModal(false)}
                            className="p-2 bg-theme-surface hover:bg-theme-muted/20 rounded-full text-theme-text transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Comparison Grid */}
                <div className="flex-1 overflow-auto p-6 bg-theme-bg">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {compareVehicles.map((vehicle) => (
                            <div key={vehicle.id} className="space-y-6 min-w-[250px]">
                                {/* Header Card */}
                                <div className="bg-theme-card rounded-2xl p-4 border border-theme-border shadow-sm">
                                    <div className="aspect-video rounded-lg overflow-hidden mb-4 relative">
                                        <img 
                                            src={vehicle.image} 
                                            className="w-full h-full object-cover" 
                                            alt={vehicle.model} 
                                            loading="lazy"
                                            decoding="async"
                                        />
                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold rounded backdrop-blur-md">
                                            {vehicle.type}
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-theme-text leading-tight">{vehicle.model}</h3>
                                    <p className="text-theme-muted text-sm mb-2">{vehicle.make}</p>
                                    <p className="text-xl font-bold text-neon-blue">${vehicle.price.toLocaleString()}</p>
                                    <button 
                                        onClick={() => onSelectVehicle(vehicle)}
                                        className="w-full mt-3 py-2 rounded-lg bg-theme-surface hover:bg-neon-blue hover:text-black border border-theme-border text-xs font-bold transition-all"
                                    >
                                        VIEW DETAILS
                                    </button>
                                </div>

                                {/* Specs */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center p-3 bg-theme-surface/50 rounded-xl">
                                        <span className="text-xs text-theme-muted font-bold">YEAR</span>
                                        <span className="text-sm font-bold text-theme-text">{vehicle.year}</span>
                                    </div>
                                    
                                    <div className="p-3 bg-theme-surface/50 rounded-xl space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-theme-muted font-bold">SPEED</span>
                                            <span className="text-sm font-bold text-theme-text">{vehicle.stats.speed}/100</span>
                                        </div>
                                        <div className="h-1.5 bg-theme-card rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-blue" style={{ width: `${vehicle.stats.speed}%` }} />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-theme-surface/50 rounded-xl space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-theme-muted font-bold">HANDLING</span>
                                            <span className="text-sm font-bold text-theme-text">{vehicle.stats.handling}/100</span>
                                        </div>
                                        <div className="h-1.5 bg-theme-card rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-purple" style={{ width: `${vehicle.stats.handling}%` }} />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-theme-surface/50 rounded-xl space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-theme-muted font-bold">RANGE</span>
                                            <span className="text-sm font-bold text-theme-text">{vehicle.stats.range}/100</span>
                                        </div>
                                        <div className="h-1.5 bg-theme-card rounded-full overflow-hidden">
                                            <div className="h-full bg-neon-green" style={{ width: `${vehicle.stats.range}%` }} />
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center p-3 bg-theme-surface/50 rounded-xl">
                                        <span className="text-xs text-theme-muted font-bold">LOCATION</span>
                                        <span className="text-sm font-bold text-theme-text truncate max-w-[120px]">{vehicle.location}</span>
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