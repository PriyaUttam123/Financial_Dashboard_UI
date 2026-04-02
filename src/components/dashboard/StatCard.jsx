import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = React.memo(function StatCard({ icon: Icon, label, amount, sub, positive, gradient }) {
  return (
    <div className="glass-card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {positive !== undefined && (
          <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${positive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'}`}>
            {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {sub}
          </span>
        )}
      </div>
      <p className="text-surface-400 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-surface-100">
        ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
    </div>
  );
});

export default StatCard;
