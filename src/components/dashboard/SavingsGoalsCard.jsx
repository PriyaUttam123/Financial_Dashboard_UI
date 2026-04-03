import React, { useState, useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { 
  Target, 
  Plus, 
  Edit3, 
  Check, 
  X, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

const SavingsGoalsCard = React.memo(function SavingsGoalsCard() {
  const { stats } = useGlobalContext();
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 10000, current: 6500, deadline: '2026-12-31' },
    { id: 2, name: 'Vacation', target: 3000, current: 1200, deadline: '2026-07-01' },
    { id: 3, name: 'New Laptop', target: 2000, current: 800, deadline: '2026-09-01' }
  ]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '' });
  const [editingGoal, setEditingGoal] = useState(null);

  const totalSavings = stats.totalIncome - stats.totalExpense;
  const monthlySavingsRate = useMemo(() => {
    const totalIncome = stats.totalIncome;
    return totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  }, [totalSavings, stats.totalIncome]);

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.target && newGoal.deadline) {
      const goal = {
        id: Date.now(),
        name: newGoal.name,
        target: parseFloat(newGoal.target),
        current: 0,
        deadline: newGoal.deadline
      };
      setGoals([...goals, goal]);
      setNewGoal({ name: '', target: '', deadline: '' });
      setIsAddingGoal(false);
    }
  };

  const handleUpdateGoal = (goalId, updates) => {
    setGoals(goals.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
    setEditingGoal(null);
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthlyRequired = (target, current, deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const monthsRemaining = Math.max(0, (deadlineDate.getFullYear() - today.getFullYear()) * 12 + 
                     (deadlineDate.getMonth() - today.getMonth()));
    const remaining = target - current;
    return monthsRemaining > 0 ? remaining / monthsRemaining : 0;
  };

  return (
    <div className="glass-card-hover p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shadow-lg">
            <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Savings Goals</h3>
            <p className="text-xs text-surface-500 dark:text-surface-500">Track your progress</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAddingGoal(true)}
          className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-surface-500">Monthly Savings</span>
          </div>
          <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
            ${totalSavings.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-500">{monthlySavingsRate.toFixed(1)}% rate</p>
        </div>
        <div className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-3 h-3 text-primary-500" />
            <span className="text-xs text-surface-500">Active Goals</span>
          </div>
          <p className="text-lg font-bold text-surface-900 dark:text-surface-100">
            {goals.length}
          </p>
          <p className="text-xs text-primary-500">
            ${goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()} saved
          </p>
        </div>
      </div>

      {/* Goals List */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {goals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target);
          const monthlyRequired = calculateMonthlyRequired(goal.target, goal.current, goal.deadline);
          const isEditing = editingGoal === goal.id;

          return (
            <div key={goal.id} className="bg-surface-50 dark:bg-surface-800/50 rounded-lg p-3">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={goal.name}
                    onChange={(e) => handleUpdateGoal(goal.id, { name: e.target.value })}
                    className="w-full bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded px-2 py-1 text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={goal.target}
                      onChange={(e) => handleUpdateGoal(goal.id, { target: parseFloat(e.target.value) })}
                      className="flex-1 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded px-2 py-1 text-sm"
                      placeholder="Target"
                    />
                    <input
                      type="date"
                      value={goal.deadline}
                      onChange={(e) => handleUpdateGoal(goal.id, { deadline: e.target.value })}
                      className="flex-1 bg-surface-100 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => setEditingGoal(null)}
                      className="flex-1 p-1 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30"
                    >
                      <Check className="w-3 h-3 mx-auto" />
                    </button>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="flex-1 p-1 bg-rose-500/20 text-rose-400 rounded text-xs hover:bg-rose-500/30"
                    >
                      <X className="w-3 h-3 mx-auto" />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-surface-900 dark:text-surface-100">
                      {goal.name}
                    </h4>
                    <button 
                      onClick={() => setEditingGoal(goal.id)}
                      className="p-1 text-surface-400 hover:text-primary-500 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-surface-500">
                        ${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}
                      </span>
                      <span className="text-surface-500">{progress.toFixed(0)}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-primary-500 transition-all duration-500 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-surface-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                      {monthlyRequired > 0 && (
                        <div className="flex items-center gap-1 text-amber-500">
                          <TrendingUp className="w-3 h-3" />
                          ${monthlyRequired.toFixed(0)}/mo
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}

        {goals.length === 0 && (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No savings goals yet
            </p>
            <p className="text-xs text-surface-400 mt-1">
              Click the + button to add your first goal
            </p>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 w-96 max-w-[90%]">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Add Savings Goal
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2"
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  className="w-full bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2"
                  placeholder="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 bg-primary-500 text-white rounded-lg py-2 hover:bg-primary-600 transition-colors"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => {
                    setIsAddingGoal(false);
                    setNewGoal({ name: '', target: '', deadline: '' });
                  }}
                  className="flex-1 bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-300 rounded-lg py-2 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default SavingsGoalsCard;
