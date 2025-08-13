import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/Auth/Login';
import CasesList from '../pages/Cases/CasesList';
import CaseDetail from '../pages/Cases/CaseDetail';
import AnalysesList from '../pages/Analyses/AnalysesList';
import AnalysisDetail from '../pages/Analyses/AnalysisDetail';

import AppLayout from '../components/layout/AppLayout';

export const router = createBrowserRouter([
  { path: '/login', element: <Login/> },
  {
    element: <ProtectedRoute/>,
    children: [
      {
        element: <AppLayout><CasesList/></AppLayout>,
        path: '/cases'
      },
      {
        element: <AppLayout><CaseDetail/></AppLayout>,
        path: '/cases/:caseId'
      },
      {
        element: <AppLayout><AnalysesList/></AppLayout>,
        path: '/analyses'
      },
      {
        element: <AppLayout><AnalysisDetail/></AppLayout>,
        path: '/analyses/:analysisId'
      },
    ]
  },
  { path: '*', element: <Login/> }
]);
