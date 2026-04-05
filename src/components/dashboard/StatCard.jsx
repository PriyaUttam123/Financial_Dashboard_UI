import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
    <motion.div 
      className="glass-card-hover p-6 cursor-pointer"
      whileHover={{ 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div 
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.bg} flex items-center justify-center shadow-lg ${colors.shadow}`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        {positive !== undefined && (
          <motion.span 
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {sub}
          </motion.span>
        )}
      </div>
      <motion.p 
        className="text-surface-500 dark:text-surface-400 text-sm font-medium mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        {label}
      </motion.p>
      <motion.div 
        className="flex items-baseline gap-1"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </motion.div>
    </motion.div>
  );
});

export default StatCard;
