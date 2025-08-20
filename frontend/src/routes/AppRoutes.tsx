import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CasesList from "../pages/cases/CasesList";
import CaseDetail from "../pages/cases/CaseDetail";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/cases" element={<CasesList />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
      </Routes>
    </Router>
  );
}
