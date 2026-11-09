import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  if (loading) return <div className="container py-5 text-center">Checking your session...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}