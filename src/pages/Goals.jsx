import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useExpenses } from '../context/ExpenseContext';

export default function Goals() {
  const navigate = useNavigate();
  const { goals, addGoal, totalBalance } = useExpenses();
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  const handleSaveGoal = () => {
    if (goalName && parseFloat(targetAmount) > 0) {
      addGoal({
        name: goalName,
        targetAmount: parseFloat(targetAmount),
      });
      setGoalName('');
      setTargetAmount('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-noise pointer-events-none"></div>

      <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-b border-white/15 flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="active:scale-95 transition-all text-[#CCFF00]">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 0"}}>arrow_back</span>
          </button>
          <h1 className="font-black tracking-tighter uppercase text-lg text-[#CCFF00]">GOALS</h1>
        </div>
      </header>

      <main className="pt-24 pb-32 px-margin-mobile flex flex-col gap-xl max-w-lg mx-auto">
        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-headline-md text-white tracking-tight">Set New Goal</h2>
          <div className="glass-card p-md rounded-xl flex flex-col gap-sm">
            <div className="flex flex-col w-full">
              <span className="font-label-caps text-label-caps text-white/40">GOAL NAME</span>
              <input 
                type="text" 
                value={goalName} 
                onChange={(e) => setGoalName(e.target.value)} 
                placeholder="e.g. New Laptop" 
                className="bg-transparent border-none outline-none font-body-lg text-body-lg text-white w-full placeholder-white/20 mt-1"
              />
            </div>
            <div className="h-px bg-white/10 w-full my-2"></div>
            <div className="flex flex-col w-full">
              <span className="font-label-caps text-label-caps text-white/40">TARGET AMOUNT</span>
              <div className="flex items-center gap-2">
                <span className="text-white/40">$</span>
                <input 
                  type="number" 
                  value={targetAmount} 
                  onChange={(e) => setTargetAmount(e.target.value)} 
                  placeholder="0.00" 
                  className="bg-transparent border-none outline-none font-body-lg text-body-lg text-white w-full placeholder-white/20 mt-1"
                />
              </div>
            </div>
            <button onClick={handleSaveGoal} className="w-full h-12 mt-4 bg-[#CCFF00] rounded-lg flex items-center justify-center active:scale-95 transition-all">
              <span className="font-label-caps text-black font-black uppercase tracking-widest">SAVE GOAL</span>
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-md">
          <h2 className="font-headline-md text-headline-md text-white tracking-tight">Active Goals</h2>
          {goals.length === 0 ? (
            <div className="text-white/40 text-sm text-center py-8">No active goals yet.</div>
          ) : (
            goals.map(goal => {
              const progress = Math.min((totalBalance / goal.targetAmount) * 100, 100);
              return (
                <div key={goal.id} className="glass-card p-4 rounded-xl flex flex-col gap-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-body-lg font-bold text-white">{goal.name}</span>
                    <span className="font-numeric-data text-[#CCFF00]">${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#CCFF00] to-[#88AA00]"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-label-caps text-[10px] text-white/40">PROGRESS</span>
                    <span className="font-label-caps text-[10px] text-white">{progress.toFixed(0)}%</span>
                  </div>
                </div>
              );
            })
          )}
        </section>
      </main>
      
      <nav className="fixed bottom-0 left-0 w-full z-50 bg-black/70 backdrop-blur-[20px] border-t border-white/15 flex justify-around items-center px-4 pb-8 pt-3">
        <Link to="/dashboard" className="flex flex-col items-center justify-center text-gray-500 hover:text-white transition-colors active:scale-90 duration-200">
          <span className="material-symbols-outlined" data-icon="analytics">analytics</span>
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
