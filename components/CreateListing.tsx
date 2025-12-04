import React, { useState } from 'react';
import { ChevronLeft, Upload, MapPin, DollarSign, Calendar, Tag, Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';
import { Vehicle, User } from '../types';

interface CreateListingProps {
  onCancel: () => void;
  onSubmit: (vehicle: Vehicle) => void;
  user: User;
}

const CreateListing: React.FC<CreateListingProps> = ({ onCancel, onSubmit, user }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    type: 'CAR' as const,
    location: '',
    description: '',
    image: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomizeImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setFormData(prev => ({
      ...prev,
      image: `https://picsum.photos/seed/${randomId}/800/600`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      const newVehicle: Vehicle = {
        id: `v${Date.now()}`,
        make: formData.make,
        model: formData.model,
        year: Number(formData.year),
        price: Number(formData.price),
        image: formData.image || 'https://picsum.photos/800/600',
        type: formData.type as any,
        location: formData.location,
        description: formData.description,
        seller: user,
        stats: {
          speed: Math.floor(Math.random() * 40) + 60,
          handling: Math.floor(Math.random() * 40) + 60,
          range: Math.floor(Math.random() * 40) + 60,
        },
        history: [
            { date: '2024-01', price: Number(formData.price) * 1.1 },
            { date: '2024-05', price: Number(formData.price) },
        ]
      };

      onSubmit(newVehicle);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 animate-in slide-in-from-bottom-8 fade-in duration-500">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={onCancel}
          className="p-2 rounded-full bg-theme-surface hover:bg-theme-border text-theme-text transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-3xl font-display font-bold text-theme-text">Create Listing</h1>
           <p className="text-theme-muted text-sm">List your vehicle on the HyperDrive marketplace</p>
        </div>
      </div>

      <div className="bg-theme-card border border-theme-border rounded-3xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Image Section */}
            <div className="space-y-4">
                <label className="block text-sm font-bold text-theme-text">Vehicle Image</label>
                <div className="relative aspect-video bg-theme-bg rounded-2xl border-2 border-dashed border-theme-border hover:border-neon-blue transition-colors overflow-hidden group">
                    {formData.image ? (
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-theme-muted">
                            <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                            <span className="text-sm font-medium">Preview will appear here</span>
                        </div>
                    )}
                    
                    <div className="absolute bottom-4 right-4 flex gap-2">
                         <button 
                            type="button" 
                            onClick={handleRandomizeImage}
                            className="px-4 py-2 bg-theme-card/80 backdrop-blur text-xs font-bold text-theme-text rounded-lg border border-theme-border hover:text-neon-blue transition-colors"
                        >
                            Generate Random
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                     <div className="relative flex-1">
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Paste image URL..."
                            className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                        />
                        <Upload className="absolute left-3 top-3.5 w-4 h-4 text-theme-muted" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Make</label>
                    <input
                        required
                        type="text"
                        name="make"
                        value={formData.make}
                        onChange={handleChange}
                        placeholder="e.g. Tesla"
                        className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Model</label>
                    <input
                        required
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        placeholder="e.g. Model S Plaid"
                        className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                    />
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Type</label>
                    <div className="relative">
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all appearance-none"
                        >
                            <option value="CAR">Car</option>
                            <option value="BIKE">Bike</option>
                            <option value="TRUCK">Truck</option>
                            <option value="EV">Electric Vehicle</option>
                            <option value="PART">Part</option>
                        </select>
                        <Tag className="absolute right-4 top-3.5 w-4 h-4 text-theme-muted pointer-events-none" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Year</label>
                    <div className="relative">
                         <input
                            required
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            min="1900"
                            max="2100"
                            className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                        />
                        <Calendar className="absolute left-3 top-3.5 w-4 h-4 text-theme-muted" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Price</label>
                    <div className="relative">
                        <input
                            required
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            min="0"
                            className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                        />
                        <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-theme-muted" />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Location</label>
                    <div className="relative">
                        <input
                            required
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                        />
                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-theme-muted" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-xs font-bold text-theme-muted uppercase tracking-wider">Description</label>
                <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the condition, features, and history..."
                    className="w-full px-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text focus:outline-none focus:border-neon-blue transition-all resize-none"
                />
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-sm text-blue-200">
                    <span className="font-bold block text-blue-100 mb-1">AI Verification Pending</span>
                    Your listing will undergo automated analysis for price accuracy and fraud detection upon submission.
                </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-theme-border">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 rounded-xl font-bold text-theme-muted hover:bg-theme-surface transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 rounded-xl bg-neon-blue text-black font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {isLoading ? (
                        <>Processing...</>
                    ) : (
                        <>
                           <Zap className="w-4 h-4 fill-black" /> Publish Listing
                        </>
                    )}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;