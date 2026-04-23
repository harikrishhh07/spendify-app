import React, { createContext, useState, useEffect, useContext } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

const initialTransactions = [
  { id: '1', name: 'Salary Deposit', amount: 8500, type: 'income', category: 'Income', date: new Date().toISOString() },
  { id: '2', name: 'Rent', amount: 2100, type: 'expense', category: 'Housing', date: new Date().toISOString() },
  { id: '3', name: 'Whole Foods Market', amount: 124.50, type: 'expense', category: 'Food', date: new Date().toISOString() },
  { id: '4', name: 'Uber Trip', amount: 32.00, type: 'expense', category: 'Transport', date: new Date().toISOString() },
];

const initialBudgets = {
  Housing: 2500,
  Food: 800,
  Fun: 500,
  Transport: 400
};

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('spendify_transactions');
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('spendify_goals');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [budgets] = useState(initialBudgets);

  useEffect(() => {
    localStorage.setItem('spendify_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendify_goals', JSON.stringify(goals));
  }, [goals]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: Date.now().toString() }, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = (goal) => {
    setGoals([{ ...goal, id: Date.now().toString() }, ...goals]);
  };

  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const totalExpenses = transactions.reduce((acc, curr) => {
    return curr.type === 'expense' ? acc + curr.amount : acc;
  }, 0);

  const totalBudgets = Object.values(budgets).reduce((acc, curr) => acc + curr, 0);

  // Dynamic achievements calculation
  const achievements = {
    budgetStreak: transactions.filter(t => t.type === 'expense').length >= 3 && totalExpenses <= totalBudgets,
    savingsGoalMet: goals.length > 0 && goals.some(g => totalBalance >= g.targetAmount),
    smartSpender: totalExpenses > 0 && totalExpenses <= totalBudgets
  };

  return (
    <ExpenseContext.Provider value={{
      transactions,
      budgets,
      goals,
      achievements,
      totalBalance,
      totalExpenses,
      addTransaction,
      deleteTransaction,
      addGoal
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
