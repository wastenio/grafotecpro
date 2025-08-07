import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Dashboard from './pages/Dashboard';
import Register from './auth/Register';
import CreateCase from './pages/CreateCase';
import UploadDocument from './pages/UploadDocument';
import ViewDocuments from './pages/ViewDocuments';
import PrivateRoute from './components/PrivateRoute';
import ViewDocument from './pages/ViewDocument';
import CompareDocuments from './components/CompareDocuments';
import AnalysisList from './pages/AnalysisList';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/cases/new" element={
          <PrivateRoute><CreateCase /></PrivateRoute>
        } />
        <Route path="/cases/:caseId/upload" element={
          <PrivateRoute><UploadDocument /></PrivateRoute>
        } />
        <Route path="/cases/:caseId/documents" element={
          <PrivateRoute><ViewDocuments /></PrivateRoute>
        } />
        <Route path="/documents/:documentId/view" element={
          <PrivateRoute><ViewDocument /></PrivateRoute>
        } />
        <Route path="/cases/:caseId/compare" element={
          <PrivateRoute><CompareDocuments /></PrivateRoute>
        } />
        <Route path="/cases/:caseId/analyses" element={
          <PrivateRoute><AnalysisList /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
