import React from 'react';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2, Repeat } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

const categoryColors = {
  'Salary':       'from-emerald-500 to-emerald-700', // Income
  'Freelance':    'from-emerald-400 to-emerald-600', // Income
  'Investment':   'from-sky-500 to-sky-700',       // Neutral/Investment
  'Food & Dining':'from-rose-500 to-rose-700',      // Expense
  'Utilities':    'from-rose-400 to-rose-600',      // Expense
  'Transport':    'from-amber-500 to-amber-700',    // Expense
  'Shopping':     'from-pink-500 to-pink-700',     // Expense
  'Entertainment':'from-rose-500 to-rose-700',      // Expense
  'Rent':         'from-red-500 to-red-700',       // Expense
};

const TransactionRow = React.memo(function TransactionRow({ t, isAdmin, onEditTransaction }) {
  const { deleteTransaction } = useGlobalContext();
  const isIncome = t.type === 'Income';
  const isExpense = t.type === 'Expense';
  const isNeutral = !isIncome && !isExpense;
  
  const gradient = categoryColors[t.category] || 'from-surface-500 to-surface-700';

  const handleEdit = () => {
    if (onEditTransaction) {
      onEditTransaction(t);
    }
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${t.description}"?`)) {
      deleteTransaction(t.id);
    }
  };

  const getAmountColor = () => {
    if (isIncome) return 'text-emerald-600 dark:text-emerald-400';
    if (isExpense) return 'text-rose-600 dark:text-rose-400';
    return 'text-sky-600 dark:text-sky-400';
  };

  const getBadgeClass = () => {
    if (isIncome) return 'badge-income';
    if (isExpense) return 'badge-expense';
    return 'badge-neutral'; // Need to define this in CSS
  };

  return (
    <tr className="border-b border-surface-100 dark:border-surface-700/40 hover:bg-surface-50/50 dark:hover:bg-surface-800/40 transition-all duration-200 group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {t.category.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-surface-900 dark:text-surface-200 truncate max-w-[200px]">{t.description}</p>
              {t.isRecurring && (
                <div className="tooltip-container" title="Recurring Monthly">
                  <Repeat className="w-3 h-3 text-primary-500 dark:text-primary-400" />
                </div>
              )}
            </div>
            <p className="text-xs text-surface-500 dark:text-surface-500 mt-0.5">{t.date}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-surface-600 dark:text-surface-300">{t.category}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`badge ${getBadgeClass()}`}>
          {isIncome ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {t.type}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={`text-sm font-bold ${getAmountColor()}`}>
          {isIncome ? '+' : isExpense ? '-' : ''}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </td>
      {isAdmin && (
        <td className="py-4 px-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={handleEdit}
              className="p-1.5 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors cursor-pointer" 
              title="Edit row"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              className="p-1.5 text-surface-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" 
              title="Delete row"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
});

export default TransactionRow;
