import React, { useState } from 'react';
import { Moon, Sun, Bell, Shield, LogOut, User, Smartphone, Mail, Lock, Eye, ChevronRight, Laptop, Globe } from 'lucide-react';
import { User as UserType } from '../types';

interface SettingsProps {
  user: UserType;
  isDark: boolean;
  toggleTheme: () => void;
  onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ user, isDark, toggleTheme, onLogout }) => {
  const [notifications, setNotifications] = useState({ push: true, email: false, price: true });
  const [privacy, setPrivacy] = useState({ public: true, online: false });

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-11 h-6 rounded-full transition-colors duration-300 relative flex items-center px-0.5 ${
        active ? 'bg-neon-blue' : 'bg-theme-muted/30'
      }`}
    >
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
        active ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24 animate-slide-up px-4">
      <div className="flex items-end gap-4 mb-8">
        <h1 className="text-4xl font-display font-bold text-theme-text">Settings</h1>
        <span className="text-theme-muted mb-1.5 pb-1 border-b-2 border-neon-blue">Preferences</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Navigation-like or summary */}
          <div className="space-y-6">
             {/* Profile Card Mini */}
             <div className="glass rounded-2xl p-6 text-center">
                <div className="w-20 h-20 mx-auto rounded-full p-1 bg-gradient-to-tr from-neon-blue to-neon-purple mb-3">
                   <img src={user.avatar} className="w-full h-full rounded-full object-cover border-2 border-theme-bg" alt="avatar" />
                </div>
                <h3 className="font-bold text-theme-text">{user.name}</h3>
                <p className="text-xs text-theme-muted mb-4">{user.handle}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-theme-surface rounded-full text-xs font-bold text-theme-text border border-theme-border">
                    <Shield className="w-3 h-3 text-neon-green" /> Verified
                </div>
             </div>

             <div className="glass rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-theme-muted">Storage Used</span>
                    <span className="text-theme-text font-bold">45%</span>
                </div>
                <div className="w-full h-2 bg-theme-surface rounded-full overflow-hidden">
                    <div className="h-full w-[45%] bg-neon-purple rounded-full" />
                </div>
                <button className="w-full py-2 border border-theme-border rounded-lg text-xs font-bold text-theme-text hover:bg-theme-surface transition-colors">
                    Manage Data
                </button>
             </div>
          </div>

          {/* Right Column - Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Appearance */}
            <div className="bg-theme-card border border-theme-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-theme-border bg-theme-surface/30 flex items-center gap-3">
                    <div className="p-2 bg-neon-blue/10 rounded-lg text-neon-blue"><Laptop className="w-5 h-5" /></div>
                    <h3 className="font-bold text-theme-text">Appearance</h3>
                </div>
                <div className="p-6 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-theme-text">Interface Theme</p>
                        <p className="text-sm text-theme-muted">Customize your visual experience</p>
                    </div>
                    <div className="flex bg-theme-surface p-1 rounded-xl border border-theme-border">
                        <button onClick={() => isDark && toggleTheme()} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${!isDark ? 'bg-white shadow text-black font-bold' : 'text-theme-muted'}`}>
                            <Sun className="w-4 h-4" /> Light
                        </button>
                        <button onClick={() => !isDark && toggleTheme()} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDark ? 'bg-slate-700 shadow text-white font-bold' : 'text-theme-muted'}`}>
                            <Moon className="w-4 h-4" /> Dark
                        </button>
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-theme-card border border-theme-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-theme-border bg-theme-surface/30 flex items-center gap-3">
                    <div className="p-2 bg-neon-purple/10 rounded-lg text-neon-purple"><Bell className="w-5 h-5" /></div>
                    <h3 className="font-bold text-theme-text">Notifications</h3>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <Smartphone className="w-5 h-5 text-theme-muted mt-0.5" />
                            <div>
                                <p className="font-medium text-theme-text text-sm">Push Alerts</p>
                                <p className="text-xs text-theme-muted">Auctions, messages, and price drops</p>
                            </div>
                        </div>
                        <Toggle active={notifications.push} onToggle={() => setNotifications(p => ({...p, push: !p.push}))} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <Mail className="w-5 h-5 text-theme-muted mt-0.5" />
                            <div>
                                <p className="font-medium text-theme-text text-sm">Email Digest</p>
                                <p className="text-xs text-theme-muted">Weekly performance summaries</p>
                            </div>
                        </div>
                        <Toggle active={notifications.email} onToggle={() => setNotifications(p => ({...p, email: !p.email}))} />
                    </div>
                </div>
            </div>

            {/* Privacy */}
            <div className="bg-theme-card border border-theme-border rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-theme-border bg-theme-surface/30 flex items-center gap-3">
                    <div className="p-2 bg-neon-green/10 rounded-lg text-neon-green"><Lock className="w-5 h-5" /></div>
                    <h3 className="font-bold text-theme-text">Privacy & Security</h3>
                </div>
                <div className="p-6 space-y-6">
                     <div className="flex items-center justify-between">
                        <div className="flex gap-3">
                            <Globe className="w-5 h-5 text-theme-muted mt-0.5" />
                            <div>
                                <p className="font-medium text-theme-text text-sm">Public Profile</p>
                                <p className="text-xs text-theme-muted">Make your garage visible to everyone</p>
                            </div>
                        </div>
                        <Toggle active={privacy.public} onToggle={() => setPrivacy(p => ({...p, public: !p.public}))} />
                    </div>
                </div>
            </div>

            <button onClick={onLogout} className="w-full py-4 rounded-2xl border border-red-500/30 text-red-500 font-bold hover:bg-red-500/5 transition-colors flex items-center justify-center gap-2">
                <LogOut className="w-5 h-5" />
                Disconnect Session
            </button>
            
          </div>
      </div>
    </div>
  );
};

export default Settings;