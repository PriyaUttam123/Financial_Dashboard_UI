import { useState } from 'react';
import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './components/pages/DashboardPage';
import TransactionsPage from './components/pages/TransactionsPage';
import InsightsPage from './components/pages/InsightsPage';
import LoginPage from './components/pages/LoginPage';
import SignupPage from './components/pages/SignupPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function AppRoutes() {
  const { activePage } = useGlobalContext();
  const { isAuthenticated, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login');

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-950">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return authMode === 'login' 
      ? <LoginPage onToggleAuthMode={() => setAuthMode('signup')} /> 
      : <SignupPage onToggleAuthMode={() => setAuthMode('login')} />;
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        {activePage === 'Dashboard' && <DashboardPage />}
        {activePage === 'Transactions' && <TransactionsPage />}
        {activePage === 'Insights' && <InsightsPage />}
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <GlobalProvider>
        <AppRoutes />
      </GlobalProvider>
    </AuthProvider>
  );
}
