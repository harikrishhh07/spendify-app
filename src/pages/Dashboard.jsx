import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { transactions, totalBalance, budgets, achievements } = useExpenses();

  const getCategoryTotal = (category) => {
    return transactions.filter(t => t.type === 'expense' && t.category === category).reduce((acc, curr) => acc + curr.amount, 0);
  };

  const housingSpent = getCategoryTotal('Housing');
  const foodSpent = getCategoryTotal('Food');
  const funSpent = getCategoryTotal('Fun');

  const getProgress = (spent, budget, radius) => {
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(spent / (budget || 1), 1);
    return `${circumference * percentage}, ${circumference}`;
  };

  const getPercentage = (spent, budget) => {
    return Math.round((spent / (budget || 1)) * 100);
  };

  const recentActivity = transactions.slice(0, 3);

  return (
    <>
      

<header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
<div className="flex items-center gap-2">
<div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container-high">
<img alt="User Profile" data-alt="close-up portrait of a professional athlete with high contrast lighting on a dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWeKhLEysicacMf2A3luTAIi454gjflmKyWsy7ZSOjyIa5weAAkg3hwImBq0tjlLPNrg1X20kGRUWSlBSC0tyT3FykXa_T2nEslIXyIa5IMVvh1fN1Jhsr2rnBK3VlFtDvPZwTJPNPh6QlLWJkdjInQCOjIBDIRgCGdDIaeBQXFGcXedKJ5MwuscyozuLqfiU19L853CykG24QxpjEbHVMtxfvHrBuWuLcXm7VoVMX6LURPw-J0NaWsst9dyYTuP3ajvlhyblckYoa"/>
</div>
<img src="/spendify_logo.png" alt="Spendify Logo" className="h-6 object-contain" />
<span className="text-xl font-black text-[#CCFF00] italic tracking-widest">SPENDIFY</span>
</div>
<div className="flex items-center gap-4">
<button onClick={() => alert("Notifications feature coming soon!")} className="active:scale-95 transition-all hover:opacity-80 text-[#CCFF00]">
<span className="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
</div>
</header>
<main className="mt-20 px-margin-mobile flex flex-col gap-xl">

<section className="flex flex-col gap-xs pt-4">
<span className="font-label-caps text-label-caps text-white/60">TOTAL BALANCE</span>
<h1 className="font-display-xl text-display-xl tracking-tighter">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBalance)}</h1>
<div className="flex items-center gap-sm mt-2">
<span className="px-2 py-1 bg-primary-container text-on-primary-container text-[10px] font-black rounded-full">+12.4% THIS MONTH</span>
<span className="font-label-caps text-[10px] text-white/40">LAST SYNC: 2M AGO</span>
</div>
</section>

