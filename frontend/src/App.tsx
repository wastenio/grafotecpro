// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import CasesList from "./pages/cases/CasesList";
import CaseDetail from "./pages/cases/CaseDetail";
import AnalysesList from "./pages/analyses/AnalysesList";
import AnalysisDetail from "./pages/analyses/AnalysisDetail";
import ComparisonsList from "./pages/analyses/ComparisonsList";
import ComparisonDetail from "./pages/comparisons/ComparisonDetail";

// --- Função para verificar se o usuário está logado ---
const isAuthenticated = () => !!localStorage.getItem("access_token");

// --- PrivateRoute ---
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

// --- App com rotas ---
const App: React.FC = () => (
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
        path="/cases/:caseId"
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
            <AnalysisDetail />
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

      {/* Comparações */}
      <Route
        path="/analyses/:analysisId/comparisons"
        element={
          <PrivateRoute>
            <ComparisonsList />
          </PrivateRoute>
        }
      />
      <Route
        path="/comparisons/:comparisonId"
        element={
          <PrivateRoute>
            <ComparisonDetail />
          </PrivateRoute>
        }
      />

      {/* Redireciona qualquer rota inválida */}
      <Route path="*" element={<Navigate to="/cases" replace />} />
    </Routes>
  </Router>
);

export default App;
