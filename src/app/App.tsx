import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppStateProvider } from '../state/AppStateContext';
import { NavBar } from '../components/NavBar';
import { Home } from '../pages/Home/Home';
import { Strategies } from '../pages/Strategies';
import { BuildStrategy } from '../pages/BuildStrategy';
import { CustomStrategy } from '../pages/CustomStrategy';
import { Goals } from '../pages/Goals';
import { Plan } from '../pages/Plan/Plan';
import { Settings } from '../pages/Settings/Settings';
import { Onboarding } from '../pages/Onboarding/Onboarding';
import AccountDetailPage from './accounts/[id]/page';
import GoalDetailPage from './goals/[id]/page';
import { initializeTheme } from '../ui/colors';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/' || location.pathname === '/onboarding';


  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/build-strategy" element={<BuildStrategy />} />
          <Route path="/custom-strategy" element={<CustomStrategy />} />
          <Route path="/strategies/breakdown" element={<div>Breakdown page coming soon...</div>} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/accounts/:id" element={<AccountDetailPage />} />
          <Route path="/goals/:id" element={<GoalDetailPage />} />
        </Routes>
      </main>
      {!isOnboarding && <NavBar />}
    </div>
  );
}

function App() {
  React.useEffect(() => {
    // Initialize theme on app start
    initializeTheme();
  }, []);

  return (
    <AppStateProvider>
      <Router>
        <AppContent />
      </Router>
    </AppStateProvider>
  );
}

export default App;