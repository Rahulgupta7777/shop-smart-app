import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading" style={{ minHeight: '60vh' }}>Checking session...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="cart-empty">
        <div className="cart-empty-kanji">禁</div>
        <h1 className="page-title">Admin access required</h1>
        <p className="page-subtitle">Your account isn't an admin. Ask the owner to elevate it.</p>
        <a href="/" className="btn btn-primary">Back home</a>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
