import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import LiveClock from '../components/LiveClock';
import './ExpenseHistory.css';

export default function ExpenseHistory() {
  const navigate = useNavigate();
  const { transactions } = useExpenses();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const downloadCSV = () => {
    const headers = ["Date", "Name", "Category", "Type", "Amount"];
    const csvContent = [
      headers.join(","),
      ...transactions.map(t => 
        `"${new Date(t.date).toLocaleString()}","${t.name}","${t.category}","${t.type}",${t.amount}`
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "spendify_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const dateStr = new Date(transaction.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(transaction);
    return groups;
  }, {});

  return (
    <>
      

<header className="fixed top-0 z-50 w-full bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-white/10">
<img alt="User Profile" data-alt="close-up portrait of a professional athlete with focused expression, high-contrast black and white lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBZYIwlppTZO9Rx35KmPsl7op_-TjWzpWfxcEholE0Oy-rM0ZGvIHjnYTN7ww1acE-JNX1DnEeSIObJHKTWTZwcO-K6bGu9bzuwZRP-mc-SRUkQjf4SrLvN8ue-LUT1cJF477JAohcWcMqUk0M8A0IuQG-XQh8cXWkGRJhadtj9RHKH_OXJj2mQ30tyOngPcc_aoMicegpFGllo6oaabqLBj492egslzLzfp2maoSFwnSr629qurW3UhhOkuDop1IIc4sk9CUgrdFkh"/>
</div>
<span className="font-black tracking-tighter uppercase text-lg text-[#CCFF00]">DASHBOARD</span>
</div>
<div className="flex items-center gap-4">
<LiveClock />
<button className="active:scale-95 transition-all hover:opacity-80">
<span className="material-symbols-outlined text-[#CCFF00]">notifications</span>
</button>
</div>
</header>

<main className="pt-24 px-margin-mobile">

<div className="mb-lg flex gap-2">
<div className="relative flex items-center flex-1">
<span className="material-symbols-outlined absolute left-4 text-white/40">search</span>
<input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl py-3 pl-12 pr-4 font-body-md text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#CCFF00]/50 transition-all" placeholder="Search transactions..." type="text"/>
</div>
<button onClick={downloadCSV} className="bg-[#CCFF00]/10 text-[#CCFF00] px-4 rounded-xl flex items-center justify-center border border-[#CCFF00]/20 hover:bg-[#CCFF00]/20 active:scale-95 transition-all" title="Download CSV">
<span className="material-symbols-outlined">download</span>
</button>
</div>

<section className="space-y-xl">
{Object.keys(groupedTransactions).map(dateStr => (
  <div key={dateStr} className="space-y-md">
  <h2 className="font-label-caps text-label-caps text-white/40 px-2">{dateStr}</h2>
  <div className="glass-card rounded-2xl overflow-hidden divide-y divide-white/5">
  
  {groupedTransactions[dateStr].map(t => (
    <div key={t.id} className="flex items-center justify-between p-4 active:bg-white/5 transition-colors">
    <div className="flex items-center gap-4">
    <div className="w-10 h-10 rounded-lg bg-primary-container/20 flex items-center justify-center">
    <span className="material-symbols-outlined text-[#CCFF00]">{t.type === 'income' ? 'payments' : 'shopping_cart'}</span>
    </div>
    <div className="flex flex-col">
    <span className="font-body-md text-white font-bold">{t.name}</span>
    <span className="font-label-caps text-[10px] text-white/40">{t.category.toUpperCase()} • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
    </div>
    </div>
    <span className={`font-numeric-data text-numeric-data ${t.type === 'income' ? 'text-[#CCFF00]' : 'text-white'}`}>
      {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(t.amount)}
    </span>
    </div>
  ))}

  </div>
  </div>
))}
</section>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-black/70 backdrop-blur-[20px] border-t border-white/15">
<Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined">analytics</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Summary</span>
</Link>
<Link to="/reports" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>monitoring</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Trends</span>
</Link>
<Link to="/expense-history" className="flex flex-col items-center justify-center text-[#CCFF00] scale-105 active:scale-90 duration-200">
<span className="material-symbols-outlined">account_balance_wallet</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">History</span>
</Link>
<Link to="/profile" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined">person</span>
<span className="font-bold text-[10px] uppercase tracking-widest mt-1">Profile</span>
</Link>
</nav>

    </>
  );
}
