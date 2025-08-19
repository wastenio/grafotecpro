import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode; // permite qualquer elemento React válido
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("token"); // verifica se o usuário está logado

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>; // renderiza os elementos filhos se houver token
};

export default ProtectedRoute;
