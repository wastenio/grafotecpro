import { Navigate } from "react-router-dom";
import { useCurrentUser } from "../api/hooks/useAuth";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return <div className="p-4">Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
