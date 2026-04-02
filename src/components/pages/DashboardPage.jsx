import React, { Suspense, useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown,
  Activity,
} from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import BudgetCard from '../dashboard/BudgetCard';
import Skeleton, { StatCardSkeleton } from '../common/Skeleton';
import { motion } from 'framer-motion';

const BalanceTrendChart = React.lazy(() => import('../dashboard/BalanceTrendChart'));
const SpendingBreakdownChart = React.lazy(() => import('../dashboard/SpendingBreakdownChart'));

const ChartSkeleton = () => (
  <div className="glass-card p-6 h-[350px] flex flex-col">
    <div className="flex items-center justify-between mb-8">
      <Skeleton className="w-48 h-6" />
      <Skeleton className="w-24 h-4" />
    </div>
    <div className="flex-1 flex items-end gap-3 px-2">
      {[...Array(12)].map((_, i) => (
        <Skeleton 
          key={i} 
          className="flex-1 rounded-t-lg" 
          style={{ height: `${Math.random() * 60 + 20}%` }}
        />
      ))}
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export default function DashboardPage() {
  const { stats } = useGlobalContext();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="w-40 h-8" />
            <Skeleton className="w-56 h-4" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatCardSkeleton />
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Welcome Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Financial Overview</h1>
          <p className="text-sm text-surface-500 mt-1">Monitor your income, expenses and budget goals</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700/50 rounded-xl shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase tracking-wider">Live Updates</span>
        </div>
      </motion.div>

      {/* Top Section: Monthly Limit & Key Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Tracking (Span 1) */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <BudgetCard />
        </motion.div>

        {/* Totals Grid (Span 2) */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <motion.div variants={itemVariants}>
            <StatCard
              icon={Wallet}
              label="Total Balance"
              amount={stats.balance}
              gradient="from-primary-500 to-primary-700"
              positive={stats.balance >= 0}
              sub={stats.balance >= 0 ? 'Positive' : 'Negative'}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={TrendingUp}
              label="Income"
              amount={stats.totalIncome}
              gradient="from-emerald-500 to-emerald-700"
              positive={true}
              sub="This period"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatCard
              icon={TrendingDown}
              label="Expenses"
              amount={stats.totalExpense}
              gradient="from-rose-500 to-rose-700"
              positive={false}
              sub="This period"
            />
          </motion.div>
        </div>
      </div>

      {/* Charts Grid: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary-500" />
            Balance Trend
          </h3>
          <Suspense fallback={<ChartSkeleton />}>
            <BalanceTrendChart />
          </Suspense>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card p-6 h-[400px]">
          <h3 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-6">Spending Breakdown</h3>
          <Suspense fallback={<ChartSkeleton />}>
            <SpendingBreakdownChart />
          </Suspense>
        </motion.div>
      </div>
    </motion.div>
  );
}
