import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses } from '../context/ExpenseContext';
import { Flame, Target, Brain, AlertTriangle, LogOut, ShieldAlert, Loader2, Trash2 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { achievements, resetData } = useExpenses();
  const { currentUser, logout } = useAuth();
  const { achievements } = useExpenses();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to delete all transactions and reset your account?")) {
      resetData();
      window.location.reload();
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/users/${currentUser.sqlUserId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert('Your account and all data have been permanently deleted.');
        // Clear auth state and logout
        await logout();
      } else {
        alert(`Error: ${data.message || 'Failed to delete account'}`);
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-yellow-300 mb-2">Your Profile</h1>
        <p className="text-yellow-200">Manage your account and settings.</p>
      </header>

      <div className="glass-panel p-8 flex flex-col md:flex-row items-center gap-6 justify-center">
        <div className="w-24 h-24 rounded-full border-2 border-yellow-500 overflow-hidden bg-slate-800 flex-shrink-0 relative group">
          {currentUser?.photoURL ? (
            <img className="w-full h-full object-cover" src={currentUser.photoURL} alt="Profile" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-yellow-400 bg-yellow-500/10">
              {currentUser?.displayName?.[0] || 'U'}
            </div>
          )}
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-yellow-300">{currentUser?.displayName || 'User'}</h2>
          <p className="text-yellow-200 mt-1">{currentUser?.email || 'No email associated'}</p>
          <div className="inline-flex px-3 py-1 bg-yellow-500/10 text-yellow-300 rounded-full text-xs font-medium border border-yellow-500/20">
            Pro Member
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 ${achievements.budgetStreak ? 'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20' : 'bg-yellow-500/5 text-yellow-300/50'}`}>
            <Flame size={28} />
          </div>
          <h3 className="font-semibold text-yellow-300 mb-1">Budget Streak</h3>
          <p className="text-xs text-yellow-200">{achievements.budgetStreak ? 'Unlocked' : 'Keep your expenses under budget 3 times'}</p>
        </div>

        <div className="glass-panel p-6 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 ${achievements.savingsGoalMet ? 'bg-teal-500/20 text-teal-400 shadow-lg shadow-teal-500/20' : 'bg-yellow-500/5 text-yellow-300/50'}`}>
            <Target size={28} />
          </div>
          <h3 className="font-semibold text-yellow-300 mb-1">Goal Crusher</h3>
          <p className="text-xs text-yellow-200">{achievements.savingsGoalMet ? 'Unlocked' : 'Achieve a savings goal'}</p>
        </div>

        <div className="glass-panel p-6 text-center">
          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-4 ${achievements.smartSpender ? 'bg-yellow-500/20 text-yellow-400 shadow-lg shadow-yellow-500/20' : 'bg-yellow-500/5 text-yellow-300/50'}`}>
            <Brain size={28} />
          </div>
          <h3 className="font-semibold text-yellow-300 mb-1">Smart Spender</h3>
          <p className="text-xs text-yellow-200">{achievements.smartSpender ? 'Unlocked' : 'Spend less than budget'}</p>
        </div>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-xl font-semibold text-yellow-300 mb-4">Account Actions</h2>
        <div className="space-y-4">
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/20 text-red-400 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <span>{isDeleting ? 'Deleting...' : 'Reset Account Data'}</span>
            <span><AlertTriangle size={18} /></span>
          </button>
          
          <button 
            onClick={logout}
            className="w-full flex items-center justify-between p-4 rounded-xl bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors border border-yellow-500/30 text-yellow-300 font-medium"
          >
            <span className="font-medium">Log Out</span>
            <span><LogOut size={18} /></span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel p-8 max-w-md w-full animate-in fade-in scale-in duration-300">
            <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center gap-2">
              <span><AlertTriangle size={24} /></span> Permanent Deletion
            </h3>
            
            <p className="text-yellow-200 mb-6">
              This action will <strong>permanently delete</strong> your account and all associated data including:
            </p>
            
            <ul className="space-y-2 mb-6 text-sm text-yellow-200/80">
              <li className="flex items-center gap-2">
                <span className="text-red-400">•</span> All expenses and income records
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">•</span> All budgets and savings goals
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">•</span> All payment methods
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-400">•</span> Your profile information
              </li>
            </ul>
            
            <p className="text-red-400 font-semibold mb-6 text-sm">
              <span className="flex items-center gap-1"><ShieldAlert size={16} /> This action cannot be undone!</span>
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-yellow-500/30"
              >
                Cancel
              </button>
              <button
                onClick={handleResetAccountData}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    Delete Account
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
