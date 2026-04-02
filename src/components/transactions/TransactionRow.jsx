import React from 'react';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';

const categoryColors = {
  'Salary':       'from-primary-500 to-primary-700',
  'Freelance':    'from-sky-500 to-sky-700',
  'Investment':   'from-emerald-500 to-emerald-700',
  'Food & Dining':'from-amber-500 to-amber-700',
  'Utilities':    'from-orange-500 to-orange-700',
  'Transport':    'from-purple-500 to-purple-700',
  'Shopping':     'from-pink-500 to-pink-700',
  'Entertainment':'from-rose-500 to-rose-700',
  'Rent':         'from-red-500 to-red-700',
};

const TransactionRow = React.memo(function TransactionRow({ t, isAdmin }) {
  const isIncome = t.type === 'Income';
  const gradient = categoryColors[t.category] || 'from-surface-500 to-surface-700';

  return (
    <tr className="border-b border-surface-700/40 hover:bg-surface-800/40 transition-colors duration-150 group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {t.category.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-200 truncate max-w-[200px]">{t.description}</p>
            <p className="text-xs text-surface-500 mt-0.5">{t.date}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-surface-300">{t.category}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {t.type}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isIncome ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </td>
      {isAdmin && (
        <td className="py-4 px-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors cursor-pointer" title="Edit row">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Delete row">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
});

export default TransactionRow;
