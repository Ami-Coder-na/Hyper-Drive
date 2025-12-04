import React, { useState } from 'react';
import { Vehicle } from '../types';
import { ChevronLeft, Rotate3D, ShieldCheck, Zap, MessageCircle, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { generateVehicleInsight } from '../services/geminiService';

interface VehicleDetailProps {
  vehicle: Vehicle;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const VehicleDetail: React.FC<VehicleDetailProps> = ({ vehicle, onBack, isWishlisted, onToggleWishlist }) => {
  const [rotation, setRotation] = useState(0);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'STATS' | 'HISTORY'>('STATS');

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

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <button 
        onClick={onBack}
        className="mb-4 flex items-center gap-2 text-theme-muted hover:text-theme-text transition-colors"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Market
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Visualizer Section */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] bg-theme-card rounded-2xl overflow-hidden border border-theme-border group">
            <img 
              src={vehicle.image} 
              alt={vehicle.model}
              className="w-full h-full object-cover transition-transform duration-700"
              style={{ transform: `scale(1.1) rotateY(${rotation}deg)` }}
            />
            
            {/* 3D Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 bg-black/50 backdrop-blur-md p-2 rounded-full border border-white/10">
              <button 
                onClick={() => setRotation(r => r - 45)}
                className="p-2 hover:bg-neon-blue/20 rounded-full text-white transition-colors"
              >
                <Rotate3D className="w-5 h-5" />
              </button>
              <span className="text-xs self-center text-neon-blue font-mono">360° VIEW</span>
               <button 
                onClick={() => setRotation(r => r + 45)}
                className="p-2 hover:bg-neon-blue/20 rounded-full text-white transition-colors"
              >
                <Rotate3D className="w-5 h-5 scale-x-[-1]" />
              </button>
            </div>
          </div>

          {/* Thumbnails (Mock) */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-square rounded-lg bg-theme-card border border-theme-border overflow-hidden cursor-pointer hover:border-neon-blue">
                <img src={vehicle.image} className="w-full h-full object-cover opacity-50 hover:opacity-100 transition-opacity" alt="thumb" />
              </div>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-display font-bold text-theme-text">{vehicle.make} <span className="text-neon-blue">{vehicle.model}</span></h1>
                <p className="text-theme-muted mt-1 flex items-center gap-2">
                  {vehicle.year} • {vehicle.type}
                  {vehicle.seller.isVerified && (
                    <span className="flex items-center gap-1 text-neon-green text-xs border border-neon-green/30 px-2 py-0.5 rounded-full">
                      <ShieldCheck className="w-3 h-3" /> VERIFIED SELLER
                    </span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-bold text-neon-purple">${vehicle.price.toLocaleString()}</h2>
                <p className="text-xs text-theme-muted">Fixed Price</p>
              </div>
            </div>
          </div>

          {/* Stats / Tabs */}
          <div className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
            <div className="flex gap-4 border-b border-theme-border pb-2">
              <button 
                onClick={() => setActiveTab('STATS')}
                className={`pb-2 text-sm font-bold tracking-wide transition-colors ${activeTab === 'STATS' ? 'text-theme-text border-b-2 border-neon-blue' : 'text-theme-muted'}`}
              >
                PERFORMANCE
              </button>
              <button 
                onClick={() => setActiveTab('HISTORY')}
                className={`pb-2 text-sm font-bold tracking-wide transition-colors ${activeTab === 'HISTORY' ? 'text-theme-text border-b-2 border-neon-blue' : 'text-theme-muted'}`}
              >
                PRICE HISTORY
              </button>
            </div>

            {activeTab === 'STATS' ? (
              <div className="space-y-4">
                 <div>
                  <div className="flex justify-between text-xs mb-1 text-theme-muted">
                    <span>SPEED</span>
                    <span>{vehicle.stats.speed}/100</span>
                  </div>
                  <div className="h-2 bg-theme-surface rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${vehicle.stats.speed}%` }} />
                  </div>
                 </div>
                 <div>
                  <div className="flex justify-between text-xs mb-1 text-theme-muted">
                    <span>HANDLING</span>
                    <span>{vehicle.stats.handling}/100</span>
                  </div>
                  <div className="h-2 bg-theme-surface rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-neon-blue to-neon-purple" style={{ width: `${vehicle.stats.handling}%` }} />
                  </div>
                 </div>
                 <p className="text-sm text-theme-muted leading-relaxed pt-2">{vehicle.description}</p>
              </div>
            ) : (
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={vehicle.history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={12} />
                    <YAxis stroke="var(--text-muted)" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgb(var(--bg-card))', borderColor: 'var(--border-color)', color: 'rgb(var(--text-main))' }} 
                      itemStyle={{ color: '#00f3ff' }}
                    />
                    <Line type="monotone" dataKey="price" stroke="#00f3ff" strokeWidth={2} dot={{ fill: '#00f3ff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-indigo-500 rounded-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-indigo-100">AI Mechanic Insight</h3>
            </div>
            {aiAnalysis ? (
              <p className="text-sm text-indigo-200 animate-in fade-in">{aiAnalysis}</p>
            ) : (
              <button 
                onClick={handleAiAnalysis}
                disabled={loadingAi}
                className="text-sm text-neon-blue hover:text-white hover:underline flex items-center gap-2 disabled:opacity-50"
              >
                {loadingAi ? 'Analyzing Data Stream...' : 'Ask AI to analyze this vehicle'}
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-4 bg-neon-blue hover:bg-cyan-400 text-black font-bold text-lg rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all flex justify-center items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Contact Seller
            </button>
            <button 
              onClick={onToggleWishlist}
              className={`px-4 rounded-xl border-2 transition-all flex items-center justify-center ${
                isWishlisted 
                  ? 'border-neon-purple bg-neon-purple/20 text-neon-purple' 
                  : 'border-theme-border hover:border-theme-text text-theme-muted'
              }`}
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-neon-purple' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetail;