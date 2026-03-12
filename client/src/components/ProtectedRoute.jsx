import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      toast.error('Please log in to continue');
    } else if (requireAdmin && !isAdmin) {
      toast.error('Admin access required');
    }
  }, [loading, isAuthenticated, isAdmin, requireAdmin]);

  if (loading) {
    return <div className="loading" style={{ minHeight: '60vh' }}>Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
