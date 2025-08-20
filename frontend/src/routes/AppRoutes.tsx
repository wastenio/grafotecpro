import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CasesList from "../pages/cases/CasesList";
import CaseDetail from "../pages/cases/CaseDetail";

import AnalysesList from "../pages/analyses/AnalysesList";
import AnalysisDetail from "../pages/analyses/AnalysisDetail";
import AnalysisForm from "../pages/analyses/AnalysisForm";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/cases" element={<CasesList />} />
        <Route path="/cases/:id" element={<CaseDetail />} />

        <Route path="/cases/:caseId/analyses" element={<AnalysesList />} />
        <Route path="/cases/:caseId/analyses/new" element={<AnalysisForm />} />
        <Route path="/analyses/:analysisId" element={<AnalysisDetail />} />
      </Routes>
    </Router>
  );
}
