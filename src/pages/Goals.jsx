import React, { useState } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { Sparkles, Target, Calendar } from 'lucide-react';

export default function Goals() {
  const { goals, addGoal, summary } = useExpenses();
  const [goalName, setGoalName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalName || !amount) return;
    addGoal({ goalName, amount: Number(amount) });
    setGoalName('');
    setAmount('');
  };

  const totalBalance = summary.netBalance || 0;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-600/20 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
          <div className="relative">
            <h1 className="text-5xl font-black tracking-tight mb-3 bg-linear-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              GOALS & BUDGETS
            </h1>
            <p className="text-lg text-yellow-200">Set ambitious targets and track your progress towards financial freedom with precision.</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Add Goal Form */}
        <div className="lg:col-span-1">
          <div className="relative group">
            <div className="absolute inset-0 bg-linear-to-r from-yellow-600/20 to-yellow-600/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="relative goals-panel p-8 rounded-2xl backdrop-blur-xl transition-all duration-300">
              {/* Header with gradient background */}
              <div className="mb-8 -mx-8 -mt-8 px-8 pt-8 pb-6 bg-gradient-to-r from-yellow-600/20 via-yellow-500/10 to-transparent rounded-t-2xl border-b border-yellow-500/30">
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-3 text-yellow-300">
                  <span className="p-3 bg-yellow-500/20 rounded-xl text-yellow-400"><Sparkles size={24} /></span>
                  Create Goal
                </h2>
                <p className="text-sm text-yellow-200">Set and track your savings goals</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider">Goal Name</label>
                  <input
                    type="text"
                    required
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                    className="w-full bg-yellow-500/10 border-2 border-yellow-500/40 rounded-2xl py-3 px-4 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-yellow-300/50 hover:border-yellow-500/60"
                    placeholder="e.g., Vacation Trip"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-yellow-500/10 border-2 border-yellow-500/40 rounded-2xl py-3 px-4 text-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all placeholder:text-yellow-300/50 hover:border-yellow-500/60"
                    placeholder="10000"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl font-bold text-yellow-400 text-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/50 hover:from-slate-700 hover:to-slate-800 hover:text-yellow-300 transition-all shadow-lg shadow-yellow-500/20 mt-4 hover:shadow-yellow-500/30 hover:-translate-y-0.5 active:translate-y-0 transform hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center gap-2 justify-center"><Sparkles size={18} /> CREATE GOAL</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-6 text-yellow-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Target size={20} /></span>
                Active Savings Goals
              </div>
              <span className="text-sm font-normal text-yellow-200">Available: ₹{totalBalance.toLocaleString()}</span>
            </h2>
            
            {goals.length === 0 ? (
              <div className="h-32 flex items-center justify-center text-yellow-300 border border-dashed border-slate-700 rounded-xl">
                No savings goals set yet.
              </div>
            ) : (
              <div className="space-y-6">
                {goals.map((goal, idx) => {
                  const progress = Math.min((totalBalance / goal.amount) * 100, 100).toFixed(0);
                  const isCompleted = progress >= 100;
                  
                  return (
                    <div key={goal.id || idx} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <h3 className="font-medium text-lg text-white flex items-center gap-2">
                            {goal.goalName}
                            {isCompleted && <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-400">Achieved</span>}
                          </h3>
                          <p className="text-sm text-yellow-300">₹{totalBalance.toLocaleString()} of ₹{Number(goal.amount).toLocaleString()}</p>
                        </div>
                        <span className={`text-xl font-bold ${isCompleted ? 'text-teal-400' : 'text-yellow-400'}`}>
                          {progress}%
                        </span>
                      </div>
                      
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            isCompleted 
                              ? 'bg-linear-to-r from-teal-500 to-teal-400'
                              : 'bg-linear-to-r from-yellow-500 to-yellow-400'
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="glass-panel p-6">
             <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><Calendar size={20} /></span>
              Monthly Budget Limits
            </h2>
            <p className="text-yellow-300 mb-6 text-sm">
              Your overall spending limit for this month is set to <span className="text-white font-bold">₹{summary.budgetLimit?.toLocaleString() || 15000}</span>.
              (Manage via Settings/Profile).
            </p>
            
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-yellow-300 font-medium">Current Spending</span>
                  <span className="text-yellow-300">
                    <span className="text-white">₹{summary.totalExpense?.toLocaleString()}</span> / ₹{summary.budgetLimit?.toLocaleString() || 15000}
                  </span>
               </div>
               <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-linear-to-r from-yellow-500 to-yellow-400 rounded-full"
                    style={{ width: `${Math.min((summary.totalExpense / (summary.budgetLimit || 15000)) * 100, 100)}%` }}
                  ></div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
