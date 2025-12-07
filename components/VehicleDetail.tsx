
import React, { useState } from 'react';
import { Vehicle } from '../types';
import { ChevronLeft, ShieldCheck, Zap, MessageCircle, Heart, Image as ImageIcon, Box, Activity, Cpu, Share2, Terminal, Clock, MapPin, Gauge } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { generateVehicleInsight } from '../services/geminiService';
import ThreeDViewer from './ThreeDViewer';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onBack, isWishlisted, onToggleWishlist }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'SPECS' | 'HISTORY'>('SPECS');
  const [viewMode, setViewMode] = useState<'3D' | 'IMAGE'>('3D');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Use gallery if available, otherwise default to single image
  const gallery = vehicle.gallery && vehicle.gallery.length > 0 
    ? vehicle.gallery 
    : [vehicle.image, vehicle.image, vehicle.image, vehicle.image];

  const handleAiAnalysis = async () => {
    if (aiAnalysis) return;
    setLoadingAi(true);
    const text = await generateVehicleInsight(
      `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      "Analyze this vehicle's value proposition and cool factor for a buyer."
    );
    setAiAnalysis(text);
    setLoadingAi(false);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200';
  };

  // Helper for Segmented Bar
  const SegmentedBar = ({ value, color = 'bg-neon-blue' }: { value: number, color?: string }) => {
    const segments = 20;
    const filled = Math.round((value / 100) * segments);
    
    return (
      <div className="flex gap-0.5 h-2.5">
        {[...Array(segments)].map((_, i) => (
          <div 
            key={i} 
            className={`flex-1 rounded-sm transition-all duration-300 ${
              i < filled ? `${color} shadow-[0_0_5px_currentColor]` : 'bg-theme-border/30'
            }`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <button 
            onClick={onBack}
            className="flex items-center gap-2 text-theme-muted hover:text-neon-blue transition-colors group"
        >
            <div className="p-1 rounded-full border border-theme-border group-hover:border-neon-blue transition-colors">
                <ChevronLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-wide">BACK TO GRID</span>
        </button>
        <div className="flex gap-2">
            <button className="p-2 text-theme-muted hover:text-theme-text transition-colors">
                <Share2 className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* === LEFT COLUMN: VISUALS (7/12) === */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Main Viewer */}
          <div className="relative aspect-[16/10] bg-theme-card rounded-3xl overflow-hidden border border-theme-border group shadow-2xl">
            
            {/* Holographic Corners */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-neon-blue rounded-tl-lg z-20 opacity-50" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-neon-blue rounded-tr-lg z-20 opacity-50" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-neon-blue rounded-bl-lg z-20 opacity-50" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-neon-blue rounded-br-lg z-20 opacity-50" />

            {viewMode === 'IMAGE' ? (
                <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-1000">
                    <img 
                        src={gallery[activeImageIndex]} 
                        alt={vehicle.model}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                </div>
            ) : (
                <div className="w-full h-full bg-gradient-to-b from-slate-900 to-black relative">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    <ThreeDViewer type={vehicle.type} />
                </div>
            )}

            {/* View Controls */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex p-1.5 bg-black/60 backdrop-blur-xl rounded-xl border border-white/10 z-30 shadow-xl">
                <button 
                    onClick={() => setViewMode('3D')}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold tracking-wider ${viewMode === '3D' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'text-white/70 hover:text-white'}`}
                >
                    <Box className="w-4 h-4" /> 3D SCAN
                </button>
                <div className="w-px h-6 bg-white/10 mx-1 self-center" />
                <button 
                    onClick={() => setViewMode('IMAGE')}
                    className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-xs font-bold tracking-wider ${viewMode === 'IMAGE' ? 'bg-neon-blue text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'text-white/70 hover:text-white'}`}
                >
                    <ImageIcon className="w-4 h-4" /> VISUAL
                </button>
            </div>

            {/* Live Status Overlay */}
            <div className="absolute bottom-6 left-6 z-30 flex items-center gap-4">
                 <div className="px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white flex items-center gap-2">
                     <Activity className="w-4 h-4 text-neon-green" />
                     <span className="text-[10px] font-bold tracking-widest">SYSTEM ONLINE</span>
                 </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {gallery.slice(0, 4).map((img, i) => (
              <div 
                key={i} 
                onClick={() => { setViewMode('IMAGE'); setActiveImageIndex(i); }}
                className={`group relative aspect-[4/3] rounded-2xl bg-theme-card border overflow-hidden cursor-pointer transition-all ${activeImageIndex === i && viewMode === 'IMAGE' ? 'border-neon-blue ring-1 ring-neon-blue' : 'border-theme-border hover:border-neon-blue'}`}
              >
                <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all grayscale group-hover:grayscale-0" alt="thumb" onError={handleImageError} />
                <div className="absolute inset-0 bg-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          {/* Description Card */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 md:p-8">
             <h3 className="text-lg font-display font-bold text-theme-text mb-4 border-b border-theme-border pb-2 inline-block">VEHICLE MANIFEST</h3>
             <p className="text-theme-muted leading-relaxed text-sm md:text-base">
                 {vehicle.description}
                 <br/><br/>
                 Equipped with next-gen systems and verified components. This unit represents the pinnacle of {vehicle.year} engineering standards. Ready for immediate transfer and grid synchronization.
             </p>
          </div>
        </div>

        {/* === RIGHT COLUMN: DATA (5/12) === */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Data */}
          <div>
            <div className="flex items-start justify-between mb-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-neon-blue tracking-widest uppercase mb-1">
                    <span className="px-2 py-0.5 rounded border border-neon-blue/30 bg-neon-blue/10">{vehicle.type} CLASS</span>
                    <span>•</span>
                    <span>{vehicle.year}</span>
                 </div>
                 {vehicle.seller.isVerified && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-black bg-neon-green px-2 py-1 rounded-full shadow-[0_0_10px_rgba(10,255,104,0.3)]">
                        <ShieldCheck className="w-3 h-3" /> VERIFIED
                    </div>
                 )}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold text-theme-text leading-none mb-2">{vehicle.model}</h1>
            <p className="text-xl text-theme-muted font-display tracking-wide">{vehicle.make}</p>
            
            <div className="mt-6 flex items-end gap-3">
                <h2 className="text-4xl font-bold text-neon-purple font-display bg-clip-text text-transparent bg-gradient-to-r from-neon-purple to-fuchsia-400">
                    ${vehicle.price.toLocaleString()}
                </h2>
                <span className="text-sm text-theme-muted mb-2 font-bold uppercase tracking-wider">Fixed Credits</span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex gap-3">
            <button className="flex-1 py-4 bg-neon-blue hover:bg-cyan-400 text-black font-bold text-sm md:text-base rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all flex justify-center items-center gap-2 group">
              <MessageCircle className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              CONTACT SELLER
            </button>
            <button 
              onClick={onToggleWishlist}
              className={`px-5 rounded-xl border-2 transition-all flex items-center justify-center ${
                isWishlisted 
                  ? 'border-neon-purple bg-neon-purple/20 text-neon-purple shadow-[0_0_15px_rgba(188,19,254,0.2)]' 
                  : 'border-theme-border hover:border-theme-text text-theme-muted hover:text-theme-text'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-neon-purple' : ''}`} />
            </button>
          </div>

          {/* Specs & History Tabs */}
          <div className="bg-theme-card border border-theme-border rounded-3xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 bg-neon-blue/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex gap-6 border-b border-theme-border pb-4 mb-6">
              <button 
                onClick={() => setActiveTab('SPECS')}
                className={`text-sm font-bold tracking-widest transition-colors relative ${activeTab === 'SPECS' ? 'text-theme-text' : 'text-theme-muted hover:text-theme-text'}`}
              >
                PERFORMANCE
                {activeTab === 'SPECS' && <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_10px_#00f3ff]" />}
              </button>
              <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`text-sm font-bold tracking-widest transition-colors relative ${activeTab === 'HISTORY' ? 'text-theme-text' : 'text-theme-muted hover:text-theme-text'}`}
              >
                MARKET DATA
                {activeTab === 'HISTORY' && <div className="absolute -bottom-4 left-0 w-full h-0.5 bg-neon-blue shadow-[0_0_10px_#00f3ff]" />}
              </button>
            </div>

            {activeTab === 'SPECS' ? (
              <div className="space-y-6">
                 {/* Speed */}
                 <div className="group">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-theme-muted flex items-center gap-2"><Gauge className="w-3 h-3" /> SPEED</span>
                        <span className="text-sm font-display font-bold text-neon-blue">{vehicle.stats.speed} / 100</span>
                    </div>
                    <SegmentedBar value={vehicle.stats.speed} color="bg-neon-blue" />
                 </div>
                 
                 {/* Handling */}
                 <div className="group">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-theme-muted flex items-center gap-2"><Activity className="w-3 h-3" /> HANDLING</span>
                        <span className="text-sm font-display font-bold text-neon-purple">{vehicle.stats.handling} / 100</span>
                    </div>
                    <SegmentedBar value={vehicle.stats.handling} color="bg-neon-purple" />
                 </div>

                 {/* Range */}
                 <div className="group">
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-theme-muted flex items-center gap-2"><Zap className="w-3 h-3" /> RANGE</span>
                        <span className="text-sm font-display font-bold text-neon-green">{vehicle.stats.range} / 100</span>
                    </div>
                    <SegmentedBar value={vehicle.stats.range} color="bg-neon-green" />
                 </div>

                 <div className="pt-4 border-t border-theme-border grid grid-cols-2 gap-4">
                     <div>
                         <span className="text-[10px] text-theme-muted uppercase font-bold block mb-1">Location</span>
                         <div className="flex items-center gap-1.5 text-sm font-bold text-theme-text">
                             <MapPin className="w-4 h-4 text-theme-muted" /> {vehicle.location}
                         </div>
                     </div>
                     <div>
                         <span className="text-[10px] text-theme-muted uppercase font-bold block mb-1">Listed</span>
                         <div className="flex items-center gap-1.5 text-sm font-bold text-theme-text">
                             <Clock className="w-4 h-4 text-theme-muted" /> 2 Days Ago
                         </div>
                     </div>
                 </div>
              </div>
            ) : (
              <div className="h-64 w-full -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vehicle.history}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val/1000}k`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'var(--border-color)', color: 'rgb(var(--text-main))', borderRadius: '12px' }} 
                      itemStyle={{ color: '#00f3ff', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="price" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorPrice)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Terminal */}
          <div className="bg-black/40 border border-theme-border/50 rounded-2xl overflow-hidden font-mono text-sm relative group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-blue opacity-50" />
            
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neon-blue">
                    <Terminal className="w-4 h-4" />
                    <span className="font-bold text-xs tracking-wider">AI DIAGNOSTIC TERMINAL</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                </div>
            </div>

            <div className="p-5 min-h-[140px]">
                {aiAnalysis ? (
                    <div className="animate-in fade-in space-y-2">
                        <div className="flex gap-2 text-xs text-theme-muted mb-2">
                            <span>{`>`} ANALYSIS_COMPLETE</span>
                            <span className="text-neon-green">100%</span>
                        </div>
                        <p className="text-indigo-100 leading-relaxed text-xs md:text-sm border-l-2 border-neon-blue/30 pl-3">
                            {aiAnalysis}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-4 space-y-4">
                        <Cpu className="w-8 h-8 text-theme-muted opacity-50 group-hover:text-neon-blue group-hover:opacity-100 transition-all" />
                        <button 
                            onClick={handleAiAnalysis}
                            disabled={loadingAi}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neon-blue border border-neon-blue/30 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                        >
                            {loadingAi ? 'RUNNING DIAGNOSTICS...' : 'INITIATE AI SCAN'}
                        </button>
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;
