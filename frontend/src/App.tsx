import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CasesList from "./pages/cases/CasesList";
import CaseDetail from "./pages/cases/CaseDetail";
import AnalysesList from "./pages/analyses/AnalysesList";
import AnalysisDetail from "./pages/analyses/AnalysisDetail";
import ComparisonsList from "./pages/analyses/ComparisonsList";
import ComparisonDetail from "./pages/comparisons/ComparisonDetail";

const App = () => (
  <Router>
    <Routes>
      <Route path="/cases" element={<CasesList />} />
      <Route path="/cases/:caseId" element={<CaseDetail />} />
      <Route path="/cases/:caseId/analyses" element={<AnalysesList />} />
      <Route path="/analyses/:analysisId" element={<AnalysisDetail />} />
      <Route path="/analyses/:analysisId/comparisons" element={<ComparisonsList />} />
      <Route path="/comparisons/:comparisonId" element={<ComparisonDetail />} />
      <Route path="*" element={<p>Página não encontrada</p>} />
    </Routes>
  </Router>
);

export default App;
