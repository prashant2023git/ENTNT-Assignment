import React from 'react';
import { BrowserRouter, Route, Routes, useLocation, Outlet } from 'react-router-dom';
import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './components/dashboard/DashboardPage';
import CandidateListPage from './components/candidates/CandidateList';
import JobList from './components/jobs/JobList';
import AssessmentsPage from './components/assessments/AssessmentsPage';
import SettingsPage from './components/settings/SettingsPage';

const LayoutWrapper = () => {
  const location = useLocation();
  // Get the path, if it's '/', use 'dashboard' to match the sidebar's link structure.
  // Otherwise, use the path segment (e.g., 'candidates').
  const activeLink = location.pathname === '/' ? 'dashboard' : location.pathname.substring(1);

  return (
    <DashboardLayout activeLink={activeLink}>
      <Outlet />
    </DashboardLayout>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All application pages requiring the sidebar MUST be children of this route */}
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<DashboardPage />} /> 
          <Route path="/candidates" element={<CandidateListPage />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Add other core pages like Assessments here: <Route path="/assessments" element={<AssessmentsPage />} /> */}
        </Route>

        {/* 404 Route - Outside the layout */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
    // <JobList/>
  );
}

export default App;