// src/routes/index.tsx
import { createBrowserRouter } from "react-router-dom";
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

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/logout", element: <Logout /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      // Cases
      { path: "cases", element: <CasesList /> },
      { path: "cases/create", element: <CaseCreate /> },
      { path: "cases/:id", element: <CaseDetail /> },

      // Analyses
      { path: "cases/:caseId/analyses", element: <AnalysesList /> },
      { path: "cases/:caseId/analyses/create", element: <AnalysisCreate /> },
      { path: "analyses/:analysisId", element: <AnalysisDetail /> },

      // Comparisons
      { path: "analyses/:analysisId/comparisons/create", element: <ComparisonCreate /> },

      // Quesitos
      { path: "cases/:caseId/quesitos", element: <QuesitosList /> },
      { path: "cases/:caseId/quesitos/create", element: <QuesitoCreate /> },

      // Comentários (opcional)
      // { path: "comments", element: <CommentsList /> },
    ],
  },
]);
