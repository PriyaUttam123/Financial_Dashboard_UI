import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = React.memo(function StatCard({ icon: Icon, label, amount, sub, positive, type }) {
  const getColorClasses = () => {
    switch (type) {
      case 'Income':
        return {
          bg: 'from-emerald-500 to-emerald-700',
          badge: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
          shadow: 'shadow-emerald-500/20'
        };
      case 'Expense':
        return {
          bg: 'from-rose-500 to-rose-700',
          badge: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
          shadow: 'shadow-rose-500/20'
        };
      default: // Neutral/Balance
        return {
          bg: 'from-primary-500 to-primary-700',
          badge: 'bg-primary-500/15 text-primary-600 dark:text-primary-400',
          shadow: 'shadow-primary-500/20'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <div className="glass-card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.shadow}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {positive !== undefined && (
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
            {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {sub}
          </span>
        )}
      </div>
      <p className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
});

export default StatCard;
