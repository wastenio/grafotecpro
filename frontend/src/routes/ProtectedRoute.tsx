import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const hasToken = !!localStorage.getItem('access');
  return hasToken ? <Outlet/> : <Navigate to="/login" replace />;
}
