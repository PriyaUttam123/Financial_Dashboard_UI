import React from 'react';
import {
  PieChart, Pie, Cell, Legend, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';

const categoryHexColors = {
  'Salary': '#10b981',
  'Freelance': '#0ea5e9',
  'Investment': '#8b5cf6',
  'Food & Dining': '#f59e0b',
  'Utilities': '#f97316',
  'Transport': '#a855f7',
  'Shopping': '#ec4899',
  'Entertainment': '#f43f5e',
  'Rent': '#ef4444',
};

const tooltipStyle = {
  backgroundColor: '#1e293b',
  border: '1px solid #475569',
  borderRadius: '8px',
  color: '#e2e8f0'
};

const SpendingBreakdownChart = React.memo(function SpendingBreakdownChart({ pieData }) {
  if (!pieData || pieData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-surface-500 text-sm">
        No spending data available.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <RechartsTooltip
            contentStyle={tooltipStyle}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(value) => [`$${value}`, 'Amount']}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '11px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
            formatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
          />
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
            animationDuration={1800}
            animationBegin={400}
            animationEasing="ease-out"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={categoryHexColors[entry.name] || '#94a3b8'}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default SpendingBreakdownChart;
