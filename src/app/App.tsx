import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppStateProvider } from '../state/AppStateContext';
import { NavBar } from '../components/NavBar';
import { MobilePhoneWrapper } from '../components/MobilePhoneWrapper';
import { ScrollToTop } from '../components/ScrollToTop';
import { Home } from '../pages/Home/Home';
import { Strategies } from '../pages/Strategies';
import { StrategyBuilder } from '../pages/StrategyBuilder';
import { Goals } from '../pages/Goals';
import { Plan } from '../pages/Plan/Plan';
import { Settings } from '../pages/Settings/Settings';
import { Onboarding } from '../pages/Onboarding/Onboarding';
import { Opportunities } from '../pages/Opportunities/Opportunities';
import { Terms } from '../pages/Terms/Terms';
import AccountDetailPage from './accounts/[id]/page';
import GoalDetailPage from './goals/[id]/page';
import { initializeTheme } from '../ui/colors';
import { FoundationFeatures } from '../components/FoundationFeatures';
import { DesignSystemDemo } from '../components/DesignSystemDemo';
import { SVGColorTest } from '../components/SVGColorTest';
import { AIIntegrationDemo } from '../components/AIIntegrationDemo';
import GlobalSheets from './components/GlobalSheets';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isOnboarding = location.pathname === '/' || location.pathname === '/onboarding';

  return (
    <div className="app">
      <ScrollToTop />
      <MobilePhoneWrapper>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/strategies" element={<Strategies />} />
            <Route path="/build-strategy" element={<StrategyBuilder mode="build" />} />
            <Route path="/custom-strategy" element={<StrategyBuilder mode="custom" />} />
            <Route path="/strategies/breakdown" element={<div>Breakdown page coming soon...</div>} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/foundation" element={<FoundationFeatures />} />
            <Route path="/ai-demo" element={<AIIntegrationDemo />} />
            <Route path="/design-system" element={<DesignSystemDemo />} />
            <Route path="/svg-test" element={<SVGColorTest />} />
            <Route path="/accounts/:id" element={<AccountDetailPage />} />
            <Route path="/goals/:id" element={<GoalDetailPage />} />
          </Routes>
        </main>
        {!isOnboarding && <NavBar />}
        
        {/* Global Sheets - rendered outside of main content */}
        <GlobalSheets />
      </MobilePhoneWrapper>
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
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AppStateProvider>
  );
}

export default App;