import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../src/pages/Auth/Login";
import Dashboard from "../src/pages/Dashboard";
import { CasesList } from "../src/pages/Cases/CasesList"
import ProtectedRoute  from "../src/routes/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cases"
          element={
            <ProtectedRoute>
              <CasesList />
            </ProtectedRoute>
          }
        />
        {/* outras rotas protegidas */}
      </Routes>
    </Router>
  );
}

export default App;
