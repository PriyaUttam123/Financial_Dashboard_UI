import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-surface-950">
      {/* Sidebar (Desktop only - hidden on mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-64 transition-all duration-300">
        <TopBar />
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
