import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<h1>Página de Login</h1>} />
      <Route path="/cases" element={<h1>Lista de Casos</h1>} />
      <Route path="*" element={<Navigate to="/cases" />} />
    </Routes>
  );
};

export default AppRoutes;
