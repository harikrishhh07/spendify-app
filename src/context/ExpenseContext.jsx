import React, { createContext, useState, useEffect, useContext } from 'react';

const ExpenseContext = createContext();

export const useExpenses = () => useContext(ExpenseContext);

const initialTransactions = [];

const initialBudgets = {
  Housing: 15000,
  Food: 5000,
  Fun: 3000,
  Transport: 2000
};

export const ExpenseProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('spendify_transactions_v2');
    if (saved) return JSON.parse(saved);
    return initialTransactions;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('spendify_goals_v2');
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [budgets] = useState(initialBudgets);

  useEffect(() => {
    localStorage.setItem('spendify_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('spendify_goals_v2', JSON.stringify(goals));
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
