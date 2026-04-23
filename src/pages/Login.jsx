import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, currentUser } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === 'test@example.com' && password === 'password123') {
      navigate('/dashboard');
    } else {
      setError('Invalid credentials. Use test@example.com / password123');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to log in with Google: ' + err.message);
    }
  };

  return (
    <>
      

<header className="w-full px-margin-mobile py-8 flex justify-center items-center gap-3">
<img src="/spendify_logo.png" alt="Spendify Logo" className="h-10 object-contain" />
<h1 className="font-display-xl text-primary-fixed italic tracking-widest uppercase">SPENDIFY</h1>
</header>
<main className="flex-grow flex flex-col items-center justify-center px-margin-mobile pb-xl">

<div className="w-full max-w-md space-y-xl">

<div className="text-center space-y-sm">
<h2 className="font-headline-lg text-white uppercase tracking-tighter">Level Up Your Wealth</h2>
<p className="font-body-md text-on-surface-variant max-w-[280px] mx-auto">Elite athletic performance tracking, engineered for your personal capital.</p>
</div>

{error && (
  <div className="bg-error/20 border border-error text-error px-4 py-2 rounded-lg text-center font-body-md text-sm">
    {error}
  </div>
)}

<div className="glass-panel p-lg rounded-xl space-y-lg">
<div className="space-y-md">
<div className="relative">
<label className="font-label-caps text-on-surface-variant mb-xs block">Email Address</label>
<input className="w-full bg-black/40 border border-white/10 rounded-lg px-md py-sm text-white placeholder:text-white/20 focus:border-primary-fixed focus:ring-0 transition-all outline-none font-body-md" placeholder="athlete@spendify.io" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
</div>
<div className="relative">
<label className="font-label-caps text-on-surface-variant mb-xs block">Secure Access Key</label>
<input className="w-full bg-black/40 border border-white/10 rounded-lg px-md py-sm text-white placeholder:text-white/20 focus:border-primary-fixed focus:ring-0 transition-all outline-none font-body-md" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
</div>
</div>
<button onClick={handleLogin} className="w-full bg-primary-fixed text-on-primary-fixed font-label-caps py-md rounded-full active:scale-95 transition-all shadow-[0_0_20px_rgba(195,244,0,0.3)]">
                    INITIALIZE DASHBOARD
                </button>
<div className="flex items-center gap-sm">
<div className="h-[1px] flex-grow bg-white/10"></div>
<span className="font-label-caps text-white/40">SECURE LINK</span>
<div className="h-[1px] flex-grow bg-white/10"></div>
</div>

<div className="grid grid-cols-2 gap-md">
<button className="glass-panel hover:bg-white/5 py-sm rounded-lg flex items-center justify-center gap-sm transition-all active:scale-95">
<svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.039 2.48-4.5 2.597-4.571-1.428-2.09-3.623-2.324-4.402-2.376-1.857-.13-3.085 1.09-3.998 1.09zM15.483 3.935c.805-.974 1.35-2.338 1.208-3.688-1.156.052-2.558.78-3.389 1.753-.74.844-1.39 2.247-1.208 3.558 1.286.104 2.584-.649 3.389-1.623z"></path></svg>
<span className="font-label-caps text-white text-[10px]">APPLE</span>
</button>
<button onClick={handleGoogleLogin} className="glass-panel hover:bg-white/5 py-sm rounded-lg flex items-center justify-center gap-sm transition-all active:scale-95">
<svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z" fill="#EA4335"></path><path d="M16.04 18.013c-1.09.693-2.475 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067C3.186 21.314 7.26 24 12 24c3.11 0 5.924-1.017 8.118-2.75l-4.078-3.237z" fill="#34A853"></path><path d="M23.99 12.218c0-.796-.076-1.592-.216-2.368H12v4.482h6.718c-.287 1.548-1.155 2.864-2.458 3.732l4.078 3.237C22.736 19.1 23.99 15.967 23.99 12.218z" fill="#4285F4"></path><path d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.134-1.531.368-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z" fill="#FBBC05"></path></svg>
<span className="font-label-caps text-white text-[10px]">GOOGLE</span>
</button>
</div>
</div>

<div className="text-center">
<p className="font-label-caps text-on-surface-variant">New Recruit? <a className="text-primary-fixed border-b border-primary-fixed/30 hover:border-primary-fixed transition-colors" href="#">Apply for Account</a></p>
</div>
</div>

<div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
<div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#CCFF00]/10 blur-[120px] rounded-full"></div>
<div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-secondary-container/5 blur-[100px] rounded-full"></div>

<div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)", backgroundSize: "40px 40px"}}></div>
</div>
</main>

