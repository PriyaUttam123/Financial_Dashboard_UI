import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer 
} from 'recharts';

const tooltipStyle = {
  backgroundColor: '#1e293b', 
  border: '1px solid #475569', 
  borderRadius: '8px', 
  color: '#e2e8f0'
};

const BalanceTrendChart = React.memo(function BalanceTrendChart({ balanceData }) {
  return (
    <div className="glass-card p-6 min-h-[400px] flex flex-col">
      <h2 className="text-base font-semibold text-surface-200 mb-5">Balance Trend</h2>
      <div className="flex-1 w-full min-h-[300px]">
        {balanceData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#94a3b8" 
                fontSize={12} 
                tickMargin={10} 
                tickFormatter={(val) => val.slice(5)} // Show MM-DD
              />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`} 
                width={60} 
              />
              <RechartsTooltip 
                contentStyle={tooltipStyle}
                itemStyle={{ color: '#e2e8f0' }}
                formatter={(value) => [`$${value}`, 'Balance']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                activeDot={{ r: 6, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-surface-500 text-sm">
            No balance data available.
          </div>
        )}
      </div>
    </div>
  );
});

export default BalanceTrendChart;
