import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface-950">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // In a real app, this might redirect to login, but since we're using status-based conditional rendering in App.jsx...
    return null; 
  }

  return children;
}
