import React from 'react';
import TransactionRow from './TransactionRow';

const TransactionList = React.memo(function TransactionList({ transactions, isAdmin }) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-surface-100 dark:border-surface-700/50">
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
            {transactions.length > 0 ? (
              transactions.map((t) => (
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
    </div>
  );
});

export default TransactionList;
