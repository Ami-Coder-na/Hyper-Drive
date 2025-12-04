import React, { useState } from 'react';
import { ChevronLeft, Upload, MapPin, DollarSign, Calendar, Tag, Image as ImageIcon, Zap, AlertCircle, Plus, X, Star } from 'lucide-react';
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
  });

  // State for multiple images
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRandomizeImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const newImage = `https://picsum.photos/seed/${randomId}/800/600`;
    setImages(prev => [...prev, newImage]);
  };

  const setAsCover = (index: number) => {
    setImages(prev => {
        const newImages = [...prev];
        const selected = newImages.splice(index, 1)[0];
        newImages.unshift(selected); // Move to start
        return newImages;
    });
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
        image: images.length > 0 ? images[0] : 'https://picsum.photos/800/600', // Use first image as cover
        gallery: images, // Store all images
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
    <div className="max-w-4xl mx-auto pb-24 animate-in slide-in-from-bottom-8 fade-in duration-500 px-4">
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
            
            {/* Gallery Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-theme-text flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-neon-blue" /> Vehicle Gallery
                        <span className="text-theme-muted font-normal text-xs ml-2">
                            ({images.length} selected) • First image will be the cover
                        </span>
                    </label>
                </div>

                {/* Image Input Bar */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddImage())}
                            placeholder="Paste image URL..."
                            className="w-full pl-10 pr-4 py-3 bg-theme-surface border border-theme-border rounded-xl text-sm text-theme-text focus:outline-none focus:border-neon-blue transition-all"
                        />
                        <Upload className="absolute left-3 top-3.5 w-4 h-4 text-theme-muted" />
                    </div>
                    <button 
                        type="button"
                        onClick={handleAddImage}
                        disabled={!imageUrlInput.trim()}
                        className="px-6 py-3 bg-theme-surface hover:bg-neon-blue hover:text-black border border-theme-border hover:border-transparent rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                    >
                        Add
                    </button>
                    <button 
                        type="button" 
                        onClick={handleRandomizeImage}
                        className="px-6 py-3 bg-theme-surface hover:bg-neon-purple hover:text-white border border-theme-border hover:border-transparent rounded-xl font-bold text-sm transition-all whitespace-nowrap"
                    >
                        + Random
                    </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 min-h-[150px] p-4 bg-theme-surface/30 rounded-2xl border-2 border-dashed border-theme-border">
                    {images.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center text-theme-muted py-8">
                            <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                            <span className="text-sm font-medium">No images added yet</span>
                            <span className="text-xs opacity-50">Add URLs or generate random images</span>
                        </div>
                    ) : (
                        images.map((img, index) => (
                            <div key={index} className="group relative aspect-video bg-theme-bg rounded-xl border border-theme-border overflow-hidden shadow-sm hover:border-neon-blue transition-all">
                                <img src={img} alt={`Upload ${index}`} className="w-full h-full object-cover" />
                                
                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button 
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {index !== 0 && (
                                        <button 
                                            type="button"
                                            onClick={() => setAsCover(index)}
                                            className="p-2 bg-white/20 text-white hover:bg-neon-blue hover:text-black rounded-full transition-colors"
                                            title="Set as Cover"
                                        >
                                            <Star className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Cover Badge */}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-neon-blue text-black text-[10px] font-bold rounded shadow-lg">
                                        COVER
                                    </div>
                                )}
                            </div>
                        ))
                    )}
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
                    disabled={isLoading || images.length === 0}
                    className="px-8 py-3 rounded-xl bg-neon-blue text-black font-bold shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
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