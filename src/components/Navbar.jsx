import React, { useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Receipt, PlusCircle, Wallet, Target, User, CircleDollarSign } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        if (window.scrollY > 40) {
          navRef.current.classList.add('scrolled');
        } else {
          navRef.current.classList.remove('scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!currentUser) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Transactions', path: '/expense-history', icon: <Receipt size={18} /> },
    { name: 'Add Transaction', path: '/add-expense', icon: <PlusCircle size={18} /> },
    { name: 'Budget', path: '/budget', icon: <Wallet size={18} /> },
    { name: 'Goals', path: '/goals', icon: <Target size={18} /> },
    { name: 'Profile', path: '/profile', icon: <User size={18} /> },
  ];

  return (
    <nav ref={navRef} className="fixed top-0 left-0 w-full h-16 glass-panel border-b-0 rounded-b-xl rounded-t-none z-50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500/50 flex items-center justify-center text-yellow-400 shadow-lg shadow-yellow-500/20">
          <CircleDollarSign size={20} className="text-yellow-400" />
        </div>
        <span className="text-xl font-bold text-yellow-300">Spendify</span>
      </div>
      
      <div className="hidden md:flex items-center gap-6">
        {links.map(link => (
          <Link 
            key={link.path} 
            to={link.path}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === link.path 
                ? 'bg-yellow-500/20 text-yellow-300 font-medium' 
                : 'text-yellow-200/70 hover:text-yellow-300 hover:bg-yellow-500/10'
            }`}
          >
            <span>{link.icon}</span>
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/30">
          <img src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.email}`} alt="avatar" className="w-6 h-6 rounded-full" />
          <span className="text-sm text-yellow-200 truncate max-w-[100px]">{currentUser.displayName || 'User'}</span>
        </div>
        <button 
          onClick={logout}
          className="text-sm px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20 transition-all border border-yellow-500/30 hover:border-yellow-500/50 font-medium hover:scale-105 active:scale-95"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
