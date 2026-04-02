import { useGlobalContext } from '../../context/GlobalContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';

const categoryColors = {
  'Salary':       'from-primary-500 to-primary-700',
  'Freelance':    'from-sky-500 to-sky-700',
  'Investment':   'from-emerald-500 to-emerald-700',
  'Food & Dining':'from-amber-500 to-amber-700',
  'Utilities':    'from-orange-500 to-orange-700',
  'Transport':    'from-purple-500 to-purple-700',
  'Shopping':     'from-pink-500 to-pink-700',
  'Entertainment':'from-rose-500 to-rose-700',
  'Rent':         'from-red-500 to-red-700',
};

const categoryHexColors = {
  'Salary':       '#10b981', 
  'Freelance':    '#0ea5e9', 
  'Investment':   '#8b5cf6', 
  'Food & Dining':'#f59e0b', 
  'Utilities':    '#f97316', 
  'Transport':    '#a855f7', 
  'Shopping':     '#ec4899', 
  'Entertainment':'#f43f5e', 
  'Rent':         '#ef4444', 
};

function StatCard({ icon: Icon, label, amount, sub, positive, gradient }) {
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
}

export default function DashboardPage() {
  const { stats, filteredTransactions, userRole } = useGlobalContext();

  // Compute balance over time
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  let currentBalance = 0;
  const balanceData = sortedTransactions.map((t) => {
    currentBalance += t.type === 'Income' ? t.amount : -t.amount;
    return {
      date: t.date,
      balance: currentBalance,
    };
  });

  // Compute expenses by category
  const expenseByCategory = filteredTransactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const pieData = Object.entries(expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  // Tooltip Styles
  const tooltipStyle = {
    backgroundColor: '#1e293b', 
    border: '1px solid #475569', 
    borderRadius: '8px', 
    color: '#e2e8f0'
  };

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

      {/* Stats Grid: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

      {/* Charts Grid: 2 columns */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Balance Trend Area Chart */}
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

        {/* Spending Breakdown Pie/Donut Chart */}
        <div className="glass-card p-6 min-h-[400px] flex flex-col">
          <h2 className="text-base font-semibold text-surface-200 mb-5">Spending Breakdown</h2>
          <div className="flex-1 w-full min-h-[300px]">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <RechartsTooltip 
                    contentStyle={tooltipStyle}
                    itemStyle={{ color: '#e2e8f0' }}
                    formatter={(value) => [`$${value}`, 'Amount']}
                  />
                  <Legend 
                    iconType="circle" 
                    wrapperStyle={{ paddingTop: '20px' }}
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
            ) : (
              <div className="flex h-full items-center justify-center text-surface-500 text-sm">
                No spending data available.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
