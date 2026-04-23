import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './Reports.css';

export default function Reports() {
  const navigate = useNavigate();
  const { transactions, totalExpenses } = useExpenses();

  const averageDailySpend = totalExpenses / 30;

  const getCategoryTotal = (category) => {
    return transactions.filter(t => t.type === 'expense' && t.category === category).reduce((acc, curr) => acc + curr.amount, 0);
  };
  
  const housingSpent = getCategoryTotal('Housing');
  const foodSpent = getCategoryTotal('Food');
  const funSpent = getCategoryTotal('Fun');
  const transportSpent = getCategoryTotal('Transport');
  const otherSpent = getCategoryTotal('Other');

  const maxSpent = Math.max(housingSpent, foodSpent, funSpent, transportSpent, otherSpent, 1);
  const getHeight = (amount) => `${Math.max((amount / maxSpent) * 100, 10)}%`;

  return (
    <>
      

<header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
<div className="flex items-center gap-3">
<div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
<img alt="User Profile" data-alt="close-up portrait of a professional athlete with determined expression, high contrast studio lighting on dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCD1flLZcLf3VzEr26hYDfhl9alG0BvRhFZopU2IbfhEpbGoUcVJ2Tw8bJTHNvsXxDhPG8h2-D0Aco6rxjCb9SNMbBkKvWuTWa2eV31xY1tcNDghF6XqzzffG972270L6hvo4M_hI9ywXpHdj_CIfB5uhDkvoKmNg7jR6CsAhJTD7LkipzOxbNtuYR6Z3i3vvnzfH-9y5dFZXFURsvf7-2U_uCByq2amr7kyOJOWl88Jy5QKHDbIQX4lm9PowQDQaQPmQ9gqUTqt1SH"/>
</div>
<h1 className="font-black tracking-tighter uppercase text-lg text-[#CCFF00]">DASHBOARD</h1>
</div>
<div className="flex items-center gap-4">
<span onClick={() => alert("Notifications feature coming soon!")} className="material-symbols-outlined text-[#CCFF00] hover:opacity-80 active:scale-95 transition-all cursor-pointer" data-icon="notifications">notifications</span>
</div>
</header>
<main className="pt-24 pb-32 px-margin-mobile max-w-5xl mx-auto space-y-xl">

<section className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
<div className="glass-card rounded-xl p-lg flex flex-col items-center justify-center relative min-h-[320px]">
<h3 className="absolute top-lg left-lg font-label-caps text-label-caps text-on-surface-variant">BUDGET HEALTH</h3>

<svg className="w-64 h-64 transform -rotate-90" viewBox="0 0 100 100">

<circle className="activity-ring-bg" cx="50" cy="50" fill="transparent" r="40" strokeWidth="8"></circle>
<circle className="glow-lime" cx="50" cy="50" fill="transparent" r="40" stroke="#CCFF00" strokeDasharray="251.2" strokeDashoffset="60" strokeLinecap="round" strokeWidth="8"></circle>

<circle className="activity-ring-bg" cx="50" cy="50" fill="transparent" r="30" strokeWidth="8"></circle>
<circle className="glow-pink" cx="50" cy="50" fill="transparent" r="30" stroke="#ff4b89" strokeDasharray="188.5" strokeDashoffset="40" strokeLinecap="round" strokeWidth="8"></circle>

<circle className="activity-ring-bg" cx="50" cy="50" fill="transparent" r="20" strokeWidth="8"></circle>
<circle className="glow-cyan" cx="50" cy="50" fill="transparent" r="20" stroke="#00dbe9" strokeDasharray="125.6" strokeDashoffset="30" strokeLinecap="round" strokeWidth="8"></circle>
</svg>
<div className="flex gap-md mt-md">
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-[#CCFF00]"></div>
<span className="text-[10px] font-label-caps">BUDGET</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-[#ff4b89]"></div>
<span className="text-[10px] font-label-caps">SAVINGS</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-[#00dbe9]"></div>
<span className="text-[10px] font-label-caps">INVEST</span>
</div>
</div>
</div>
<div className="space-y-md">
<div className="glass-card rounded-xl p-lg">
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm">AVERAGE DAILY SPEND</h3>
<div className="flex items-baseline gap-xs">
<span className="font-display-xl text-display-xl text-[#CCFF00] glow-lime">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(averageDailySpend)}</span>
<span className="font-numeric-data text-secondary-fixed text-sm">/ day</span>
</div>
<p className="text-on-surface-variant text-sm mt-sm">Your spending intensity is higher than last week's average.</p>
</div>
<div className="glass-card rounded-xl p-lg">
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-sm">PEAK PERFORMANCE</h3>
<div className="flex items-center justify-between">
<div>
<span className="font-headline-md text-headline-md block">Tuesday</span>
<span className="text-on-surface-variant text-sm">Lowest spend day</span>
</div>
<div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
<span className="material-symbols-outlined" data-icon="bolt" style={{fontVariationSettings: "'FILL' 1"}}>bolt</span>
</div>
</div>
</div>
</div>
</section>

<section className="space-y-lg">
<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg">Trends</h2>
<p className="text-on-surface-variant">Last 30 Days Activity</p>
</div>
<button onClick={() => alert("Monthly view feature coming soon!")} className="bg-primary-container text-on-primary-container font-label-caps px-md py-sm rounded-full active:scale-95 transition-all text-xs">
                    MONTHLY VIEW
                </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-md">

<div className="glass-card rounded-xl p-lg md:col-span-2 min-h-[300px] flex flex-col justify-between">
<div className="flex justify-between items-start">
<h3 className="font-label-caps text-label-caps text-on-surface-variant">CASH FLOW VELOCITY</h3>
<div className="flex gap-sm">
<span className="text-[10px] text-white/40">01 MAY</span>
<span className="text-[10px] text-white/40">30 MAY</span>
</div>
</div>
<div className="relative h-48 mt-lg overflow-hidden">
<svg className="w-full h-full preserve-3d" viewBox="0 0 400 100">
<path className="glow-lime" d="M0,80 Q50,90 100,40 T200,60 T300,20 T400,50" fill="none" stroke="#CCFF00" strokeWidth="3"></path>
<path d="M0,80 Q50,90 100,40 T200,60 T300,20 T400,50 L400,100 L0,100 Z" fill="url(#grad1)" opacity="0.3"></path>
<defs>
<lineargradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
<stop offset="0%" style={{stopColor: "#CCFF00", stopOpacity: "1"}}></stop>
<stop offset="100%" style={{stopColor: "#CCFF00", stopOpacity: "0"}}></stop>
</lineargradient>
</defs>
</svg>
</div>
</div>

<div className="glass-card rounded-xl p-lg flex flex-col gap-md">
<h3 className="font-label-caps text-label-caps text-on-surface-variant">TOP CATEGORIES</h3>
<div className="flex-1 flex flex-col justify-end gap-sm h-full">
<div className="flex items-end gap-xs h-full">
<div className="flex-1 bg-[#CCFF00] rounded-t-sm" style={{height: getHeight(housingSpent)}}></div>
<div className="flex-1 bg-[#ff4b89] rounded-t-sm" style={{height: getHeight(foodSpent)}}></div>
<div className="flex-1 bg-[#00dbe9] rounded-t-sm" style={{height: getHeight(funSpent)}}></div>
<div className="flex-1 bg-surface-container-highest rounded-t-sm" style={{height: getHeight(transportSpent)}}></div>
<div className="flex-1 bg-surface-container-highest rounded-t-sm" style={{height: getHeight(otherSpent)}}></div>
</div>
<div className="flex justify-between text-[8px] font-label-caps text-on-surface-variant">
<span>HOUS</span>
<span>FOOD</span>
<span>FUN</span>
<span>TRAN</span>
<span>OTHR</span>
</div>
</div>
</div>
</div>
</section>

<section className="space-y-md">
<h3 className="font-label-caps text-label-caps text-on-surface-variant">ANALYTIC INSIGHTS</h3>
<div className="space-y-xs">
<div onClick={() => alert("Subscription Audit feature coming soon!")} className="glass-card p-md flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-[#CCFF00]/10 flex items-center justify-center text-[#CCFF00]">
<span className="material-symbols-outlined" data-icon="trending_up">trending_up</span>
</div>
<div>
<p className="font-body-md font-bold">Subscription Audit</p>
<p className="text-xs text-on-surface-variant">3 recurring charges increased this month</p>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
<div onClick={() => alert("Liquidity Ratio feature coming soon!")} className="glass-card p-md flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-[#00dbe9]/10 flex items-center justify-center text-[#00dbe9]">
<span className="material-symbols-outlined" data-icon="account_balance_wallet" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
</div>
<div>
<p className="font-body-md font-bold">Liquidity Ratio</p>
<p className="text-xs text-on-surface-variant">Your savings buffer is 15% above target</p>
</div>
</div>
<span className="material-symbols-outlined text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</div>
</div>
</section>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-black/70 backdrop-blur-[20px] border-t border-white/15">
<Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200 cursor-pointer">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Summary</span>
</Link>
<Link to="/reports" className="flex flex-col items-center justify-center text-[#CCFF00] scale-105 active:scale-90 duration-200 cursor-pointer">
<span className="material-symbols-outlined" data-icon="monitoring" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Trends</span>
</Link>
<Link to="/expense-history" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200 cursor-pointer">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Wallet</span>
</Link>
<Link to="/profile" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200 cursor-pointer">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Profile</span>
</Link>
</nav>

    </>
  );
}
