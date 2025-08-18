// src/routes/index.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import LoginPage from "../pages/Auth/Login";
import Logout from "../pages/Auth/Logout";
import Dashboard from "../pages/Dashboard";

// Cases
import { CasesList } from "../pages/Cases/CasesList";
import { CaseDetail } from "../pages/Cases/CaseDetail";
import { CaseCreate } from "../pages/Cases/CaseCreate";

// Analyses
import { AnalysesList } from "../pages/Analyses/AnalysesList";
import { AnalysisDetail } from "../pages/Analyses/AnalysisDetail";
import { AnalysisCreate } from "../pages/Analyses/AnalysisCreate";

// Comparisons
import { ComparisonCreate } from "../pages/Comparisons/ComparisonCreate";

// Quesitos
import { QuesitosList } from "../pages/Quesitos/QuesitosList";
import { QuesitoCreate } from "../pages/Quesitos/QuesitoCreate";

// Comentários (opcional)
// import { CommentsList } from "../pages/Comments/CommentsList";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />

        {/* Rotas protegidas */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Cases */}
          <Route path="cases" element={<CasesList />} />
          <Route path="cases/create" element={<CaseCreate />} />
          <Route path="cases/:id" element={<CaseDetail />} />

          {/* Analyses */}
          <Route path="cases/:caseId/analyses" element={<AnalysesList />} />
          <Route path="cases/:caseId/analyses/create" element={<AnalysisCreate />} />
          <Route path="analyses/:analysisId" element={<AnalysisDetail />} />

          {/* Comparisons */}
          <Route path="analyses/:analysisId/comparisons/create" element={<ComparisonCreate />} />

          {/* Quesitos */}
          <Route path="cases/:caseId/quesitos" element={<QuesitosList />} />
          <Route path="cases/:caseId/quesitos/create" element={<QuesitoCreate />} />

          {/* Comentários (opcional) */}
          {/* <Route path="comments" element={<CommentsList />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}