<section className="w-full px-margin-mobile py-xl space-y-lg max-w-4xl mx-auto">
<div className="flex justify-between items-end">
<h3 className="font-label-caps text-white">THE SPENDIFY PROTOCOL</h3>
<span className="font-numeric-data text-primary-fixed text-sm">v4.0.2</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md">

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="w-10 h-10 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center text-primary-fixed">
<span className="material-symbols-outlined" data-icon="bolt">bolt</span>
</div>
<h4 className="font-label-caps text-white text-xs">Real-time Velocity</h4>
<p className="font-body-md text-on-surface-variant text-[13px]">Track spending with millisecond latency. Every transaction mapped in real-time.</p>
</div>

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed/10 flex items-center justify-center text-tertiary-fixed">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
</div>
<h4 className="font-label-caps text-white text-xs">Biometric Insights</h4>
<p className="font-body-md text-on-surface-variant text-[13px]">AI-driven analysis that understands your financial rhythm better than you do.</p>
</div>

<div className="glass-panel p-md rounded-xl space-y-sm">
<div className="w-10 h-10 rounded-lg bg-secondary-container/10 flex items-center justify-center text-secondary-container">
<span className="material-symbols-outlined" data-icon="lock">lock</span>
</div>
<h4 className="font-label-caps text-white text-xs">Fortified Security</h4>
<p className="font-body-md text-on-surface-variant text-[13px]">Multi-layer encryption. Your data is your property. Zero compromise.</p>
</div>
</div>
</section>

<footer className="w-full py-xl px-margin-mobile border-t border-white/5 mt-auto">
<div className="max-w-md mx-auto text-center space-y-md">
<div className="flex justify-center gap-xl grayscale opacity-40">
<img alt="Partner Logo" className="h-6 object-contain" data-alt="minimalist white vector logo of a high-end fintech venture capital firm on black background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuArw7e0w-KlGSQZydWYJqoXv1KsU0FTqghnxapzy2jORPiH8C4hfhHuaskPVASmkk8Ctk4XobrsZQhFnP0YVV3sLNvEmAgveQSBRg5tOwcWsTqnjIFSvOZWs39RJ_uLFdIRGyvqTjQyi9r_JVL6ySzTcJ3o5lY-IF9DHB9t-Cz9cmSPCmdCj850xo00YE9WWpzmsTfaRuv3pHUoDsDdDn7JY6AW-ZhQin2MSuGiK4NNRvBGo9HM1oZ6VzpT4zKzzDYkYQ76jPjX3E"/>
<img alt="Partner Logo" className="h-6 object-contain" data-alt="sleek modern corporate logo of a security infrastructure company in flat white vector style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMPjku7HCC5x0JVhnfeTtkvzQPNO-vIoEXYCEk8Pv0rWO6w0JdfBFmttl1M1cxZbin02b35e7INFMCvXW9hY9_RWvBCZJ6n32X4J8JNap35IqxhKYgHEbK3MpL5_KzeNNyB9OZa-lEhKB905KcX_52-OgGWB49bbRVl_3bupLhR2XOzEdBrQo_BCbH9HROi7hHrW1PbxXhsCniEzSFX9yx8ok0M9yIlZGnhvvuLhMNFOOCoKBGI0Y5MhmamUZylVtNMkq-EyVcVMrD"/>
</div>
<p className="font-label-caps text-[10px] text-white/20 uppercase tracking-[0.2em]">Spendify © 2024 • Built for the top 1% of performers</p>
</div>
</footer>

    </>
  );
}
