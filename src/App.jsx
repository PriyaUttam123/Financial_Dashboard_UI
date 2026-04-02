import { GlobalProvider, useGlobalContext } from './context/GlobalContext';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './components/pages/DashboardPage';
import TransactionsPage from './components/pages/TransactionsPage';

function AppRoutes() {
  const { activePage } = useGlobalContext();

  return (
    <DashboardLayout>
      {activePage === 'Dashboard' && <DashboardPage />}
      {activePage === 'Transactions' && <TransactionsPage />}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <GlobalProvider>
      <AppRoutes />
    </GlobalProvider>
  );
}
