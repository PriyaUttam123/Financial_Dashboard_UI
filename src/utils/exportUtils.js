import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Export transactions to CSV format
 */
export const exportToCSV = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map(t => [
    t.date,
    t.description.replace(/,/g, ''), // Basic CSV escaping for commas
    t.category,
    t.type,
    t.amount.toFixed(2)
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `transactions_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export transactions to PDF format
 */
export const exportToPDF = (transactions) => {
  if (!transactions || transactions.length === 0) return;

  const doc = new jsPDF();
  
  // Add Title
  doc.setFontSize(20);
  doc.setTextColor(40);
  doc.text('Financial Transactions Report', 14, 22);
  
  // Add Date Range / Generation Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Total Records: ${transactions.length}`, 14, 37);

  // Table Data
  const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
  const tableRows = transactions.map(t => [
    t.date,
    t.description,
    t.category,
    t.type,
    `$${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
  ]);

  // Generate Table
  doc.autoTable({
    startY: 45,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 45 },
    styles: { fontSize: 9, cellPadding: 3 }
  });

  // Footer / Page Numbers
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
  }

  doc.save(`transactions_report_${new Date().toISOString().split('T')[0]}.pdf`);
};
