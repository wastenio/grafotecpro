import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import CasesList from "../src/pages/cases/CasesList";
import Login from "./pages/Login";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("access_token"); // verifica se token existe

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/cases" />} />
        <Route
          path="/cases"
          element={isAuthenticated ? <CasesList /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
