import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import LiveClock from '../components/LiveClock';
import './AddExpense.css';

export default function AddExpense() {
  const navigate = useNavigate();
  const { addTransaction, totalBalance, initialBalance, setBalance, transactions } = useExpenses();
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('Food');
  const [merchant, setMerchant] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [newBalance, setNewBalance] = useState(initialBalance.toString());
  const [transactionType, setTransactionType] = useState('expense');

  // Show balance modal only on first visit when no transactions exist
  useEffect(() => {
    if (transactions && transactions.length === 0 && initialBalance === 50000) {
      setShowBalanceModal(true);
    }
  }, []);

  useEffect(() => {
    // Fetch categories and payment methods
    const fetchOptions = async () => {
      try {
        const [catRes, payRes] = await Promise.all([
          fetch('http://127.0.0.1:5000/api/categories'),
          fetch('http://127.0.0.1:5000/api/users') // To get payment methods for user, but we'll hardcode or assume for now if not available
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
          if (catData.length > 0) {
            setCategoryId(catData[0].id);
          }
        }
        
        // Mock payment methods since we didn't expose an explicit endpoint in routes.py 
        // (we could add it, but for UI sake we'll mock based on Seed data)
        const mockPayments = [
          { id: 1, name: 'Cash' },
          { id: 2, name: 'Credit Card' },
          { id: 3, name: 'UPI' }
        ];
        setPaymentMethods(mockPayments);
        setPaymentId(mockPayments[0].id);
        
      } catch (err) {
        console.error("Failed to fetch form options:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || amount <= 0) return;
    
    await addTransaction({
      type,
      amount,
      description,
      date,
      categoryId: type === 'expense' ? categoryId : 4, // 4 is Salary in our seed
      paymentId: type === 'expense' ? paymentId : null
    });
    
    navigate('/dashboard');
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
<LiveClock />
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400 text-lg">₹</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-xl py-3 pl-10 pr-4 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-red-300/40 hover:border-red-500/50"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">Description / Source</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-xl py-3 px-4 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all placeholder:text-red-300/40 hover:border-red-500/50"
              placeholder={type === 'expense' ? "e.g., Coffee, Groceries" : "e.g., Salary, Freelance"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-xl py-3 px-4 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all [color-scheme:dark] hover:border-red-500/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">Category</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-red-500/10 border-2 border-red-500/30 rounded-xl py-3 px-4 text-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all appearance-none hover:border-red-500/50"
              >
                {filteredCategories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-sm font-medium text-yellow-300 mb-2">Payment Method</label>
              <div className="grid grid-cols-3 gap-3">
                {paymentMethods.map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentId(pm.id)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                      paymentId === pm.id 
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300 shadow-lg shadow-yellow-500/20' 
                        : 'bg-yellow-500/5 border-yellow-500/30 text-yellow-300 hover:bg-yellow-500/10 hover:border-yellow-500/50'
                    }`}
                  >
                    {pm.name}
                  </button>
                ))}
              </div>
            </div>
          )}

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
