import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import { ExpenseProvider } from './context/ExpenseContext';

// Global CSS styles applied to App
import './index.css';

export default function App() {
  return (
    <ExpenseProvider>
      <Router>
        <div className="flex-1 flex flex-col w-full h-full">
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/expense-history" element={<ExpenseHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals" element={<Goals />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ExpenseProvider>
  );
}
