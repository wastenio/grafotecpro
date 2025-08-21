// src/routes/AppRoutes.tsx
import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CasesList from "../pages/cases/CasesList";
import CaseDetail from "../pages/cases/CaseDetail";
import AnalysesList from "../pages/analyses/AnalysesList";
import AnalysisDetail from "../pages/analyses/AnalysisDetail";
import AnalysisForm from "../pages/analyses/AnalysisForm";
import Login from "../pages/Login"; // ajuste para o caminho correto da sua página de login

// Verifica se o usuário está logado
const isAuthenticated = () => !!localStorage.getItem("access_token");

// PrivateRoute agora usa ReactNode
const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Casos */}
        <Route
          path="/cases"
          element={
            <PrivateRoute>
              <CasesList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/:id"
          element={
            <PrivateRoute>
              <CaseDetail />
            </PrivateRoute>
          }
        />

        {/* Análises */}
        <Route
          path="/cases/:caseId/analyses"
          element={
            <PrivateRoute>
              <AnalysesList />
            </PrivateRoute>
          }
        />
        <Route
          path="/cases/:caseId/analyses/new"
          element={
            <PrivateRoute>
              <AnalysisForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/analyses/:analysisId"
          element={
            <PrivateRoute>
              <AnalysisDetail />
            </PrivateRoute>
          }
        />

        {/* Redireciona qualquer rota não encontrada para /cases */}
        <Route path="*" element={<Navigate to="/cases" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
