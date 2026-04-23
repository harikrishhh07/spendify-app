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

// Utility function to detect subscriptions
const detectSubscriptions = (transactions) => {
  const categoryMap = {};
  
  transactions.forEach(t => {
    if (t.type === 'expense') {
      if (!categoryMap[t.category]) categoryMap[t.category] = [];
      categoryMap[t.category].push(t);
    }
  });

  const subscriptions = [];
  Object.entries(categoryMap).forEach(([category, items]) => {
    if (items.length >= 3) {
      const amounts = items.map(i => i.amount).sort((a, b) => a - b);
      const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const isRecurring = amounts.every(a => Math.abs(a - avgAmount) < avgAmount * 0.1);
      
      if (isRecurring) {
        subscriptions.push({
          category,
          amount: Math.round(avgAmount),
          frequency: 'Monthly',
          transactions: items.length
        });
      }
    }
  });

  return subscriptions;
};

// Utility function to generate smart insights
const generateSmartInsights = (transactions) => {
  const insights = [];
  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const categoryMap = {};
  const categoryMapLastMonth = {};

  transactions.forEach(t => {
    if (t.type === 'expense') {
      const txDate = new Date(t.date);
      if (!categoryMap[t.category]) categoryMap[t.category] = 0;
      categoryMap[t.category] += t.amount;

      if (txDate >= lastMonth) {
        if (!categoryMapLastMonth[t.category]) categoryMapLastMonth[t.category] = [];
        categoryMapLastMonth[t.category].push({
          amount: t.amount,
          date: txDate
        });
      }
    }
  });

  // Generate insights based on spending patterns
  Object.entries(categoryMapLastMonth).forEach(([category, items]) => {
    if (items.length > 0) {
      const thisWeekSpent = items
        .filter(i => i.date >= lastWeek)
        .reduce((acc, i) => acc + i.amount, 0);
      
      const previousWeekSpent = items
        .filter(i => i.date >= new Date(lastWeek.getTime() - 7 * 24 * 60 * 60 * 1000) && i.date < lastWeek)
        .reduce((acc, i) => acc + i.amount, 0);

      if (previousWeekSpent > 0) {
        const percentageChange = ((thisWeekSpent - previousWeekSpent) / previousWeekSpent) * 100;
        if (Math.abs(percentageChange) > 15) {
          const trend = percentageChange > 0 ? 'up' : 'down';
          const trendText = trend === 'up' ? 'more' : 'less';
          insights.push({
            category,
            message: `You spent ${Math.round(Math.abs(percentageChange))}% ${trendText} on ${category.toLowerCase()} this week`,
            type: trend === 'up' ? 'warning' : 'positive',
            percentage: Math.round(Math.abs(percentageChange))
          });
        }
      }
    }
  });

  return insights;
};

// Utility function for budget alerts
const getBudgetAlerts = (transactions, budgets) => {
  const alerts = [];
  
  Object.entries(budgets).forEach(([category, budget]) => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category === category)
      .reduce((acc, curr) => acc + curr.amount, 0);
    
    const percentage = (spent / budget) * 100;
    
    if (percentage >= 100) {
      alerts.push({
        category,
        type: 'critical',
        message: `Budget exceeded by ₹${Math.round(spent - budget)} on ${category}`,
        spent,
        budget,
        percentage: Math.round(percentage)
      });
    } else if (percentage >= 80) {
      alerts.push({
        category,
        type: 'warning',
        message: `${Math.round(percentage)}% of ${category} budget used`,
        spent,
        budget,
        percentage: Math.round(percentage)
      });
    }
  });

  return alerts;
};

export const ExpenseProvider = ({ children }) => {
  const [initialBalance, setInitialBalance] = useState(() => {
    try {
      const saved = localStorage.getItem('spendify_initial_balance');
      return saved ? parseFloat(saved) : 50000;
    } catch (e) {
      return 50000;
    }
  });

  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('spendify_transactions_v2');
      if (saved) return JSON.parse(saved);
      return initialTransactions;
    } catch (e) {
      return initialTransactions;
    }
  });

  const [goals, setGoals] = useState(() => {
    try {
      const saved = localStorage.getItem('spendify_goals_v2');
      if (saved) return JSON.parse(saved);
      return [];
    } catch (e) {
      return [];
    }
  });

  const [budgets] = useState(initialBudgets);

  useEffect(() => {
    try {
      localStorage.setItem('spendify_transactions_v2', JSON.stringify(transactions));
    } catch (e) {
      console.warn('Failed to save transactions to localStorage');
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem('spendify_goals_v2', JSON.stringify(goals));
    } catch (e) {
      console.warn('Failed to save goals to localStorage');
    }
  }, [goals]);

  useEffect(() => {
    try {
      localStorage.setItem('spendify_initial_balance', initialBalance.toString());
    } catch (e) {
      console.warn('Failed to save initial balance to localStorage');
    }
  }, [initialBalance]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, id: Date.now().toString() }, ...transactions]);
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const addGoal = (goal) => {
    setGoals([{ ...goal, id: Date.now().toString() }, ...goals]);
  };

  const setBalance = (amount) => {
    setInitialBalance(amount);
  };

  const totalExpensesAmount = transactions.reduce((acc, curr) => {
    return curr.type === 'expense' ? acc + curr.amount : acc;
  }, 0);

  const totalIncomeAmount = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc;
  }, 0);

  const totalBalance = initialBalance + totalIncomeAmount - totalExpensesAmount;

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

  // Calculate smart insights
  const smartInsights = generateSmartInsights(transactions);

  // Detect subscriptions
  const subscriptions = detectSubscriptions(transactions);

  // Get budget alerts
  const budgetAlerts = getBudgetAlerts(transactions, budgets);

  return (
    <ExpenseContext.Provider value={{
      transactions,
      budgets,
      goals,
      achievements,
      totalBalance,
      totalExpenses,
      initialBalance,
      smartInsights,
      subscriptions,
      budgetAlerts,
      addTransaction,
      deleteTransaction,
      addGoal,
      setBalance
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};
