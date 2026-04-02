import React, { useMemo, Suspense } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Activity,
} from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import BudgetCard from '../dashboard/BudgetCard';

const BalanceTrendChart = React.lazy(() => import('../dashboard/BalanceTrendChart'));
const SpendingBreakdownChart = React.lazy(() => import('../dashboard/SpendingBreakdownChart'));

function ChartSkeleton() {
  return (
    <div className="glass-card p-6 min-h-[400px] flex flex-col items-center justify-center animate-pulse">
      <div className="w-8 h-8 rounded-full border-t-2 border-primary-500 animate-spin mb-4"></div>
      <p className="text-surface-400 text-sm">Loading chart data...</p>
    </div>
  );
}

export default function DashboardPage() {
  const { stats, filteredTransactions, userRole } = useGlobalContext();

  const balanceData = useMemo(() => {
    const sortedTransactions = [...filteredTransactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    let currentBalance = 0;
    return sortedTransactions.map((t) => {
      currentBalance += t.type === 'Income' ? t.amount : -t.amount;
      return {
        date: t.date,
        balance: currentBalance,
      };
    });
  }, [filteredTransactions]);

  const pieData = useMemo(() => {
    const expenseByCategory = filteredTransactions
      .filter((t) => t.type === 'Expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});

    return Object.entries(expenseByCategory).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredTransactions]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Dashboard Overview</h1>
          <p className="text-sm text-surface-500 mt-1">
            Welcome back · Logged in as <span className="text-primary-400 font-medium">{userRole}</span>
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 glass-card text-xs text-surface-400">
          <Activity className="w-4 h-4 text-primary-400" />
          <span>Last 30 days</span>
        </div>
      </div>

      {/* Top Section: Monthly Limit & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Tracking (Span 1) */}
        <div className="lg:col-span-1">
          <BudgetCard />
        </div>

        {/* Totals Grid (Span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard
            icon={Wallet}
            label="Total Balance"
            amount={stats.balance}
            gradient="from-primary-500 to-primary-700"
            positive={stats.balance >= 0}
            sub={stats.balance >= 0 ? 'Positive' : 'Negative'}
          />
          <StatCard
            icon={TrendingUp}
            label="Income"
            amount={stats.totalIncome}
            gradient="from-emerald-500 to-emerald-700"
            positive={true}
            sub="This period"
          />
          <StatCard
            icon={TrendingDown}
            label="Expenses"
            amount={stats.totalExpense}
            gradient="from-rose-500 to-rose-700"
            positive={false}
            sub="This period"
          />
        </div>
      </div>

      {/* Charts Grid: 2 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<ChartSkeleton />}>
          <BalanceTrendChart balanceData={balanceData} />
        </Suspense>
        
        <Suspense fallback={<ChartSkeleton />}>
          <SpendingBreakdownChart pieData={pieData} />
        </Suspense>
      </div>
    </div>
  );
}
