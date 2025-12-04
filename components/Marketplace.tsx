import React, { useState } from 'react';
import { Search, Filter, Zap, MapPin, Heart, ShoppingCart, Check, SlidersHorizontal, Scale, X, Trash2 } from 'lucide-react';
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

  const filteredVehicles = vehicles.filter(v => {
    const matchesFilter = filter === 'ALL' || v.type === filter;
    const matchesSearch = v.make.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const compareVehicles = vehicles.filter(v => compareList.has(v.id));

  return (
    <div className="space-y-8 pb-32 max-w-7xl mx-auto animate-slide-up relative">
      {/* Filters Area */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 py-4 -mx-2 px-2 md:-mx-0 md:px-0">
         <div className="flex items-center gap-2 p-1 bg-theme-surface border border-theme-border rounded-xl shadow-sm overflow-x-auto max-w-full no-scrollbar">
            {['ALL', 'CAR', 'BIKE', 'EV', 'PART'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-5 py-2 rounded-lg text-xs font-bold tracking-wider transition-all whitespace-nowrap ${
                filter === cat
                  ? 'bg-theme-text text-theme-bg shadow-md'
                  : 'text-theme-muted hover:text-theme-text hover:bg-theme-bg'
              }`}
            >
              {cat}
            </button>
          ))}
         </div>

         <div className="w-full md:w-auto flex gap-2">
            <div className="relative flex-1 md:w-64">
                <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-theme-card border border-theme-border rounded-xl text-sm focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-theme-muted" />
            </div>
            <button className="p-2.5 bg-theme-card border border-theme-border rounded-xl hover:bg-theme-surface transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-theme-text" />
            </button>
         </div>
      </div>

      {/* Modern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredVehicles.map((vehicle) => (
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
                                        <img src={vehicle.image} className="w-full h-full object-cover" alt={vehicle.model} />
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