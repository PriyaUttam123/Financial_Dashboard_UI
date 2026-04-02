import { useGlobalContext } from '../../context/GlobalContext';
import { categories } from '../../data/mockData';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Lock, Plus, Edit2, Trash2 } from 'lucide-react';

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

function TransactionRow({ t, isAdmin }) {
  const isIncome = t.type === 'Income';
  const gradient = categoryColors[t.category] || 'from-surface-500 to-surface-700';

  return (
    <tr className="border-b border-surface-700/40 hover:bg-surface-800/40 transition-colors duration-150 group">
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
            {t.category.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-200 truncate max-w-[200px]">{t.description}</p>
            <p className="text-xs text-surface-500 mt-0.5">{t.date}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-surface-300">{t.category}</span>
      </td>
      <td className="py-4 px-4">
        <span className={`badge ${isIncome ? 'badge-income' : 'badge-expense'}`}>
          {isIncome ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {t.type}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        <span className={`text-sm font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isIncome ? '+' : '-'}${t.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </td>
      {isAdmin && (
        <td className="py-4 px-4 text-right">
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1.5 text-surface-400 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors cursor-pointer" title="Edit row">
              <Edit2 className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-surface-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer" title="Delete row">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

export default function TransactionsPage() {
  const { filteredTransactions, filters, setFilters, userRole } = useGlobalContext();
  const isAdmin = userRole === 'Admin';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Transactions</h1>
          <p className="text-sm text-surface-500 mt-1">
            {filteredTransactions.length} records found
            {!isAdmin && <span className="ml-2 inline-flex items-center gap-1 text-amber-400"><Lock className="w-3 h-3" /> View-only mode</span>}
          </p>
        </div>
        
        {isAdmin && (
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <input
              id="transactions-search"
              type="text"
              placeholder="Search transactions..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input-field w-full pl-10 text-sm"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <select
              id="category-filter"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="input-field pl-10 pr-8 text-sm appearance-none cursor-pointer min-w-[160px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-surface-800">{cat}</option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {(filters.search || filters.category !== 'All') && (
            <button
              id="clear-filters"
              onClick={() => setFilters({ search: '', category: 'All' })}
              className="px-4 py-2.5 rounded-xl text-sm text-surface-400 border border-surface-700/50 hover:bg-surface-800/80 hover:text-surface-200 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-700/50">
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Transaction</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Category</th>
                <th className="text-left py-3.5 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Type</th>
                <th className="text-right py-3.5 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Amount</th>
                {isAdmin && (
                  <th className="text-right py-3.5 px-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <TransactionRow key={t.id} t={t} isAdmin={isAdmin} />
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="py-16 text-center">
                    <p className="text-surface-500 text-sm">No transactions match your filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-surface-700/40 flex items-center justify-between">
          <p className="text-xs text-surface-500">
            Showing <span className="text-surface-300 font-medium">{filteredTransactions.length}</span> of <span className="text-surface-300 font-medium">10</span> transactions
          </p>
          {!isAdmin && (
            <span className="flex items-center gap-1.5 text-xs text-amber-400/80">
              <Lock className="w-3 h-3" />
              Admin role required to modify
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
