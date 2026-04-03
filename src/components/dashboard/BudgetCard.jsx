import React, { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { Target, AlertTriangle, Edit3, Check, X } from 'lucide-react';

const BudgetCard = React.memo(function BudgetCard() {
  const { stats, monthlyBudget, setMonthlyBudget } = useGlobalContext();
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);

  const spent = stats.totalExpense;
  const percentage = Math.min((spent / monthlyBudget) * 100, 100);
  const isOverBudget = spent > monthlyBudget;
  const isNearLimit = percentage >= 90 && !isOverBudget;

  const handleSave = () => {
    setMonthlyBudget(Number(tempBudget));
    setIsEditing(false);
  };

  return (
    <div className="glass-card-hover p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
            isOverBudget ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400' : 'bg-primary-500/20 text-primary-600 dark:text-primary-400'
          }`}>
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Monthly Budget</h3>
            <p className="text-xs text-surface-500 dark:text-surface-500">Target spending</p>
          </div>
        </div>
        
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button 
              onClick={handleSave}
              className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              <Check className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="p-1.5 bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 rounded-lg hover:text-primary-500 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-end justify-between">
          <div>
            {isEditing ? (
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400 text-sm">$</span>
                <input
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg pl-6 pr-3 py-1 w-28 text-lg font-bold text-surface-900 dark:text-surface-100 focus:outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>
            ) : (
              <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">${monthlyBudget.toLocaleString()}</p>
            )}
            <p className="text-xs text-surface-500 mt-1">Total limit</p>
          </div>
          <div className="text-right">
            <p className={`text-lg font-bold ${isOverBudget ? 'text-rose-500 dark:text-rose-400' : 'text-surface-800 dark:text-surface-200'}`}>
              ${spent.toLocaleString()}
            </p>
            <p className="text-xs text-surface-500 mt-1">Spent so far</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative w-full h-3 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-700 ease-out rounded-full ${
              isOverBudget ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-primary-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-surface-400">{percentage.toFixed(0)}% used</span>
          {isOverBudget ? (
            <span className="flex items-center gap-1 text-rose-400 font-medium">
              <AlertTriangle className="w-3 h-3" />
              Over limit
            </span>
          ) : (
            <span className="text-surface-500">${(monthlyBudget - spent).toLocaleString()} remaining</span>
          )}
        </div>
      </div>

      {isOverBudget && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex gap-2 items-start animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-rose-400 leading-relaxed font-medium">
            Warning: You've exceeded your monthly budget by ${(spent - monthlyBudget).toLocaleString()}. Consider reviewing your expenses.
          </p>
        </div>
      )}
      {isNearLimit && !isOverBudget && (
        <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-2 items-start animate-fade-in">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
          <p className="text-[11px] text-amber-400 leading-relaxed font-medium">
            Heads up: You've used 90% of your budget. Only ${(monthlyBudget - spent).toLocaleString()} left for this month.
          </p>
        </div>
      )}
    </div>
  );
});

export default BudgetCard;
