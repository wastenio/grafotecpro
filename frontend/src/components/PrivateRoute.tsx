import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ReactElement } from 'react';

export default function PrivateRoute({ children }: { children: ReactElement  }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" replace />;
}
