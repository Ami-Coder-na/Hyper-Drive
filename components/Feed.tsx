import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Heart, MessageCircle, Send, MoreVertical, Bookmark, Play, Plus, X, ChevronLeft, ChevronRight, Camera, Image as ImageIcon, Zap, Share2, AlertOctagon, Copy, Ban, UserPlus } from 'lucide-react';
import { POSTS, MOCK_USER, VEHICLES } from '../constants';

interface Story {
  id: string;
  user: string;
  avatar: string;
  image: string;
  isLive: boolean;
  time: string;
  isMine?: boolean;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

const Feed: React.FC = () => {
  // Local state to handle interactions
  const [posts, setPosts] = useState(POSTS.map(p => ({ 
    ...p, 
    isLiked: false, 
    isBookmarked: false,
    localComments: [] as Comment[] 
  })));
  
  // Interaction States
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [expandedCommentsId, setExpandedCommentsId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // Story State
  const [stories, setStories] = useState<Story[]>([
    { id: 's1', user: 'User_1', avatar: 'https://picsum.photos/seed/u1/100/100', image: 'https://picsum.photos/seed/story1/800/1200', isLive: true, time: '2h ago' },
    { id: 's2', user: 'User_2', avatar: 'https://picsum.photos/seed/u2/100/100', image: 'https://picsum.photos/seed/story2/800/1200', isLive: false, time: '4h ago' },
    { id: 's3', user: 'User_3', avatar: 'https://picsum.photos/seed/u3/100/100', image: 'https://picsum.photos/seed/story3/800/1200', isLive: false, time: '5h ago' },
    { id: 's4', user: 'User_4', avatar: 'https://picsum.photos/seed/u4/100/100', image: 'https://picsum.photos/seed/story4/800/1200', isLive: false, time: '6h ago' },
    { id: 's5', user: 'User_5', avatar: 'https://picsum.photos/seed/u5/100/100', image: 'https://picsum.photos/seed/story5/800/1200', isLive: false, time: '10h ago' },
  ]);

  const [viewingStoryIndex, setViewingStoryIndex] = useState<number | null>(null);
  const [storyProgress, setStoryProgress] = useState(0);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [newStoryImage, setNewStoryImage] = useState('');
  const [newStoryCaption, setNewStoryCaption] = useState('');

  // Story Viewer Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (viewingStoryIndex !== null) {
      setStoryProgress(0);
      interval = setInterval(() => {
        setStoryProgress(prev => {
          if (prev >= 100) {
            handleCloseStory();
            return 100;
          }
          return prev + 1; // Speed of story
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [viewingStoryIndex]);

  // --- Handlers ---

  const handleLike = (id: string) => {
    setPosts(current => current.map(post => {
      if (post.id === id) {
        return {
          ...post,
          isLiked: !post.isLiked,
          likes: post.isLiked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleBookmark = (id: string) => {
    setPosts(current => current.map(post => {
      if (post.id === id) {
        return { ...post, isBookmarked: !post.isBookmarked };
      }
      return post;
    }));
  };

  const handleShare = () => {
    alert("Link copied to holographic clipboard!");
  };

  const toggleComments = (id: string) => {
    if (expandedCommentsId === id) {
      setExpandedCommentsId(null);
    } else {
      setExpandedCommentsId(id);
    }
  };

  const handleSubmitComment = (id: string) => {
    if (!commentInput.trim()) return;
    
    setPosts(current => current.map(post => {
      if (post.id === id) {
        return {
          ...post,
          comments: post.comments + 1,
          localComments: [
            ...post.localComments,
            { id: Date.now().toString(), user: MOCK_USER.name, text: commentInput, timestamp: 'Just now' }
          ]
        };
      }
      return post;
    }));
    setCommentInput('');
  };

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(activeMenuId === id ? null : id);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  // Story Navigation
  const handleStoryClick = (index: number) => {
    setViewingStoryIndex(index);
  };

  const handleCloseStory = () => {
    setViewingStoryIndex(null);
    setStoryProgress(0);
  };

  const handleNextStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingStoryIndex !== null && viewingStoryIndex < stories.length - 1) {
        setViewingStoryIndex(viewingStoryIndex + 1);
    } else {
        handleCloseStory();
    }
  };

  const handlePrevStory = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewingStoryIndex !== null && viewingStoryIndex > 0) {
        setViewingStoryIndex(viewingStoryIndex - 1);
    }
  };

  // Story Upload Logic
  const handleGenerateRandomImage = () => {
    const randomId = Math.floor(Math.random() * 1000);
    setNewStoryImage(`https://picsum.photos/seed/${randomId}/800/1200`);
  };

  const handlePostStory = () => {
    if (!newStoryImage) return;

    const newStory: Story = {
      id: `s_new_${Date.now()}`,
      user: 'You',
      avatar: MOCK_USER.avatar,
      image: newStoryImage,
      isLive: false,
      time: 'Just now',
      isMine: true,
    };

    setStories(prev => [newStory, ...prev]);
    setIsUploading(false);
    setNewStoryImage('');
    setNewStoryCaption('');
  };

  // Mock Sidebar Data
  const friends = [
    { id: 1, name: 'Sarah Connor', handle: '@skynet_hunter', status: 'online', avatar: 'https://picsum.photos/seed/sarah/100/100' },
    { id: 2, name: 'K. Knight', handle: '@kitt_driver', status: 'offline', avatar: 'https://picsum.photos/seed/kitt/100/100' },
    { id: 3, name: 'Doc Brown', handle: '@time_traveler', status: 'away', avatar: 'https://picsum.photos/seed/doc/100/100' },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 animate-slide-up relative px-4 md:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* === MAIN FEED COLUMN (Left/Center) === */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* 1. Redesigned Story Section: "Holo-Nodes" */}
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-theme-border to-transparent" />
            <div className="flex gap-4 overflow-x-auto pb-6 pt-2 no-scrollbar">
                
                {/* Add Story Button */}
                <div 
                    className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group" 
                    onClick={() => setIsUploading(true)}
                >
                    <div className="w-[70px] h-[70px] relative">
                        <div className="absolute inset-0 bg-theme-surface rounded-xl border border-theme-border group-hover:border-neon-blue transition-colors rotate-3 group-hover:rotate-6" />
                        <div className="absolute inset-0 bg-theme-card rounded-xl border border-theme-border flex items-center justify-center -rotate-3 group-hover:-rotate-6 transition-transform z-10">
                            <Plus className="w-8 h-8 text-theme-muted group-hover:text-neon-blue transition-colors" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 z-20 bg-neon-blue text-black rounded-md p-0.5 shadow-lg">
                            <Plus className="w-3 h-3" />
                        </div>
                    </div>
                    <span className="text-xs font-bold text-theme-muted group-hover:text-theme-text transition-colors">Add Status</span>
                </div>

                {/* Story Items */}
                {stories.map((story, i) => (
                <div key={story.id} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group" onClick={() => handleStoryClick(i)}>
                    <div className="w-[70px] h-[70px] relative">
                        {/* Animated Border */}
                        <div className={`absolute -inset-1 rounded-xl bg-gradient-to-tr ${story.isLive ? 'from-red-500 to-orange-500' : 'from-neon-blue to-neon-purple'} opacity-70 blur-sm group-hover:opacity-100 transition-opacity animate-pulse-slow`} />
                        
                        {/* Image Container */}
                        <div className="absolute inset-0 bg-theme-bg rounded-xl p-[2px] overflow-hidden">
                            <img 
                                src={story.image} 
                                className="w-full h-full rounded-lg object-cover group-hover:scale-110 transition-transform duration-700"
                                alt="Story"
                            />
                        </div>

                        {/* Badge */}
                        {story.isLive && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border border-red-400 tracking-wider">
                                LIVE
                            </div>
                        )}
                        {story.isMine && (
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-neon-blue/90 text-black text-[8px] font-black px-1.5 py-0.5 rounded shadow-sm border border-neon-blue tracking-wider whitespace-nowrap">
                                YOU
                            </div>
                        )}
                    </div>
                    <span className="text-xs font-bold text-theme-text group-hover:text-neon-blue transition-colors truncate max-w-[70px]">{story.user}</span>
                </div>
                ))}
            </div>
          </div>

          {/* 2. Feed Posts */}
          {posts.map((post) => (
            <article key={post.id} className="bg-theme-card border border-theme-border rounded-3xl overflow-visible shadow-sm hover:shadow-[0_0_30px_rgba(0,0,0,0.1)] transition-shadow duration-300 relative">
              
              {/* Header */}
              <div className="p-4 flex justify-between items-center bg-theme-surface/30 backdrop-blur-sm rounded-t-3xl">
                <div className="flex items-center gap-3 cursor-pointer">
                  <div className="relative">
                     <img src={post.author.avatar} alt={post.author.handle} className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent hover:ring-neon-blue transition-all" />
                     {post.author.isVerified && <div className="absolute -bottom-1 -right-1 bg-theme-card rounded-full p-0.5"><Zap className="w-3 h-3 text-neon-blue fill-neon-blue" /></div>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-theme-text text-sm hover:underline">{post.author.name}</span>
                      <span className="text-xs text-theme-muted">• {post.timestamp}</span>
                    </div>
                    <div className="text-xs text-theme-muted">{post.author.handle}</div>
                  </div>
                </div>
                
                {/* 3-Dot Menu */}
                <div className="relative">
                  <button 
                    onClick={(e) => toggleMenu(e, post.id)}
                    className="text-theme-muted hover:text-theme-text p-2 rounded-full hover:bg-theme-surface transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {activeMenuId === post.id && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-theme-card border border-theme-border rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-theme-surface flex items-center gap-2 text-theme-text">
                         <Share2 className="w-4 h-4" /> Share to...
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-theme-surface flex items-center gap-2 text-theme-text">
                         <Copy className="w-4 h-4" /> Copy Link
                      </button>
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-theme-surface flex items-center gap-2 text-theme-text">
                         <Ban className="w-4 h-4" /> Not Interested
                      </button>
                      <div className="h-px bg-theme-border mx-2" />
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-red-500/10 text-red-500 flex items-center gap-2">
                         <AlertOctagon className="w-4 h-4" /> Report
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Media */}
              <div className="relative group cursor-pointer" onDoubleClick={() => handleLike(post.id)}>
                <div className="aspect-[4/5] bg-black relative overflow-hidden">
                    {post.image && (
                    <img src={post.image} alt="Content" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Heart Animation Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-300 ${post.isLiked ? 'scale-100 opacity-0' : 'scale-0 opacity-0'}`}>
                        <Heart className="w-24 h-24 text-white fill-white drop-shadow-[0_0_15px_rgba(255,0,153,0.8)]" />
                    </div>

                    {/* Reel Indicator */}
                    {post.type === 'REEL' && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                        <Play className="w-3 h-3 text-white fill-white" />
                        <span className="text-xs font-bold text-white">REEL</span>
                    </div>
                    )}
                </div>
              </div>

              {/* Actions Bar */}
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <button 
                        onClick={() => handleLike(post.id)}
                        className="group flex items-center gap-1 transition-transform active:scale-90"
                    >
                      <Heart className={`w-7 h-7 transition-colors ${post.isLiked ? 'text-neon-pink fill-neon-pink drop-shadow-[0_0_8px_rgba(255,0,153,0.6)]' : 'text-theme-text group-hover:text-neon-pink'}`} />
                    </button>
                    <button 
                        onClick={() => toggleComments(post.id)}
                        className="group flex items-center gap-1 transition-transform active:scale-90"
                    >
                      <MessageCircle className={`w-7 h-7 transition-transform group-hover:scale-110 ${expandedCommentsId === post.id ? 'text-neon-blue fill-neon-blue/20' : 'text-theme-text group-hover:text-neon-blue'}`} />
                    </button>
                    <button 
                        onClick={handleShare}
                        className="group flex items-center gap-1 transition-transform active:scale-90"
                    >
                      <Send className="w-7 h-7 text-theme-text group-hover:text-neon-green group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                  <button 
                    onClick={() => handleBookmark(post.id)}
                    className="transition-transform active:scale-90"
                  >
                     <Bookmark className={`w-6 h-6 transition-colors ${post.isBookmarked ? 'text-neon-purple fill-neon-purple' : 'text-theme-text hover:text-neon-purple'}`} />
                  </button>
                </div>

                {/* Content info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-theme-text">
                     <span>{post.likes.toLocaleString()} likes</span>
                  </div>
                  
                  <div className="text-sm text-theme-text leading-relaxed">
                    <span className="font-bold mr-2 hover:underline cursor-pointer">{post.author.handle}</span>
                    <span className="text-theme-text/90">{post.content}</span>
                  </div>

                  <button 
                    onClick={() => toggleComments(post.id)} 
                    className="text-theme-muted text-sm hover:text-theme-text transition-colors"
                  >
                    {expandedCommentsId === post.id ? 'Hide comments' : `View all ${post.comments} comments`}
                  </button>

                  {/* Expanded Comments Section */}
                  {expandedCommentsId === post.id && (
                    <div className="pt-2 animate-in fade-in slide-in-from-top-2">
                       <div className="space-y-3 mb-4 pl-2 border-l-2 border-theme-border/50 max-h-40 overflow-y-auto custom-scrollbar">
                          {/* Mock Comments */}
                          <div className="text-sm">
                             <span className="font-bold mr-2">@turbo_lover</span>
                             <span className="text-theme-text/80">That setup is insane! 🤯</span>
                          </div>
                          <div className="text-sm">
                             <span className="font-bold mr-2">@drift_queen</span>
                             <span className="text-theme-text/80">Need a race asap?</span>
                          </div>
                          {/* Local New Comments */}
                          {post.localComments.map((c) => (
                              <div key={c.id} className="text-sm animate-in fade-in">
                                <span className="font-bold mr-2 text-neon-blue">You</span>
                                <span className="text-theme-text/80">{c.text}</span>
                              </div>
                          ))}
                       </div>
                    </div>
                  )}
                  
                  {/* Comment Input */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-8 h-8 rounded-full bg-theme-surface border border-theme-border overflow-hidden shrink-0">
                         {/* Current User Avatar */}
                         <img src={MOCK_USER.avatar} alt="Me" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 relative">
                        <input 
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment(post.id)}
                            placeholder="Add a comment..." 
                            className="w-full bg-theme-surface rounded-full px-4 py-2 text-xs text-theme-text placeholder:text-theme-muted focus:outline-none focus:ring-1 focus:ring-neon-blue transition-all"
                        />
                    </div>
                    <button 
                        onClick={() => handleSubmitComment(post.id)}
                        disabled={!commentInput.trim()}
                        className="text-neon-blue text-xs font-bold hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* === RIGHT SIDEBAR (Desktop Only) === */}
        <div className="hidden lg:block lg:col-span-4 space-y-8 h-fit sticky top-28">
            
            {/* 1. Trending Vehicles (Ads) */}
            <div className="glass rounded-3xl p-6 border border-theme-border relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 relative z-10">
                    <h3 className="font-display font-bold text-lg text-theme-text">Trending Market</h3>
                    <span className="text-[10px] font-bold bg-neon-purple/20 text-neon-purple px-2 py-0.5 rounded border border-neon-purple/20">AD</span>
                </div>

                <div className="space-y-4 relative z-10">
                    {VEHICLES.slice(0, 2).map((vehicle) => (
                        <div key={vehicle.id} className="group cursor-pointer bg-theme-bg/50 hover:bg-theme-surface rounded-xl p-3 flex gap-3 transition-colors border border-transparent hover:border-neon-blue/30">
                            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                <img src={vehicle.image} className="w-full h-full object-cover" alt={vehicle.model} />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-bold text-sm text-theme-text truncate group-hover:text-neon-blue transition-colors">{vehicle.model}</h4>
                                <p className="text-xs text-theme-muted truncate">{vehicle.make} • {vehicle.year}</p>
                                <p className="text-sm font-bold text-neon-green mt-1">${vehicle.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-neon-purple/10 rounded-full blur-2xl" />
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
            </div>

            {/* 2. Neural Grid (Friends/Suggestions) */}
            <div className="glass rounded-3xl p-6 border border-theme-border">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display font-bold text-lg text-theme-text">Neural Grid</h3>
                    <button className="text-xs text-neon-blue hover:underline">See All</button>
                </div>

                <div className="space-y-4">
                    {friends.map((friend) => (
                        <div key={friend.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={friend.avatar} className="w-10 h-10 rounded-full object-cover border border-theme-border" alt={friend.name} />
                                    <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-theme-card ${
                                        friend.status === 'online' ? 'bg-neon-green' : 
                                        friend.status === 'away' ? 'bg-yellow-500' : 'bg-theme-muted'
                                    }`} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-theme-text group-hover:text-neon-blue transition-colors">{friend.name}</h4>
                                    <p className="text-xs text-theme-muted">{friend.handle}</p>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-theme-surface text-theme-muted hover:text-neon-blue transition-colors">
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-theme-muted px-2">
                <a href="#" className="hover:underline">About</a>
                <a href="#" className="hover:underline">Help</a>
                <a href="#" className="hover:underline">API</a>
                <a href="#" className="hover:underline">Privacy</a>
                <a href="#" className="hover:underline">Terms</a>
                <a href="#" className="hover:underline">Locations</a>
                <span className="w-full mt-2 opacity-50">© 2025 HYPERDRIVE INC.</span>
            </div>

        </div>

      </div>

      {/* 3. Story Viewer Modal - Using Portal to break out of any parent transforms */}
      {viewingStoryIndex !== null && createPortal(
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center animate-in fade-in duration-200">
            {/* Progress Bar */}
            <div className="absolute top-4 left-4 right-4 flex gap-1 z-20">
                <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${storyProgress}%` }}
                    />
                </div>
            </div>

            {/* Header */}
            <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20">
                <div className="flex items-center gap-3">
                    <img src={stories[viewingStoryIndex].avatar} className="w-8 h-8 rounded-full border border-white" alt="Avatar" />
                    <span className="text-white font-bold text-sm">{stories[viewingStoryIndex].user}</span>
                    <span className="text-white/60 text-xs">{stories[viewingStoryIndex].time}</span>
                </div>
                <button onClick={handleCloseStory} className="text-white p-2 hover:bg-white/10 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Content Container - Full Height on Mobile */}
            <div className="w-full h-[100dvh] md:h-[85vh] md:w-[50vh] relative bg-black md:rounded-3xl overflow-hidden shadow-2xl md:border border-white/10" onClick={handleNextStory}>
                <img 
                    src={stories[viewingStoryIndex].image} 
                    className="w-full h-full object-cover"
                    alt="Story" 
                />
                
                {/* Navigation Areas */}
                <div className="absolute inset-y-0 left-0 w-1/4 z-10" onClick={handlePrevStory} />
                
                {/* Footer Input */}
                <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 md:pb-4 bg-gradient-to-t from-black/90 to-transparent flex gap-3 items-center z-20" onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="text" 
                        placeholder="Send message..." 
                        className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/60 focus:outline-none focus:border-white/50 backdrop-blur-md"
                    />
                    <button className="p-2 rounded-full text-white hover:bg-white/10">
                        <Heart className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full text-white hover:bg-white/10">
                        <Send className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Desktop Nav Arrows */}
            <button 
                onClick={handlePrevStory}
                className={`hidden md:block absolute left-4 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors ${viewingStoryIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={viewingStoryIndex === 0}
            >
                <ChevronLeft className="w-8 h-8" />
            </button>
            <button 
                onClick={(e) => { e.stopPropagation(); if(viewingStoryIndex < stories.length - 1) setViewingStoryIndex(viewingStoryIndex + 1); else handleCloseStory(); }}
                className="hidden md:block absolute right-4 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
            >
                <ChevronRight className="w-8 h-8" />
            </button>
        </div>,
        document.body
      )}

      {/* 4. Story Uploader Modal - Using Portal */}
      {isUploading && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-theme-card border border-theme-border w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
                <button 
                    onClick={() => { setIsUploading(false); setNewStoryImage(''); }}
                    className="absolute top-4 right-4 text-theme-muted hover:text-theme-text"
                >
                    <X className="w-6 h-6" />
                </button>
                
                <h2 className="text-2xl font-display font-bold text-theme-text mb-6">New Status</h2>
                
                <div className="space-y-4">
                    <div className="relative aspect-[3/4] bg-theme-bg rounded-2xl border-2 border-dashed border-theme-border overflow-hidden group">
                        {newStoryImage ? (
                            <img src={newStoryImage} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-theme-muted">
                                <ImageIcon className="w-12 h-12 mb-3 opacity-30" />
                                <span className="text-sm font-bold">No Image Selected</span>
                            </div>
                        )}
                        
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                             <button 
                                onClick={handleGenerateRandomImage}
                                className="px-4 py-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20 hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-all flex items-center gap-2"
                             >
                                <Camera className="w-4 h-4" /> Camera
                             </button>
                        </div>
                    </div>
                    
                    <input 
                        type="text" 
                        placeholder="Add a caption..." 
                        value={newStoryCaption}
                        onChange={(e) => setNewStoryCaption(e.target.value)}
                        className="w-full bg-theme-surface border border-theme-border rounded-xl px-4 py-3 text-theme-text focus:outline-none focus:border-neon-blue transition-colors"
                    />
                    
                    <button 
                        onClick={handlePostStory}
                        disabled={!newStoryImage}
                        className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Share to Feed
                    </button>
                </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Feed;