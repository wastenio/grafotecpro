import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";
import CasesList from "../pages/cases/CasesList";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login sem proteção */}
      <Route path="/login" element={<Login />} />

      {/* Páginas protegidas */}
      <Route
        path="/cases"
        element={
          <ProtectedRoute>
            <CasesList />
          </ProtectedRoute>
        }
      />

      {/* Qualquer rota inválida redireciona para login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
