import React, { useState } from 'react';
import { Hexagon, Mail, Lock, ArrowRight, User, ShieldCheck } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network request
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1500);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setFormData({ email: 'demo@hyperdrive.io', password: 'password', name: 'Demo User' });
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#050505] text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Left Side: Brand (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative z-10 border-r border-white/10 bg-black/20 backdrop-blur-sm">
         <div>
            <div className="flex items-center gap-3 mb-8">
               <Hexagon className="w-10 h-10 text-neon-blue fill-neon-blue/10" strokeWidth={1.5} />
               <span className="text-2xl font-display font-bold tracking-widest">HYPER<span className="text-neon-blue">DRIVE</span></span>
            </div>
            <h1 className="text-6xl font-display font-bold leading-tight mb-6">
               The Future of <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Vehicle Commerce</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
               Join the premier marketplace for high-performance EVs, cybernetic parts, and luxury transport. AI-verified. Secure. Fast.
            </p>
         </div>
         
         <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
               <ShieldCheck className="w-8 h-8 text-neon-green mb-4" />
               <h3 className="font-bold text-lg mb-2">Verified Sellers</h3>
               <p className="text-sm text-gray-500">Every dealer is vetted through our neural identity network.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
               <ArrowRight className="w-8 h-8 text-neon-blue mb-4" />
               <h3 className="font-bold text-lg mb-2">Instant Transfer</h3>
               <p className="text-sm text-gray-500">Smart contracts ensure ownership is transferred in milliseconds.</p>
            </div>
         </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
         <div className="w-full max-w-md space-y-8">
            <div className="text-center lg:text-left">
               <h2 className="text-3xl font-display font-bold mb-2">{isLogin ? 'Access Terminal' : 'Initialize Identity'}</h2>
               <p className="text-gray-400 text-sm">
                  {isLogin ? 'Enter your credentials to access the grid.' : 'Create a new neural profile to begin.'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
               {!isLogin && (
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Display Name</label>
                    <div className="relative">
                       <input 
                          type="text" 
                          placeholder="e.g. DriftKing" 
                          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                          required
                       />
                       <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    </div>
                 </div>
               )}
               
               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                     <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="name@example.com" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                        required
                     />
                     <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Passcode</label>
                  <div className="relative">
                     <input 
                        type="password" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="••••••••" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white focus:border-neon-blue focus:outline-none transition-colors"
                        required
                     />
                     <Lock className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                  </div>
               </div>

               <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full py-4 bg-neon-blue text-black font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] flex items-center justify-center gap-2 mt-4"
               >
                  {isLoading ? (
                     <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                     <>
                        {isLogin ? 'Connect' : 'Register'} <ArrowRight className="w-4 h-4" />
                     </>
                  )}
               </button>
            </form>

            <div className="relative">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
               <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#050505] px-2 text-gray-500">Or continue with</span></div>
            </div>

            <button 
               type="button"
               onClick={handleDemoLogin}
               disabled={isLoading}
               className="w-full py-3 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
               <User className="w-4 h-4 text-neon-purple" /> Quick Demo Access
            </button>

            <div className="text-center text-sm">
               <span className="text-gray-500">{isLogin ? "Don't have an identity?" : "Already verified?"}</span>
               <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-neon-blue font-bold hover:underline"
               >
                  {isLogin ? 'Create Account' : 'Sign In'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Auth;