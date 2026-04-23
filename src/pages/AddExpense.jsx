import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import './AddExpense.css';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction, totalBalance, initialBalance, setBalance, transactions } = useExpenses();
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('Food');
  const [merchant, setMerchant] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showBalanceModal, setShowBalanceModal] = useState(transactions.length === 0 && initialBalance === 50000);
  const [newBalance, setNewBalance] = useState(initialBalance.toString());
  const [transactionType, setTransactionType] = useState('expense');

  const handleKeyPress = (key) => {
    if (key === 'backspace') {
      setAmount(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (key === '.') {
      if (!amount.includes('.')) setAmount(prev => prev + key);
    } else {
      if (amount === '0') setAmount(key);
      else setAmount(prev => prev + key);
    }
  };

  const handleSetBalance = () => {
    const balance = parseFloat(newBalance);
    if (balance > 0) {
      setBalance(balance);
      setShowBalanceModal(false);
    }
  };

  const handleSave = () => {
    if (parseFloat(amount) > 0) {
      const balanceAfter = transactionType === 'expense' 
        ? totalBalance - parseFloat(amount)
        : totalBalance + parseFloat(amount);

      addTransaction({
        name: merchant.trim() || (transactionType === 'income' ? 'Manual Income' : 'Manual Expense'),
        amount: parseFloat(amount),
        type: transactionType,
        category: category,
        date: expenseDate ? new Date(expenseDate).toISOString() : new Date().toISOString()
      });

      // Show confirmation with new balance
      alert(`${transactionType === 'expense' ? 'Expense' : 'Income'} added!\n\nNew Balance: ₹${balanceAfter.toLocaleString('en-IN')}`);
      navigate('/dashboard');
    }
  };

  return (
    <>
      {showBalanceModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-[20px] z-50 flex items-center justify-center">
          <div className="glass-card rounded-2xl p-8 max-w-sm mx-4 flex flex-col gap-md">
            <h1 className="font-headline-lg text-headline-lg text-white">Set Your Initial Balance</h1>
            <p className="text-white/60">Enter your current account balance to get started</p>
            
            <div className="flex items-baseline gap-xs bg-white/5 rounded-lg px-4 py-3">
              <span className="font-display-sm text-[#CCFF00]">₹</span>
              <input 
                type="number" 
                value={newBalance} 
                onChange={(e) => setNewBalance(e.target.value)}
                placeholder="50000"
                className="bg-transparent border-none outline-none font-display-md text-white w-full"
                autoFocus
              />
            </div>

            <button 
              onClick={handleSetBalance}
              className="w-full h-12 bg-[#CCFF00] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)]"
            >
              <span className="font-label-caps text-black font-black uppercase tracking-widest">SET BALANCE</span>
            </button>
          </div>
        </div>
      )}
      
<div className="fixed inset-0 bg-noise pointer-events-none"></div>

<header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
<div className="flex items-center gap-3">
<button onClick={() => navigate(-1)} className="active:scale-95 transition-all text-[#CCFF00]">
<span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
</button>
<h1 className="font-black tracking-tighter uppercase text-lg text-[#CCFF00]">NEW TRANSACTION</h1>
</div>
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-white/60 hover:opacity-80 active:scale-95 transition-all" data-icon="notifications">notifications</span>
<div className="w-8 h-8 rounded-full border border-white/15 overflow-hidden">
<img className="w-full h-full object-cover" data-alt="close up professional portrait of a man with minimalist aesthetic and dramatic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3HvCILNb57eS45uNFS-h2azqa6JF7ReEJe_4Mw21WpUx6jZ7sZbkNqxJu19kPWy8c9EA3sMS1IpPN63NIGlDvddKn2SpHEiizUJ8V4lVcs2Wku5lOGOcu5uYAp2BDMrYrxml5PdwbfpNZZHVmZxWDNdcTaba5V5ITD64ZHTCTGM5J0yX0ssgAN-9EgriKDmoyAyxIZrbpWlu-ZCRTuIEtTXsutf7JaWaCR2gjajFM65oVaTOn80ode_XkPLA7qhTmb9Z3flrs1OV3"/>
</div>
</div>
</header>
<main className="pt-24 pb-32 px-margin-mobile flex flex-col gap-xl max-w-lg mx-auto">

<div className="flex gap-2 mb-4">
<button 
  onClick={() => setTransactionType('expense')}
  className={`flex-1 py-2 px-3 rounded-lg font-label-caps text-[11px] transition-all ${transactionType === 'expense' ? 'bg-[#CCFF00] text-black' : 'bg-white/10 text-white'}`}
>
Expense
</button>
<button 
  onClick={() => setTransactionType('income')}
  className={`flex-1 py-2 px-3 rounded-lg font-label-caps text-[11px] transition-all ${transactionType === 'income' ? 'bg-green-500 text-white' : 'bg-white/10 text-white'}`}
>
Income
</button>
</div>

<section className="flex flex-col items-center justify-center py-lg">
<span className="font-label-caps text-label-caps text-white/40 mb-xs">AMOUNT</span>
<div className="flex items-baseline gap-xs">
<span className="font-display-xl text-headline-lg text-[#CCFF00] opacity-50">₹</span>
<span className="font-display-xl text-display-xl tracking-tighter text-white">{amount}</span>
</div>
{totalBalance > 0 && transactionType === 'expense' && (
  <span className="font-label-caps text-[10px] text-white/40 mt-2">
    After: ₹{(totalBalance - parseFloat(amount || 0)).toLocaleString('en-IN')}
  </span>
)}
</section>

<section className="grid grid-cols-4 gap-sm">
<div onClick={() => setCategory('Food')} className="flex flex-col items-center gap-xs cursor-pointer">
<div className={`w-14 h-14 rounded-full flex items-center justify-center glass-card ${category === 'Food' ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]/30' : ''}`}>
<span className={`material-symbols-outlined ${category === 'Food' ? 'text-[#CCFF00]' : 'text-white'}`} data-icon="restaurant" style={{fontVariationSettings: "'FILL' 1"}}>restaurant</span>
</div>
<span className={`font-label-caps text-[10px] ${category === 'Food' ? 'text-white' : 'text-white/60'}`}>FOOD</span>
</div>
<div onClick={() => setCategory('Transport')} className="flex flex-col items-center gap-xs cursor-pointer">
<div className={`w-14 h-14 rounded-full flex items-center justify-center glass-card ${category === 'Transport' ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]/30' : ''}`}>
<span className={`material-symbols-outlined ${category === 'Transport' ? 'text-[#CCFF00]' : 'text-white'}`} data-icon="directions_car">directions_car</span>
</div>
<span className={`font-label-caps text-[10px] ${category === 'Transport' ? 'text-white' : 'text-white/60'}`}>TRAVEL</span>
</div>
<div onClick={() => setCategory('Housing')} className="flex flex-col items-center gap-xs cursor-pointer">
<div className={`w-14 h-14 rounded-full flex items-center justify-center glass-card ${category === 'Housing' ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]/30' : ''}`}>
<span className={`material-symbols-outlined ${category === 'Housing' ? 'text-[#CCFF00]' : 'text-white'}`} data-icon="home">home</span>
</div>
<span className={`font-label-caps text-[10px] ${category === 'Housing' ? 'text-white' : 'text-white/60'}`}>HOUSING</span>
</div>
<div onClick={() => setCategory('Fun')} className="flex flex-col items-center gap-xs cursor-pointer">
<div className={`w-14 h-14 rounded-full flex items-center justify-center glass-card ${category === 'Fun' ? 'border-[#CCFF00] ring-1 ring-[#CCFF00]/30' : ''}`}>
<span className={`material-symbols-outlined ${category === 'Fun' ? 'text-[#CCFF00]' : 'text-white'}`} data-icon="sports_esports">sports_esports</span>
</div>
<span className={`font-label-caps text-[10px] ${category === 'Fun' ? 'text-white' : 'text-white/60'}`}>FUN</span>
</div>
</section>

<section className="flex flex-col gap-md">
<div className="glass-card p-md rounded-xl flex items-center justify-between">
<div className="flex flex-col w-full">
<span className="font-label-caps text-label-caps text-white/40">MERCHANT</span>
<input 
  type="text" 
  value={merchant} 
  onChange={(e) => setMerchant(e.target.value)} 
  placeholder="Enter merchant name..." 
  className="bg-transparent border-none outline-none font-body-lg text-body-lg text-white w-full placeholder-white/20 mt-1"
/>
</div>
<span className="material-symbols-outlined text-white/20">edit</span>
</div>
<div className="glass-card p-md rounded-xl flex items-center justify-between">
<div className="flex flex-col w-full">
<span className="font-label-caps text-label-caps text-white/40">DATE</span>
<input 
  type="date" 
  value={expenseDate} 
  onChange={(e) => setExpenseDate(e.target.value)} 
  className="bg-transparent border-none outline-none font-body-lg text-body-lg text-white w-full mt-1"
  style={{ colorScheme: 'dark' }}
/>
</div>
<span className="material-symbols-outlined text-white/20">calendar_today</span>
</div>
</section>

<section className="grid grid-cols-3 gap-sm mt-md">
{['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0'].map(num => (
  <button key={num} onClick={() => handleKeyPress(num)} className="h-16 flex items-center justify-center rounded-lg active:bg-white/10 transition-colors">
    <span className="font-numeric-data text-headline-md text-white">{num}</span>
  </button>
))}
<button onClick={() => handleKeyPress('backspace')} className="h-16 flex items-center justify-center rounded-lg active:bg-white/10 transition-colors">
<span className="material-symbols-outlined text-white" data-icon="backspace">backspace</span>
</button>
</section>

<button onClick={handleSave} className="w-full h-14 bg-[#CCFF00] rounded-full flex items-center justify-center active:scale-95 transition-all shadow-[0_0_20px_rgba(204,255,0,0.3)] mt-8">
<span className="font-label-caps text-black font-black uppercase tracking-widest">SAVE TRANSACTION</span>
</button>
</main>

<nav className="fixed bottom-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-t border-white/15 flex justify-around items-center px-4 pb-8 pt-3">
<Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="analytics">analytics</span>
<span className="font-bold text-[10px] uppercase tracking-widest">Summary</span>
</Link>
<Link to="/reports" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="monitoring">monitoring</span>
<span className="font-bold text-[10px] uppercase tracking-widest">Trends</span>
</Link>
<Link to="/expense-history" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
<span className="font-bold text-[10px] uppercase tracking-widest">History</span>
</Link>
<Link to="/profile" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
<span className="material-symbols-outlined" data-icon="person">person</span>
<span className="font-bold text-[10px] uppercase tracking-widest">Profile</span>
</Link>
</nav>
    </>
  );
}
