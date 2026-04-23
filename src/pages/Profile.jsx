import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { achievements } = useExpenses();
  const { currentUser, logout } = useAuth();

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to delete all transactions and reset your account?")) {
      localStorage.removeItem('spendify_transactions');
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-noise pointer-events-none"></div>

      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3">
          <h1 className="font-black tracking-tighter uppercase text-lg text-[#CCFF00]">PROFILE</h1>
        </div>
      </header>

      <main className="pt-24 pb-32 px-margin-mobile flex flex-col gap-xl max-w-lg mx-auto">
        <section className="flex flex-col items-center justify-center py-lg gap-md">
          <div className="w-24 h-24 rounded-full border-2 border-[#CCFF00] overflow-hidden bg-surface-container flex items-center justify-center">
            {currentUser?.photoURL ? (
              <img className="w-full h-full object-cover" src={currentUser.photoURL} alt="User Profile" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-white/50">person</span>
            )}
          </div>
          <div className="text-center">
            <h2 className="font-display-xl text-headline-lg text-white">{currentUser?.displayName || 'User'}</h2>
            <p className="font-label-caps text-label-caps text-white/40">{currentUser?.email || 'No email'}</p>
          </div>
        </section>

        <section className="flex flex-col gap-md mb-4">
          <h2 className="font-headline-md text-headline-md text-white tracking-tight">Achievements</h2>
          <div className="glass-card rounded-xl p-6 grid grid-cols-3 gap-gutter">
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

        <section className="flex flex-col gap-md">
          <button onClick={handleResetData} className="glass-card p-md rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-error-container/20 flex items-center justify-center text-error">
                <span className="material-symbols-outlined">delete_forever</span>
              </div>
              <div className="text-left">
                <p className="font-body-md font-bold text-white">Reset Account Data</p>
                <p className="text-xs text-on-surface-variant">Clear all local transactions and budgets</p>
              </div>
            </div>
          </button>
          
          <button onClick={handleLogout} className="glass-card p-md rounded-xl flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center text-white">
                <span className="material-symbols-outlined">logout</span>
              </div>
              <div className="text-left">
                <p className="font-body-md font-bold text-white">Log Out</p>
              </div>
            </div>
          </button>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-8 pt-3 bg-black/70 backdrop-blur-[20px] border-t border-white/15">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">analytics</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">Summary</span>
        </Link>
        <Link to="/reports" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">monitoring</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">Trends</span>
        </Link>
        <Link to="/expense-history" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined">account_balance_wallet</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">History</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center justify-center text-[#CCFF00] scale-105 active:scale-90 duration-200">
          <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>person</span>
          <span className="font-bold text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </Link>
      </nav>
    </>
  );
}
