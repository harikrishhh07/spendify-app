import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import LiveClock from '../components/LiveClock';
import './ExpenseHistory.css';

export default function ExpenseHistory() {
  const { transactions, deleteTransaction } = useExpenses();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState('all');
  const [isDownloading, setIsDownloading] = useState(false);

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDownloadPDF = async () => {
    if (!currentUser?.sqlUserId) return;
    
    setIsDownloading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/transactions/export-pdf/${currentUser.sqlUserId}`);
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Spendify_Transactions_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-600/20 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
          <div className="relative">
            <h1 className="text-4xl font-black tracking-tight mb-2 bg-linear-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              TRANSACTION HISTORY
            </h1>
            <p className="text-yellow-200">Track and manage all your financial transactions in real-time.</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex gap-2 bg-yellow-500/10 p-1.5 rounded-2xl border border-yellow-500/30 backdrop-blur-sm">
            {['all', 'income', 'expense'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 text-sm font-bold rounded-xl capitalize transition-all ${
                  filter === f 
                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg shadow-yellow-500/30' 
                    : 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10'
                }`}
              >
                <span className="flex items-center gap-2">
                  {f === 'all' ? <BarChart2 size={16} /> : f === 'income' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  {f}
                </span>
              </button>
            ))}
          </div>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/50 text-yellow-400 hover:from-slate-700 hover:to-slate-800 hover:text-yellow-300 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {isDownloading ? <><Loader2 size={18} className="animate-spin" /> Downloading...</> : <><Download size={18} /> Download PDF</>}
          </button>
        </div>
      </header>

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

                <div className="flex items-center justify-between md:justify-end gap-6 ml-0 md:ml-0">
                  <span className={`text-2xl font-black tracking-tight ${
                    t.type === 'income' ? 'text-teal-400' : 'text-red-400'
                  }`}>
                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  
                  {t.type === 'expense' && (
                    <button
                      onClick={() => deleteTransaction(t.id, t.type)}
                      className="p-2 text-yellow-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                      title="Delete Expense"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