<section className="glass-card rounded-xl p-6 flex items-center justify-between overflow-hidden">
<div className="flex flex-col gap-md">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps text-[#CCFF00]">HOUSING</span>
<span className="font-numeric-data text-numeric-data">${housingSpent} / ${budgets.Housing}</span>
</div>
<div className="flex flex-col">
<span className="font-label-caps text-label-caps text-[#FF4B89]">FOOD</span>
<span className="font-numeric-data text-numeric-data">${foodSpent} / ${budgets.Food}</span>
</div>
<div className="flex flex-col">
<span className="font-label-caps text-label-caps text-[#00DBE9]">FUN</span>
<span className="font-numeric-data text-numeric-data">${funSpent} / ${budgets.Fun}</span>
</div>
</div>

<div className="relative w-40 h-40">
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">

<circle className="activity-ring-bg" cx="60" cy="60" r="50"></circle>
<circle className="activity-ring-progress" cx="60" cy="60" r="50" stroke="#CCFF00" strokeDasharray={getProgress(housingSpent, budgets.Housing, 50)}></circle>

<circle className="activity-ring-bg" cx="60" cy="60" r="36"></circle>
<circle className="activity-ring-progress" cx="60" cy="60" r="36" stroke="#FF4B89" strokeDasharray={getProgress(foodSpent, budgets.Food, 36)}></circle>

<circle className="activity-ring-bg" cx="60" cy="60" r="22"></circle>
<circle className="activity-ring-progress" cx="60" cy="60" r="22" stroke="#00DBE9" strokeDasharray={getProgress(funSpent, budgets.Fun, 22)}></circle>
</svg>
<div className="absolute inset-0 flex items-center justify-center">
<span className="material-symbols-outlined text-white/20 text-3xl" data-icon="bolt">bolt</span>
</div>
</div>
</section>

<section className="grid grid-cols-2 gap-gutter">
<div className="glass-card rounded-xl p-4 flex flex-col gap-sm">
<div className="w-10 h-10 rounded-lg bg-[#CCFF00]/20 flex items-center justify-center">
<span className="material-symbols-outlined text-[#CCFF00]" data-icon="home">home</span>
</div>
<div>
<h3 className="font-label-caps text-label-caps text-white/60">HOUSING</h3>
<p className="font-numeric-data text-numeric-data text-white">{getPercentage(housingSpent, budgets.Housing)}%</p>
</div>
</div>
<div className="glass-card rounded-xl p-4 flex flex-col gap-sm">
<div className="w-10 h-10 rounded-lg bg-[#FF4B89]/20 flex items-center justify-center">
<span className="material-symbols-outlined text-[#FF4B89]" data-icon="restaurant">restaurant</span>
</div>
<div>
<h3 className="font-label-caps text-label-caps text-white/60">FOOD</h3>
<p className="font-numeric-data text-numeric-data text-white">{getPercentage(foodSpent, budgets.Food)}%</p>
</div>
</div>
<div className="glass-card rounded-xl p-4 flex flex-col gap-sm">
<div className="w-10 h-10 rounded-lg bg-[#00DBE9]/20 flex items-center justify-center">
<span className="material-symbols-outlined text-[#00DBE9]" data-icon="sports_esports">sports_esports</span>
</div>
<div>
<h3 className="font-label-caps text-label-caps text-white/60">FUN</h3>
<p className="font-numeric-data text-numeric-data text-white">{getPercentage(funSpent, budgets.Fun)}%</p>
</div>
</div>
<div onClick={() => navigate('/goals')} className="glass-card rounded-xl p-4 flex flex-col gap-sm border-dashed border-white/30 bg-transparent cursor-pointer hover:bg-white/5 transition-colors">
<div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
<span className="material-symbols-outlined text-white/40" data-icon="add">add</span>
</div>
<div>
<h3 className="font-label-caps text-label-caps text-white/40">NEW GOAL</h3>
<p className="font-numeric-data text-numeric-data text-white/20">SET</p>
</div>
</div>
</section>

<section className="flex flex-col gap-md">
<div className="flex justify-between items-end">
<h2 className="font-headline-md text-headline-md text-white tracking-tight">Recent Activity</h2>
<button onClick={() => navigate('/expense-history')} className="font-label-caps text-[10px] text-[#CCFF00] uppercase tracking-widest hover:underline">View All</button>
</div>
<div className="glass-card rounded-xl divide-y divide-white/5 overflow-hidden">
{recentActivity.map(t => (
  <div key={t.id} className="p-4 flex items-center justify-between active:bg-white/5 transition-colors">
  <div className="flex items-center gap-md">
  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
  <span className="material-symbols-outlined text-white">{t.type === 'income' ? 'payments' : 'shopping_bag'}</span>
  </div>
  <div className="flex flex-col">
  <span className="font-body-md font-bold text-white">{t.name}</span>
  <span className="text-[10px] font-label-caps text-white/40">{t.category.toUpperCase()} • {new Date(t.date).toLocaleDateString()}</span>
  </div>
  </div>
  <div className="flex flex-col items-end">
  <span className={`font-numeric-data ${t.type === 'income' ? 'text-[#CCFF00]' : 'text-white'}`}>
    {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(t.amount)}
  </span>
  <span className="px-2 py-0.5 rounded-full bg-primary-container/20 text-[#CCFF00] text-[8px] font-black uppercase">Settled</span>
  </div>
  </div>
))}
</div>
</section>

<section className="flex flex-col gap-md">
<div className="flex justify-between items-end">
<h2 className="font-headline-md text-headline-md text-white tracking-tight">Achievements</h2>
<button onClick={() => alert("Achievements feature coming soon!")} className="font-label-caps text-[10px] text-[#CCFF00] uppercase tracking-widest hover:underline">More</button>
</div>
<div className="grid grid-cols-3 gap-gutter">

<div className="flex flex-col items-center gap-sm">
<div className={`badge-3d w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${achievements.budgetStreak ? 'bg-gradient-to-br from-[#CCFF00] to-[#88AA00] border-[#CCFF00]/50' : 'bg-white/5 border-white/10 grayscale opacity-50'}`}>
<span className={`material-symbols-outlined text-4xl ${achievements.budgetStreak ? 'text-black' : 'text-white/40'}`} data-icon="avg_pace" style={{fontVariationSettings: "'FILL' 1"}}>avg_pace</span>
</div>
<div className="text-center">
<p className="font-label-caps text-[8px] leading-tight text-white/60">BUDGET STREAK</p>
<p className={`font-bold text-[10px] ${achievements.budgetStreak ? 'text-[#CCFF00]' : 'text-white/20'}`}>{achievements.budgetStreak ? 'UNLOCKED' : 'LOCKED'}</p>
</div>
</div>

<div className="flex flex-col items-center gap-sm">
<div className={`badge-3d w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${achievements.savingsGoalMet ? 'bg-gradient-to-br from-[#FF4B89] to-[#992255] border-[#FF4B89]/50' : 'bg-white/5 border-white/10 grayscale opacity-50'}`}>
<span className={`material-symbols-outlined text-4xl ${achievements.savingsGoalMet ? 'text-black' : 'text-white/40'}`} data-icon="workspace_premium" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
</div>
<div className="text-center">
<p className="font-label-caps text-[8px] leading-tight text-white/60">SAVINGS GOAL</p>
<p className={`font-bold text-[10px] ${achievements.savingsGoalMet ? 'text-[#FF4B89]' : 'text-white/20'}`}>{achievements.savingsGoalMet ? 'MET' : 'LOCKED'}</p>
</div>
</div>

<div className="flex flex-col items-center gap-sm">
<div className={`badge-3d w-20 h-20 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${achievements.smartSpender ? 'bg-gradient-to-br from-[#00DBE9] to-[#006F77] border-[#00DBE9]/50' : 'bg-white/5 border-white/10 grayscale opacity-50'}`}>
<span className={`material-symbols-outlined text-4xl ${achievements.smartSpender ? 'text-black' : 'text-white/40'}`} data-icon="stars" style={{fontVariationSettings: "'FILL' 1"}}>stars</span>
</div>
<div className="text-center">
<p className="font-label-caps text-[8px] leading-tight text-white/60">SMART</p>
<p className={`font-bold text-[10px] ${achievements.smartSpender ? 'text-[#00DBE9]' : 'text-white/20'}`}>{achievements.smartSpender ? 'SPENDER' : 'LOCKED'}</p>
</div>
</div>
</div>
</section>

<button onClick={() => navigate('/add-expense')} className="w-full bg-[#CCFF00] text-black font-black py-4 rounded-full active:scale-95 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2">
<span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            Log New Expense
        </button>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-t border-white/15 flex justify-around items-center px-4 pb-8 pt-3">
<Link to="/dashboard" className="flex flex-col items-center justify-center text-[#CCFF00] scale-105 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="analytics" style={{fontVariationSettings: "'FILL' 1"}}>analytics</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Summary</span>
</Link>
<Link to="/reports" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Trends</span>
</Link>
<Link to="/expense-history" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">History</span>
</Link>
<Link to="/profile" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Profile</span>
</Link>
</nav>

    </>
  );
}
