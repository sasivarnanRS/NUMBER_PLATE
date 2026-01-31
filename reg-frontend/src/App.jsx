import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AnimatedBackground from './components/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import AuthPage from './pages/AuthPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/select" element={<SelectionPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
