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
  if (!balanceData || balanceData.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-surface-500 text-sm">
        No balance data available.
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] overflow-hidden">
      <ResponsiveContainer width="100%" height="100%" margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
        <AreaChart data={balanceData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={11} 
            tickMargin={12} 
            tickFormatter={(val) => val.slice(5)} 
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={11} 
            tickFormatter={(value) => `$${value}`} 
            width={50}
            tickCount={5}
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
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorBalance)" 
            activeDot={{ r: 5, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
            animationDuration={1500}
            animationBegin={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

export default BalanceTrendChart;
