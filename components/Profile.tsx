import React, { useState } from 'react';
import { User, Vehicle, SocialPost } from '../types';
import { POSTS } from '../constants';
import { MapPin, Calendar, Link as LinkIcon, Edit3, Heart, ShoppingBag, Grid, Star, Settings, Camera, Share2, MessageCircle, MoreHorizontal, Shield, Zap, Package } from 'lucide-react';

interface ProfileProps {
  user: User;
  currentUser: User;
  vehicles: Vehicle[];
  wishlist: Set<string>;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onToggleWishlist: (id: string) => void;
  onCreateListing: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, currentUser, vehicles, wishlist, onSelectVehicle, onToggleWishlist, onCreateListing }) => {
  const [activeTab, setActiveTab] = useState<'GARAGE' | 'SHOWROOM' | 'POSTS' | 'REVIEWS'>('GARAGE');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user.name,
    bio: 'Night City Drifter | EV Enthusiast | Tech Hunter',
    location: 'Neo Tokyo, District 9',
    website: 'hyperdrive.io/u/drift',
    coverImage: 'https://picsum.photos/seed/cybercity/1200/400'
  });

  const isOwnProfile = user.id === currentUser.id;
  
  // Derived Data
  const wishlistedVehicles = vehicles.filter(v => wishlist.has(v.id));
  const myListings = vehicles.filter(v => v.seller.id === user.id);
  const myPosts = POSTS.filter(p => p.author.id === user.id);

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="bg-theme-card border border-theme-border rounded-2xl p-4 flex items-center gap-4 flex-1 shadow-sm hover:border-neon-blue transition-colors group">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
        <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <div className="text-2xl font-bold text-theme-text font-display">{value}</div>
        <div className="text-xs text-theme-muted font-bold tracking-wider uppercase">{label}</div>
      </div>
    </div>
  );

  return (
    <div className="pb-24 animate-in fade-in slide-in-from-bottom-4">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden group">
        <img src={profileData.coverImage} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-theme-bg via-theme-bg/20 to-transparent" />
        
        {isOwnProfile && (
           <button className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white p-2 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
             <Camera className="w-5 h-5" />
           </button>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
            <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl p-1 bg-gradient-to-br from-neon-blue to-neon-purple shadow-[0_0_40px_rgba(0,243,255,0.3)]">
                    <img src={user.avatar} className="w-full h-full rounded-[20px] object-cover border-4 border-theme-bg" alt="Profile" />
                </div>
                {isOwnProfile && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-black/60 backdrop-blur text-white p-2 rounded-full">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="absolute -bottom-3 -right-3 bg-theme-bg p-1.5 rounded-full">
                    <div className="bg-neon-green text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-neon-green flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" /> LVL 42
                    </div>
                </div>
            </div>
            
            <div className="flex-1 pb-2 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                    <h1 className="text-3xl md:text-4xl font-display font-bold text-theme-text">{profileData.name}</h1>
                    {user.isVerified && <Shield className="w-5 h-5 text-neon-blue fill-neon-blue/20 inline-block" />}
                </div>
                <p className="text-neon-blue font-mono text-sm mb-3">{user.handle}</p>
                <p className="text-theme-muted max-w-lg mx-auto md:mx-0 leading-relaxed mb-4">{profileData.bio}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-theme-muted">
                    <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" /> {profileData.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <LinkIcon className="w-4 h-4" /> <a href="#" className="hover:text-neon-blue transition-colors">{profileData.website}</a>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Joined Sept 2077
                    </div>
                </div>
            </div>

            <div className="flex gap-3 mb-2 w-full md:w-auto">
                {isOwnProfile ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 md:flex-none px-6 py-3 bg-theme-surface border border-theme-border rounded-xl font-bold text-theme-text hover:border-neon-blue hover:text-neon-blue transition-all flex items-center justify-center gap-2"
                    >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                    </button>
                ) : (
                    <button className="flex-1 md:flex-none px-6 py-3 bg-neon-blue text-black rounded-xl font-bold hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                        Follow
                    </button>
                )}
                <button className="p-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text hover:text-neon-blue transition-colors">
                    <Share2 className="w-5 h-5" />
                </button>
                {!isOwnProfile && (
                     <button className="p-3 bg-theme-surface border border-theme-border rounded-xl text-theme-text hover:text-neon-blue transition-colors">
                        <MessageCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <StatCard label="Reputation" value="4.9/5.0" icon={Star} color="bg-yellow-500 text-yellow-500" />
            <StatCard label="Followers" value="12.4K" icon={Heart} color="bg-neon-pink text-neon-pink" />
            <StatCard label="Sales" value="84" icon={ShoppingBag} color="bg-neon-green text-neon-green" />
            <StatCard label="Listings" value={myListings.length} icon={Package} color="bg-neon-blue text-neon-blue" />
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-theme-border mb-8 sticky top-[88px] bg-theme-bg/95 backdrop-blur z-20">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
                {[
                    { id: 'GARAGE', label: 'Garage', icon: Heart, count: wishlistedVehicles.length },
                    { id: 'SHOWROOM', label: 'Showroom', icon: Grid, count: myListings.length },
                    { id: 'POSTS', label: 'Transmission', icon: Share2, count: myPosts.length },
                    { id: 'REVIEWS', label: 'Reputation', icon: Star, count: 128 },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`pb-4 flex items-center gap-2 min-w-max transition-all relative ${
                            activeTab === tab.id ? 'text-neon-blue' : 'text-theme-muted hover:text-theme-text'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span className="font-bold text-sm tracking-wide">{tab.label}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${activeTab === tab.id ? 'bg-neon-blue/20 text-neon-blue' : 'bg-theme-surface text-theme-muted'}`}>
                            {tab.count}
                        </span>
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
                        )}
                    </button>
                ))}
            </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
            {activeTab === 'GARAGE' && (
                wishlistedVehicles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        {wishlistedVehicles.map(vehicle => (
                             <div
                                key={vehicle.id}
                                onClick={() => onSelectVehicle(vehicle)}
                                className="group bg-theme-card border border-theme-border rounded-2xl overflow-hidden cursor-pointer hover:border-neon-purple transition-all hover:shadow-[0_0_20px_rgba(188,19,254,0.15)]"
                              >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                  <div className="absolute top-2 right-2">
                                      <button 
                                        onClick={(e) => { e.stopPropagation(); onToggleWishlist(vehicle.id); }}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-full text-neon-purple hover:bg-neon-purple hover:text-white transition-colors"
                                      >
                                          <Heart className="w-4 h-4 fill-current" />
                                      </button>
                                  </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-theme-text text-lg">{vehicle.model}</h3>
                                    <p className="text-sm text-theme-muted mb-2">{vehicle.make} • {vehicle.year}</p>
                                    <p className="text-xl font-bold text-neon-blue">${vehicle.price.toLocaleString()}</p>
                                </div>
                              </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-theme-card/30 rounded-3xl border border-dashed border-theme-border">
                        <div className="w-16 h-16 mx-auto bg-theme-surface rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-8 h-8 text-theme-muted opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-theme-text">Your garage is empty</h3>
                        <p className="text-theme-muted">Start saving items from the marketplace.</p>
                    </div>
                )
            )}

            {activeTab === 'SHOWROOM' && (
                 myListings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
                        {myListings.map(vehicle => (
                             <div
                                key={vehicle.id}
                                onClick={() => onSelectVehicle(vehicle)}
                                className="group bg-theme-card border border-theme-border rounded-2xl overflow-hidden cursor-pointer hover:border-neon-blue transition-all"
                              >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                  <img src={vehicle.image} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                  <div className="absolute top-2 left-2 bg-neon-blue text-black text-[10px] font-bold px-2 py-1 rounded">
                                      LISTED
                                  </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-theme-text text-lg">{vehicle.model}</h3>
                                    <p className="text-sm text-theme-muted mb-2">{vehicle.make} • {vehicle.year}</p>
                                    <div className="flex justify-between items-center">
                                        <p className="text-xl font-bold text-theme-text">${vehicle.price.toLocaleString()}</p>
                                        <button className="text-xs font-bold text-neon-blue hover:underline">Manage</button>
                                    </div>
                                </div>
                              </div>
                        ))}
                         {/* Add New Card */}
                         <div 
                            onClick={onCreateListing}
                            className="bg-theme-surface/30 border-2 border-dashed border-theme-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-neon-blue hover:bg-neon-blue/5 transition-all p-8 min-h-[300px] group"
                         >
                            <div className="w-16 h-16 rounded-full bg-theme-surface flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Package className="w-8 h-8 text-theme-muted group-hover:text-neon-blue" />
                            </div>
                            <h3 className="font-bold text-theme-text">List New Vehicle</h3>
                            <p className="text-sm text-theme-muted text-center mt-2">Sell your ride on the grid</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-theme-card/30 rounded-3xl border border-dashed border-theme-border">
                        <div className="w-16 h-16 mx-auto bg-theme-surface rounded-full flex items-center justify-center mb-4">
                            <Grid className="w-8 h-8 text-theme-muted opacity-50" />
                        </div>
                        <h3 className="text-lg font-bold text-theme-text">No active listings</h3>
                        <p className="text-theme-muted mb-6">You haven't listed any vehicles for sale yet.</p>
                        <button 
                            onClick={onCreateListing}
                            className="px-6 py-2 bg-neon-blue text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
                        >
                            Create Listing
                        </button>
                    </div>
                )
            )}

            {activeTab === 'POSTS' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                    {myPosts.length > 0 ? myPosts.map(post => (
                        <div key={post.id} className="bg-theme-card border border-theme-border rounded-2xl overflow-hidden flex flex-col md:flex-row">
                             <div className="md:w-1/3 h-48 md:h-auto relative">
                                <img src={post.image} className="w-full h-full object-cover" alt="Post" />
                                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur rounded p-1 text-white">
                                    <Heart className="w-3 h-3 fill-current" />
                                </div>
                             </div>
                             <div className="p-4 flex-1 flex flex-col justify-between">
                                 <div>
                                    <p className="text-theme-text text-sm line-clamp-3 mb-2">{post.content}</p>
                                    <p className="text-[10px] text-theme-muted">{post.timestamp}</p>
                                 </div>
                                 <div className="flex items-center gap-4 mt-4 text-xs font-bold text-theme-muted">
                                     <span className="flex items-center gap-1 hover:text-neon-pink transition-colors cursor-pointer"><Heart className="w-3 h-3" /> {post.likes}</span>
                                     <span className="flex items-center gap-1 hover:text-neon-blue transition-colors cursor-pointer"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                                     <span className="ml-auto hover:text-white cursor-pointer"><MoreHorizontal className="w-4 h-4" /></span>
                                 </div>
                             </div>
                        </div>
                    )) : (
                        <div className="col-span-full text-center py-20 bg-theme-card/30 rounded-3xl border border-dashed border-theme-border">
                            <h3 className="text-lg font-bold text-theme-text">No transmissions yet</h3>
                            <p className="text-theme-muted">Share your journey with the network.</p>
                        </div>
                    )}
                 </div>
            )}
            
            {activeTab === 'REVIEWS' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                     <div className="bg-theme-card border border-theme-border rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                            <h3 className="font-bold text-theme-text">Latest Ratings</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {[1, 2, 3].map((r) => (
                                <div key={r} className="border-b border-theme-border/50 pb-4 last:border-0">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-theme-surface overflow-hidden">
                                                <img src={`https://picsum.photos/seed/${r+100}/100/100`} alt="User" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-theme-text">Cyber_Buyer_99</p>
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs text-theme-muted">2 days ago</span>
                                    </div>
                                    <p className="text-sm text-theme-muted">Smooth transaction. The vehicle was exactly as described. Highly recommended pilot!</p>
                                </div>
                            ))}
                        </div>
                     </div>
                </div>
            )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
             <div className="bg-theme-card border border-theme-border w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
                <button 
                    onClick={() => setIsEditing(false)}
                    className="absolute top-4 right-4 p-2 text-theme-muted hover:text-theme-text hover:bg-theme-surface rounded-full transition-colors"
                >
                    <Grid className="w-5 h-5 rotate-45" /> {/* Using Grid as close icon approximation or just import X */}
                </button>
                <h2 className="text-2xl font-display font-bold text-theme-text mb-6">Edit Identity</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-theme-muted uppercase mb-1 block">Display Name</label>
                        <input 
                            type="text" 
                            value={profileData.name} 
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full bg-theme-surface border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-neon-blue outline-none"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-theme-muted uppercase mb-1 block">Bio Signal</label>
                        <textarea 
                            rows={3}
                            value={profileData.bio} 
                            onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                            className="w-full bg-theme-surface border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-neon-blue outline-none resize-none"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-theme-muted uppercase mb-1 block">Location</label>
                            <input 
                                type="text" 
                                value={profileData.location} 
                                onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                                className="w-full bg-theme-surface border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-neon-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-theme-muted uppercase mb-1 block">Website</label>
                            <input 
                                type="text" 
                                value={profileData.website} 
                                onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                                className="w-full bg-theme-surface border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:border-neon-blue outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 rounded-xl border border-theme-border text-theme-muted font-bold hover:bg-theme-surface"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 rounded-xl bg-neon-blue text-black font-bold hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,243,255,0.3)]"
                    >
                        Save Changes
                    </button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default Profile;