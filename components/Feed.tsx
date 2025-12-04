import React from 'react';
import { Heart, MessageCircle, Send, MoreVertical, Bookmark, Play, Zap } from 'lucide-react';
import { POSTS } from '../constants';

const Feed: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto space-y-8 pb-20 animate-slide-up">
      {/* Story Ring - Modernized */}
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 no-scrollbar px-2">
         {/* My Story Add */}
         <div className="flex flex-col items-center gap-2 cursor-pointer shrink-0">
             <div className="w-16 h-16 rounded-full border-2 border-dashed border-theme-muted p-1 flex items-center justify-center relative">
                 <div className="w-full h-full bg-theme-surface rounded-full flex items-center justify-center">
                    <span className="text-2xl text-theme-muted font-light">+</span>
                 </div>
                 <div className="absolute bottom-0 right-0 w-5 h-5 bg-neon-blue rounded-full border-2 border-theme-bg flex items-center justify-center">
                    <span className="text-black text-[10px] font-bold">+</span>
                 </div>
             </div>
             <span className="text-xs font-medium text-theme-muted">You</span>
         </div>

        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col items-center gap-2 cursor-pointer shrink-0 group">
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-neon-blue to-neon-purple group-hover:from-transparent group-hover:to-transparent">
                    <div className="w-full h-full rounded-full bg-theme-bg p-[3px]">
                        <img 
                        src={`https://picsum.photos/seed/story${i}/100/100`} 
                        className="w-full h-full rounded-full object-cover"
                        alt="Story"
                        />
                    </div>
                </div>
            </div>
            <span className="text-xs font-medium text-theme-text group-hover:text-neon-blue transition-colors">User_{i}</span>
          </div>
        ))}
      </div>

      {POSTS.map((post) => (
        <article key={post.id} className="bg-theme-card border border-theme-border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          {/* Header */}
          <div className="p-4 flex justify-between items-center bg-theme-surface/30 backdrop-blur-sm">
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
            <button className="text-theme-muted hover:text-theme-text p-2 rounded-full hover:bg-theme-surface transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Media */}
          <div className="relative group cursor-pointer">
            <div className="aspect-[4/5] bg-black relative overflow-hidden">
                {post.image && (
                <img src={post.image} alt="Content" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                
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
                <button className="group flex items-center gap-1">
                  <Heart className="w-7 h-7 text-theme-text group-hover:text-neon-purple group-hover:scale-110 transition-transform" />
                </button>
                <button className="group flex items-center gap-1">
                  <MessageCircle className="w-7 h-7 text-theme-text group-hover:text-neon-blue group-hover:scale-110 transition-transform" />
                </button>
                <button className="group flex items-center gap-1">
                  <Send className="w-7 h-7 text-theme-text group-hover:text-neon-green group-hover:rotate-12 transition-transform" />
                </button>
              </div>
              <button>
                 <Bookmark className="w-6 h-6 text-theme-text hover:fill-theme-text transition-colors" />
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

              <button className="text-theme-muted text-sm hover:text-theme-text transition-colors">
                View all {post.comments} comments
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default Feed;