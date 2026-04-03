import React, { useMemo } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ExpenseTrendsCard = React.memo(function ExpenseTrendsCard() {
  const { filteredTransactions } = useGlobalContext();

  const trendsData = useMemo(() => {
    // Group transactions by month
    const monthlyData = {};
    
    filteredTransactions.forEach(transaction => {
      if (transaction.type === 'Expense') {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            total: 0,
            categories: {},
            count: 0
          };
        }
        
        monthlyData[monthKey].total += transaction.amount;
        monthlyData[monthKey].categories[transaction.category] = 
          (monthlyData[monthKey].categories[transaction.category] || 0) + transaction.amount;
        monthlyData[monthKey].count += 1;
      }
    });

    // Convert to array and sort by month
    const sortedData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
    
    // Calculate month-over-month changes
    return sortedData.map((item, index) => {
      const previousTotal = index > 0 ? sortedData[index - 1].total : 0;
      const change = previousTotal > 0 ? ((item.total - previousTotal) / previousTotal) * 100 : 0;
      
      return {
        ...item,
        change,
        displayName: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        averageTransaction: item.count > 0 ? item.total / item.count : 0
      };
    });
  }, [filteredTransactions]);

  const categoryTrends = useMemo(() => {
    const categoryData = {};
    
    // Get last 3 months for comparison
    const lastThreeMonths = trendsData.slice(-3);
    
    lastThreeMonths.forEach(monthData => {
      Object.entries(monthData.categories).forEach(([category, amount]) => {
        if (!categoryData[category]) {
          categoryData[category] = {
            category,
            months: [],
            total: 0,
            trend: 0
          };
        }
        categoryData[category].months.push({ month: monthData.displayName, amount });
        categoryData[category].total += amount;
      });
    });

    // Calculate trend for each category
    Object.values(categoryData).forEach(category => {
      if (category.months.length >= 2) {
        const firstMonth = category.months[0].amount;
        const lastMonth = category.months[category.months.length - 1].amount;
        category.trend = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
      }
    });

    return Object.values(categoryData)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [trendsData]);

  const insights = useMemo(() => {
    if (trendsData.length < 2) return [];

    const insights = [];
    const latestMonth = trendsData[trendsData.length - 1];
    const previousMonth = trendsData[trendsData.length - 2];

    // Overall spending trend
    if (latestMonth.change > 10) {
      insights.push({
        type: 'warning',
        icon: ArrowUpRight,
        message: `Spending increased by ${latestMonth.change.toFixed(1)}% this month`,
        color: 'text-amber-600 dark:text-amber-400'
      });
    } else if (latestMonth.change < -10) {
      insights.push({
        type: 'positive',
        icon: ArrowDownRight,
        message: `Great! Spending decreased by ${Math.abs(latestMonth.change).toFixed(1)}%`,
        color: 'text-green-600 dark:text-green-400'
      });
    }

    // Average transaction size
    if (latestMonth.averageTransaction > previousMonth.averageTransaction * 1.2) {
      insights.push({
        type: 'info',
        icon: TrendingUp,
        message: 'Average transaction size increased significantly',
        color: 'text-blue-600 dark:text-blue-400'
      });
    }

    return insights;
  }, [trendsData]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (trendsData.length === 0) {
    return (
      <div className="glass-card-hover p-6 h-[400px] flex items-center justify-center">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-sm text-surface-500 dark:text-surface-400">
            No expense data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-hover p-6 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shadow-lg">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Expense Trends</h3>
            <p className="text-xs text-surface-500 dark:text-surface-500">Monthly analysis</p>
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="mb-4 space-y-2">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                <Icon className={`w-4 h-4 ${insight.color}`} />
                <p className="text-xs text-surface-700 dark:text-surface-300">
                  {insight.message}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={trendsData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="displayName" 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ className: 'opacity-30' }}
            />
            <YAxis 
              tick={{ fontSize: 10 }}
              tickLine={false}
              axisLine={{ className: 'opacity-30' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [formatCurrency(value), 'Total Expenses']}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Bar 
              dataKey="total" 
              fill="url(#colorGradient)" 
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category Trends Summary */}
      {categoryTrends.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
          <div className="grid grid-cols-2 gap-3">
            {categoryTrends.slice(0, 4).map((category, index) => (
              <div key={category.category} className="flex items-center justify-between">
                <span className="text-xs text-surface-600 dark:text-surface-400 truncate">
                  {category.category}
                </span>
                <div className="flex items-center gap-1">
                  {category.trend > 0 ? (
                    <ArrowUpRight className="w-3 h-3 text-red-500" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-green-500" />
                  )}
                  <span className={`text-xs font-medium ${
                    category.trend > 0 ? 'text-red-500' : 'text-green-500'
                  }`}>
                    {Math.abs(category.trend).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default ExpenseTrendsCard;
