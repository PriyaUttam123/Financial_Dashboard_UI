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
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.3
};

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
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="w-full h-full"
          >
            {activePage === 'Dashboard' && <DashboardPage />}
            {activePage === 'Transactions' && <TransactionsPage />}
            {activePage === 'Insights' && <InsightsPage />}
          </motion.div>
        </AnimatePresence>
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
