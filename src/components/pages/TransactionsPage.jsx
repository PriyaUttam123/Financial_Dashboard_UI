import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import { categories } from '../../data/mockData';
import { Search, Filter, Lock, Plus, Download, FileText, Table, ChevronDown } from 'lucide-react';
import TransactionList from '../transactions/TransactionList';
import { exportToCSV, exportToPDF } from '../../utils/exportUtils';

export default function TransactionsPage() {
  const { filteredTransactions, filters, setFilters, userRole } = useGlobalContext();
  const isAdmin = userRole === 'Admin';
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', category: 'All' });
  }, [setFilters]);

  const handleExportCSV = () => {
    exportToCSV(filteredTransactions);
    setExportDropdownOpen(false);
  };

  const handleExportPDF = () => {
    exportToPDF(filteredTransactions);
    setExportDropdownOpen(false);
  };

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
        
        <div className="flex items-center gap-3">
          {/* Export Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-800 border border-surface-700 hover:border-surface-600 text-surface-200 rounded-xl text-sm font-medium transition-all"
            >
              <Download className="w-4 h-4 text-primary-400" />
              <span>Export</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {exportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface-800/95 backdrop-blur-xl border border-surface-700/50 rounded-xl shadow-glass-lg overflow-hidden z-10 animate-slide-up">
                <button 
                  onClick={handleExportCSV}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-surface-700/50 hover:text-surface-100 transition-colors"
                >
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>Download CSV</span>
                </button>
                <button 
                  onClick={handleExportPDF}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-surface-300 hover:bg-surface-700/50 hover:text-surface-100 transition-colors"
                >
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>Download PDF</span>
                </button>
              </div>
            )}
          </div>

          {isAdmin && (
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters (Search removed as it exists in TopBar) */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Category Filter */}
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
            <select
              id="category-filter"
              value={filters.category}
              onChange={handleCategoryChange}
              className="input-field pl-10 pr-8 text-sm appearance-none cursor-pointer w-full sm:min-w-[200px]"
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
              onClick={handleClearFilters}
              className="px-4 py-2.5 w-full sm:w-auto rounded-xl text-sm text-surface-400 border border-surface-700/50 hover:bg-surface-800/80 hover:text-surface-200 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <TransactionList transactions={filteredTransactions} isAdmin={isAdmin} />

      {/* Table Footer (Integrated into Page or could be moved to List) */}
      <div className="px-4 py-3 border-t border-surface-700/40 flex items-center justify-between glass-card -mt-6 rounded-t-none">
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
  );
}
