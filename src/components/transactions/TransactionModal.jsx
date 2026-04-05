import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, Tag, FileText, AlertCircle } from 'lucide-react';
import { categories } from '../../data/mockData';

const TransactionModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  transaction = null,
  isLoading = false 
}) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: 'Food & Dining',
    type: 'Expense',
    amount: '',
    isRecurring: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (transaction) {
      setFormData({
        date: transaction.date,
        description: transaction.description,
        category: transaction.category,
        type: transaction.type,
        amount: transaction.amount.toString(),
        isRecurring: transaction.isRecurring || false
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: 'Food & Dining',
        type: 'Expense',
        amount: '',
        isRecurring: false
      });
    }
    setErrors({});
  }, [transaction, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const transactionData = {
      ...formData,
      amount: parseFloat(formData.amount),
      id: transaction ? transaction.id : Date.now().toString()
    };

    onSubmit(transactionData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-2xl w-full max-w-md border border-surface-200 dark:border-surface-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="text-xl font-bold text-surface-900 dark:text-surface-100">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-surface-500 dark:text-surface-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              <Calendar className="w-4 h-4" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.date 
                  ? 'border-red-300 dark:border-red-500' 
                  : 'border-surface-300 dark:border-surface-600'
              } bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              disabled={isLoading}
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.date}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              <FileText className="w-4 h-4" />
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter transaction description"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description 
                  ? 'border-red-300 dark:border-red-500' 
                  : 'border-surface-300 dark:border-surface-600'
              } bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            )}
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                <Tag className="w-4 h-4" />
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                disabled={isLoading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-2 block">
                Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'Income')}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                    formData.type === 'Income'
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                  disabled={isLoading}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'Expense')}
                  className={`flex-1 py-2 px-3 rounded-lg border transition-all ${
                    formData.type === 'Expense'
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800'
                  }`}
                  disabled={isLoading}
                >
                  Expense
                </button>
              </div>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
              <DollarSign className="w-4 h-4" />
              Amount
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.amount 
                  ? 'border-red-300 dark:border-red-500' 
                  : 'border-surface-300 dark:border-surface-600'
              } bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all`}
              disabled={isLoading}
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Recurring */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
              className="w-4 h-4 text-primary-600 bg-surface-100 border-surface-300 rounded focus:ring-primary-500 dark:focus:ring-primary-400 dark:ring-offset-surface-800 focus:ring-2 dark:bg-surface-700 dark:border-surface-600"
              disabled={isLoading}
            />
            <label htmlFor="isRecurring" className="text-sm text-surface-700 dark:text-surface-300">
              Recurring monthly transaction
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-900 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-primary-500/25 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {transaction ? 'Updating...' : 'Adding...'}
                </span>
              ) : (
                transaction ? 'Update Transaction' : 'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
