import { createContext, useContext, useState, useMemo } from 'react';
import { mockTransactions } from '../data/mockData';

const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
  const [userRole, setUserRole] = useState('Admin');
  const [transactions] = useState(mockTransactions);
  const [filters, setFilters] = useState({ search: '', category: 'All' });
  const [activePage, setActivePage] = useState('Dashboard');

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
    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;
    const transactionCount = transactions.length;

    return { totalIncome, totalExpense, balance, transactionCount };
  }, [transactions]);

  const value = {
    userRole,
    setUserRole,
    transactions,
    filteredTransactions,
    filters,
    setFilters,
    activePage,
    setActivePage,
    stats,
  };

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
