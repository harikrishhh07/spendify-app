import React, { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useAuth } from '../context/AuthContext';
import { Wallet, AlertCircle, Check, X, BellRing, AlertTriangle, CheckCircle2, Mail, Lightbulb } from 'lucide-react';

export default function Budget() {
  const { currentUser } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [budgetSpending, setBudgetSpending] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    alertThreshold: 80,
  });

  useEffect(() => {
    if (currentUser?.sqlUserId) {
      fetchBudgets();
      fetchCategories();
    }
  }, [currentUser?.sqlUserId]);

  const fetchBudgets = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/budgets?userId=${currentUser.sqlUserId}`);
      const data = await response.json();
      setBudgets(data);
      
      // Fetch spending for each budget
      data.forEach(budget => {
        fetchBudgetSpending(budget.id);
      });
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgetSpending = async (budgetId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/budgets/${budgetId}/spending`);
      const data = await response.json();
      setBudgetSpending(prev => ({ ...prev, [budgetId]: data }));
    } catch (error) {
      console.error('Error fetching budget spending:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/categories');
      const data = await response.json();
      setCategories(data.filter(cat => cat.type === 'Expense'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    
    if (!formData.amount) {
      alert('Please enter a budget amount');
      return;
    }

    try {
      const today = new Date();
      const response = await fetch('http://127.0.0.1:5000/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.sqlUserId,
          amount: parseFloat(formData.amount),
          categoryId: formData.category ? parseInt(formData.category) : null,
          periodMonth: today.getMonth() + 1,
          periodYear: today.getFullYear(),
          alertThreshold: formData.alertThreshold,
          isActive: true,
        }),
      });

      if (response.ok) {
        const newBudget = await response.json();
        setBudgets([...budgets, newBudget]);
        setFormData({ amount: '', category: '', alertThreshold: 80 });
        setShowForm(false);
        alert('Budget created successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create budget');
      }
    } catch (error) {
      console.error('Error creating budget:', error);
      alert('Error creating budget');
    }
  };

  const handleDeleteBudget = async (budgetId) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBudgets(budgets.filter(b => b.id !== budgetId));
        alert('Budget deleted successfully!');
      } else {
        alert('Failed to delete budget');
      }
    } catch (error) {
      console.error('Error deleting budget:', error);
      alert('Error deleting budget');
    }
  };

  const resetBudgetNotification = async (budgetId) => {
    try {
      await fetch(`http://127.0.0.1:5000/api/budgets/${budgetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exceededNotificationSent: false }),
      });
      
      // Refresh budgets
      fetchBudgets();
      alert('Budget notification reset. You will receive an alert when threshold is reached again.');
    } catch (error) {
      console.error('Error resetting notification:', error);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'All Categories';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'from-red-600 to-red-400';
    if (percentage >= 80) return 'from-yellow-600 to-yellow-400';
    if (percentage >= 50) return 'from-yellow-600 to-yellow-500';
    return 'from-teal-600 to-teal-400';
  };

  const getProgressTextColor = (percentage) => {
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-yellow-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-teal-600';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <p className="text-yellow-300">Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-12">
        <div className="relative mb-8">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-600/20 rounded-full filter blur-3xl opacity-20 pointer-events-none"></div>
          <div className="relative">
            <h1 className="text-4xl font-black tracking-tight text-yellow-300 mb-2 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              BUDGET MANAGEMENT
            </h1>
            <p className="text-yellow-200">Set spending limits and receive alerts when you're approaching your budget.</p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-2.5 text-sm font-bold rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Budget
        </button>
      </header>

      {/* Budget Creation Form */}
      {showForm && (
        <div className="mb-8 bg-gradient-to-br from-yellow-600/15 via-yellow-500/10 to-transparent border-2 border-yellow-500/40 rounded-2xl p-8 backdrop-blur-lg shadow-lg shadow-yellow-500/20">
          <h2 className="text-2xl font-bold text-yellow-300 mb-8 flex items-center gap-3">
            <span className="p-3 bg-yellow-500/20 rounded-lg text-yellow-400"><Wallet size={24} /></span>
            Create New Budget
          </h2>
          <form onSubmit={handleAddBudget} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider">Budget Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g., 5000"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-lg text-yellow-100 placeholder-yellow-300/50 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-all hover:border-yellow-500/60"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider">Category (Optional)</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-lg text-yellow-100 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-all hover:border-yellow-500/60"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-yellow-300 mb-3 uppercase tracking-wider">Alert Threshold (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.alertThreshold}
                  onChange={(e) => setFormData({ ...formData, alertThreshold: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-yellow-500/10 border-2 border-yellow-500/40 rounded-lg text-yellow-100 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50 transition-all hover:border-yellow-500/60"
                />
                <p className="text-xs text-yellow-200 mt-2 font-medium flex items-center gap-1"><AlertCircle size={14} /> Alert when spending reaches this %</p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 px-6 py-3 text-sm font-bold rounded-lg bg-gradient-to-r from-slate-800 to-slate-900 border border-yellow-500/50 text-yellow-400 hover:from-slate-700 hover:to-slate-800 hover:text-yellow-300 transition-all shadow-lg shadow-yellow-500/20 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span><Check size={18} /></span> Create Budget
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 px-6 py-3 text-sm font-bold rounded-lg border-2 border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/10 transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center gap-2 justify-center"><X size={18} /> Cancel</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budgets List */}
      <div className="space-y-4">
        {budgets.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 border border-slate-700/30 rounded-2xl">
            <p className="text-yellow-300">No budgets created yet. Create your first budget to get started!</p>
          </div>
        ) : (
          budgets.map(budget => {
            const spending = budgetSpending[budget.id];
            const percentage = spending?.percentageUsed || 0;
            
            return (
              <div key={budget.id} className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm hover:border-slate-600/50 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {getCategoryName(budget.categoryId)}
                    </h3>
                    <p className="text-sm text-yellow-300">
                      {budget.periodMonth}/{budget.periodYear} • Alert at {budget.alertThreshold}%
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {budget.exceededNotificationSent && (
                      <button
                        onClick={() => resetBudgetNotification(budget.id)}
                        className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all"
                        title="Reset notification alert"
                      >
                        <span className="flex items-center gap-1"><BellRing size={14} /> Reset Alert</span>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-yellow-300">Spending Progress</span>
                    <span className={`text-sm font-bold ${getProgressTextColor(percentage)}`}>
                      {percentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-slate-700/50">
                    <div
                      className={`h-full bg-gradient-to-r ${getProgressColor(percentage)} transition-all duration-500 rounded-full`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Budget Details */}
                {spending && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-yellow-300">Budget</p>
                      <p className="text-lg font-bold text-white">₹{spending.budgetAmount.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-yellow-300">Spent</p>
                      <p className="text-lg font-bold text-orange-400">₹{spending.currentSpending.toLocaleString()}</p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-yellow-300">Remaining</p>
                      <p className={`text-lg font-bold ${spending.isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                        ₹{Math.max(0, spending.remaining).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-slate-800/30 rounded-lg p-3">
                      <p className="text-xs text-yellow-300">Status</p>
                      <p className={`text-lg font-bold ${spending.isExceeded ? 'text-red-400' : 'text-emerald-400'}`}>
                        <span className="flex items-center gap-1">{spending.isExceeded ? <><AlertTriangle size={16} /> Over</> : <><CheckCircle2 size={16} /> On Track</>}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Alert Box */}
                {spending?.isExceeded && (
                  <div className="mt-4 bg-red-600/20 border border-red-500/30 rounded-lg p-3">
                    <p className="text-sm text-red-300">
                      <strong className="flex items-center gap-2"><AlertTriangle size={16} /> Budget Exceeded!</strong> You have overspent by ₹{Math.abs(spending.remaining).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Setup Instructions */}
      <div className="mt-12 bg-slate-900/30 border border-slate-700/30 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Mail size={20} /> Email Notifications Setup</h3>
        <p className="text-yellow-300 mb-4">
          To enable budget alert emails, set up your email credentials in the backend environment variables:
        </p>
        <div className="bg-slate-800/50 rounded-lg p-4 text-sm text-yellow-300 font-mono">
          <p>MAIL_USERNAME=your-email@gmail.com</p>
          <p>MAIL_PASSWORD=your-app-password</p>
        </div>
        <p className="text-xs text-yellow-300/70 mt-4">
          <span className="flex items-center gap-1"><Lightbulb size={14} /> Use a Gmail app-specific password if you have 2FA enabled. Get it from <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Google Account Security</a></span>
        </p>
      </div>
    </div>
  );
}
