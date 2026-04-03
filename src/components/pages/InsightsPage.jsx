import { useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Target,
  AlertTriangle,
  PieChart,
  BarChart3,
} from 'lucide-react';

export default function InsightsPage() {
  const { filteredTransactions, monthlyBudget } = useGlobalContext();

  const insights = useMemo(() => {
    // Calculate spending by category
    const spendingByCategory = {};
    let totalExpenses = 0;
    let totalIncome = 0;

    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'Expense') {
        spendingByCategory[transaction.category] = 
          (spendingByCategory[transaction.category] || 0) + transaction.amount;
        totalExpenses += transaction.amount;
      } else {
        totalIncome += transaction.amount;
      }
    });

    // Find highest spending category
    const highestSpendingCategory = Object.entries(spendingByCategory)
      .sort(([,a], [,b]) => b - a)[0];

    // Calculate monthly comparison (current month vs previous month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const currentMonthTransactions = filteredTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const previousMonthTransactions = filteredTransactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === (currentMonth - 1 + 12) % 12 && 
             date.getFullYear() === currentMonth === 0 ? currentYear - 1 : currentYear;
    });

    const currentMonthExpenses = currentMonthTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyChange = previousMonthExpenses > 0 
      ? ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
      : 0;

    // Budget status
    const budgetUsed = (currentMonthExpenses / monthlyBudget) * 100;
    const remainingBudget = monthlyBudget - currentMonthExpenses;

    // Generate observations
    const observations = [];
    
    if (budgetUsed > 90) {
      observations.push({
        type: 'warning',
        icon: AlertTriangle,
        message: `You've used ${budgetUsed.toFixed(1)}% of your monthly budget`,
        color: 'text-amber-600 dark:text-amber-400'
      });
    }

    if (monthlyChange > 10) {
      observations.push({
        type: 'trend',
        icon: TrendingUp,
        message: `Spending increased by ${monthlyChange.toFixed(1)}% compared to last month`,
        color: 'text-red-600 dark:text-red-400'
      });
    } else if (monthlyChange < -10) {
      observations.push({
        type: 'trend',
        icon: TrendingDown,
        message: `Great! Spending decreased by ${Math.abs(monthlyChange).toFixed(1)}% compared to last month`,
        color: 'text-green-600 dark:text-green-400'
      });
    }

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    if (savingsRate > 20) {
      observations.push({
        type: 'positive',
        icon: Target,
        message: `Excellent savings rate of ${savingsRate.toFixed(1)}%`,
        color: 'text-green-600 dark:text-green-400'
      });
    }

    return {
      highestSpendingCategory,
      currentMonthExpenses,
      previousMonthExpenses,
      monthlyChange,
      budgetUsed,
      remainingBudget,
      totalExpenses,
      totalIncome,
      savingsRate,
      observations,
      spendingByCategory
    };
  }, [filteredTransactions, monthlyBudget]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
          Financial Insights
        </h1>
        <p className="text-surface-600 dark:text-surface-400 mt-2">
          Smart analysis of your financial data
        </p>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Highest Spending Category */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <PieChart className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400">This Month</span>
          </div>
          <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
            Highest Spending
          </h3>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {insights.highestSpendingCategory ? insights.highestSpendingCategory[0] : 'N/A'}
          </p>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {insights.highestSpendingCategory ? formatCurrency(insights.highestSpendingCategory[1]) : '$0'}
          </p>
        </div>

        {/* Monthly Comparison */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400">vs Last Month</span>
          </div>
          <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
            Monthly Change
          </h3>
          <div className="flex items-center gap-2">
            <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
              {insights.monthlyChange > 0 ? '+' : ''}{insights.monthlyChange.toFixed(1)}%
            </p>
            {insights.monthlyChange > 0 ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-500" />
            )}
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {formatCurrency(insights.currentMonthExpenses)} this month
          </p>
        </div>

        {/* Budget Status */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Budget</span>
          </div>
          <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
            Budget Used
          </h3>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {insights.budgetUsed.toFixed(1)}%
          </p>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {formatCurrency(insights.remainingBudget)} remaining
          </p>
        </div>

        {/* Savings Rate */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-surface-500 dark:text-surface-400">Overall</span>
          </div>
          <h3 className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
            Savings Rate
          </h3>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {insights.savingsRate.toFixed(1)}%
          </p>
          <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
            {formatCurrency(insights.totalIncome - insights.totalExpenses)} saved
          </p>
        </div>
      </div>

      {/* Observations */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Key Observations
        </h2>
        <div className="space-y-3">
          {insights.observations.length > 0 ? (
            insights.observations.map((observation, index) => {
              const Icon = observation.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-surface-50 dark:bg-surface-700/50">
                  <Icon className={`w-5 h-5 mt-0.5 ${observation.color}`} />
                  <p className="text-sm text-surface-700 dark:text-surface-300">
                    {observation.message}
                  </p>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-surface-500 dark:text-surface-400">
              No specific observations at this time. Keep tracking your transactions!
            </p>
          )}
        </div>
      </div>

      {/* Spending by Category */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Spending Breakdown
        </h2>
        <div className="space-y-3">
          {Object.entries(insights.spendingByCategory)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 6)
            .map(([category, amount]) => {
              const percentage = insights.totalExpenses > 0 ? (amount / insights.totalExpenses) * 100 : 0;
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                    <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                      {category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-surface-200 dark:bg-surface-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-surface-600 dark:text-surface-400 w-20 text-right">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
