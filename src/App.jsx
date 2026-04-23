import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ExpenseHistory from './pages/ExpenseHistory';
import Reports from './pages/Reports';
import Profile from './pages/Profile';
import Goals from './pages/Goals';
import CustomCursor from './components/CustomCursor';
import { ExpenseProvider } from './context/ExpenseContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Global CSS styles applied to App
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/" />;
  }
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <CustomCursor />
        <Router>
          <div className="flex-1 flex flex-col w-full h-full">
            <main>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/add-expense" element={<ProtectedRoute><AddExpense /></ProtectedRoute>} />
                <Route path="/expense-history" element={<ProtectedRoute><ExpenseHistory /></ProtectedRoute>} />
                <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </Router>
      </ExpenseProvider>
    </AuthProvider>
  );
}
