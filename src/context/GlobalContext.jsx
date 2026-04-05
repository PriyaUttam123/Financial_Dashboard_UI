import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [userRole, setUserRole] = useState('Admin');
  const [transactions, setTransactions] = useState(mockTransactions);
  const [filters, setFilters] = useState({ search: '', category: 'All' });
  const [activePage, setActivePage] = useState('Dashboard');
  const [monthlyBudget, setMonthlyBudget] = useState(5000);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Apply theme to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // Transaction CRUD operations
  const addTransaction = (newTransaction) => {
    setTransactions(prev => [...prev, newTransaction]);
  };

  const updateTransaction = (transactionId, updatedTransaction) => {
    setTransactions(prev => 
      prev.map(t => t.id === transactionId ? { ...updatedTransaction, id: transactionId } : t)
    );
  };

  const deleteTransaction = (transactionId) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        filters.search === '' ||
        t.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        t.category.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory =
        filters.category === 'All' || t.category === filters.category;

      return matchesSearch && matchesCategory;
    });
  }, [transactions, filters]);

  const stats = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = filteredTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const transactionCount = filteredTransactions.length;

    return { totalIncome, totalExpense, balance, transactionCount };
  }, [filteredTransactions]);

  const value = useMemo(() => ({
    userRole,
    setUserRole,
    transactions,
    setTransactions,
    filteredTransactions,
    filters,
    setFilters,
    activePage,
    setActivePage,
    stats,
    monthlyBudget,
    setMonthlyBudget,
    isDarkMode,
    toggleDarkMode,
    sidebarCollapsed,
    setSidebarCollapsed,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }), [userRole, transactions, filteredTransactions, filters, activePage, stats, monthlyBudget, isDarkMode, sidebarCollapsed]);

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
}

export default GlobalContext;
