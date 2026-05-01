import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginThreeBackground from '../components/LoginThreeBackground';
import { CircleDollarSign, AlertTriangle, Sparkles } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [isHovering, setIsHovering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-redirect if already logged in
  if (currentUser) {
    navigate('/dashboard');
    return null;
  }

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setIsLoading(true);
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 px-4">
      {/* Three.js Background */}
      <LoginThreeBackground />

      {/* Gradient Overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-yellow-600 to-yellow-700 opacity-20 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-gradient-to-tl from-yellow-600 to-yellow-700 opacity-20 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ 
        backgroundImage: "linear-gradient(rgba(201,169,110,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.3) 1px, transparent 1px)", 
        backgroundSize: "50px 50px",
        animation: "slide 20s linear infinite"
      }}></div>

      <style>{`
        @keyframes slide {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 169, 110, 0.3); }
          50% { box-shadow: 0 0 40px rgba(201, 169, 110, 0.6); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      <div className="w-full max-w-md z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500/50 text-yellow-400 font-bold text-5xl mb-8 shadow-2xl shadow-yellow-500/20 transform hover:scale-110 transition-transform duration-300 cursor-pointer"
            style={{ animation: "float 3s ease-in-out infinite" }}>
            <CircleDollarSign size={40} className="text-yellow-400" />
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 tracking-tight mb-3 animate-pulse">
            Spendify
          </h1>
          <p className="text-yellow-200 text-lg font-medium">Smart finance for the modern world</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-60"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-40"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-20"></div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/15 border border-red-500/50 text-red-300 px-6 py-4 rounded-xl text-center mb-8 text-sm font-medium backdrop-blur-md animate-in shake duration-500">
            <AlertTriangle size={16} className="inline mr-2" /> {error}
          </div>
        )}

        {/* Main Card */}
        <div 
          className="relative group"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Glowing Border Effect */}
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md`}></div>
          
          {/* Card Content */}
          <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-900/70 to-slate-950/80 backdrop-blur-2xl border border-yellow-500/30 rounded-2xl p-10 shadow-2xl hover:border-yellow-500/60 transition-all duration-500 transform group-hover:scale-105">
            
            <div className="space-y-6">
              {/* Welcome Text */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">Welcome Back</h2>
                <p className="text-yellow-200/80 text-sm">Unlock your financial insights</p>
              </div>

              {/* Google Login Button */}
              <button 
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/50 text-yellow-400 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isHovering ? 'shadow-2xl shadow-yellow-400/40 border-yellow-400 text-yellow-300' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" fill="#EA4335"></path>
                      <path d="M16.04 18.013c-1.09.693-2.475 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067C3.186 21.314 7.26 24 12 24c3.11 0 5.924-1.017 8.118-2.75l-4.078-3.237z" fill="#34A853"></path>
                      <path d="M23.99 12.218c0-.796-.076-1.592-.216-2.368H12v4.482h6.718c-.287 1.548-1.155 2.864-2.458 3.732l4.078 3.237C22.736 19.1 23.99 15.967 23.99 12.218z" fill="#4285F4"></path>
                      <path d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.134-1.531.368-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z" fill="#FBBC05"></path>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
                <span className="relative px-3 text-xs font-medium text-yellow-300/60 bg-slate-900/80">OR</span>
              </div>

              {/* Demo Info */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2">
                <p className="text-xs font-bold text-yellow-300 uppercase tracking-widest flex items-center gap-1"><Sparkles size={14} /> Premium Features</p>
                <ul className="space-y-2 text-xs text-yellow-200/80">
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Real-time expense tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Smart budget alerts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1 h-1 bg-yellow-400 rounded-full"></span>
                    Interactive analytics
                  </li>
                </ul>
              </div>
            </div>

            {/* Footer Text */}
            <div className="mt-8 pt-6 border-t border-yellow-500/20 text-center">
              <p className="text-xs text-yellow-200/60 leading-relaxed">
                By continuing, you agree to our<br />
                <span className="text-yellow-300/80 hover:text-yellow-300 cursor-pointer transition-colors">Terms of Service</span>
                {' '}and{' '}
                <span className="text-yellow-300/80 hover:text-yellow-300 cursor-pointer transition-colors">Privacy Policy</span>
              </p>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-10 -left-20 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute bottom-10 -right-20 w-40 h-40 bg-yellow-600/5 rounded-full blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Bottom Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none"></div>
    </div>
  );
}
