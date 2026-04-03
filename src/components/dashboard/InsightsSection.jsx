import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, TrendingDown, TrendingUp, PieChart } from 'lucide-react';

const InsightsSection = React.memo(function InsightsSection({ topCategory, savingsRate, observation, variants }) {
  return (
    <motion.div variants={variants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Insight 1: Highest Spending */}
      <div className="glass-card-hover p-5 flex items-start gap-4 border-l-4 border-l-rose-500">
        <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center flex-shrink-0">
          <TrendingDown className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Highest Spending</h4>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{topCategory.name || 'N/A'}</p>
          <p className="text-xs text-surface-500 mt-1">
            ${topCategory.amount?.toLocaleString('en-US', { minimumFractionDigits: 2 })} this period
          </p>
        </div>
      </div>

      {/* Insight 2: Savings Rate */}
      <div className="glass-card-hover p-5 flex items-start gap-4 border-l-4 border-l-emerald-500">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-5 h-5 text-emerald-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Savings Rate</h4>
          <p className="text-xl font-bold text-surface-900 dark:text-surface-100 mt-1">{savingsRate}%</p>
          <p className="text-xs text-surface-500 mt-1">Of total income saved</p>
        </div>
      </div>

      {/* Insight 3: Key Observation */}
      <div className="glass-card-hover p-5 flex items-start gap-4 border-l-4 border-l-primary-500">
        <div className="w-10 h-10 rounded-xl bg-primary-500/15 flex items-center justify-center flex-shrink-0">
          <Lightbulb className="w-5 h-5 text-primary-500" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-surface-800 dark:text-surface-200">Smart Observation</h4>
          <p className="text-sm text-surface-600 dark:text-surface-300 mt-1 leading-relaxed">
            {observation}
          </p>
        </div>
      </div>
    </motion.div>
  );
});

export default InsightsSection;
