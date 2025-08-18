// src/routes/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../api/hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-4">
        <p>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return <p>Erro ao verificar autenticação</p>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
