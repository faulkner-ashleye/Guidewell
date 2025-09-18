import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Disclaimer } from '../components/Disclaimer';
import AppHeader from '../app/components/AppHeader';
import './Strategies.css';

export function Strategies() {
  const navigate = useNavigate();

  const handleBuildStrategy = () => {
    navigate('/build-strategy');
  };

  const handleViewStrategy = () => {
    // Route stub - placeholder for recommended strategy
    console.log('View recommended strategy');
  };

  return (
    <div className="strategies">
      <AppHeader title="Strategies" />

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Intro Card */}
        <Card className="intro-card">
          <h2 className="intro-title">
            Your starting line
          </h2>
          <p className="intro-description">
            Choose a strategy that fits your financial goals and timeline.
          </p>
        </Card>

        {/* Strategy Cards */}
        <div style={{ display: 'grid', gap: '20px', marginBottom: '24px' }}>
          {/* Recommended Strategy Card */}
          <Card className="strategy-card recommended">
            <div className="strategy-card-header">
              <div className="strategy-card-icon">⭐</div>
              <h3 className="strategy-card-title">
                Recommended Strategy
              </h3>
            </div>
            <p className="strategy-card-description">
              Based on your profile, we suggest starting with a balanced approach that focuses on building your emergency fund while paying down high-interest debt.
            </p>
            <button 
              onClick={handleViewStrategy}
              className="strategy-button strategy-button--primary"
            >
              View strategy
            </button>
          </Card>

          {/* Build Your Own Strategy Card */}
          <Card className="strategy-card build-your-own">
            <div className="strategy-card-header">
              <div className="strategy-card-icon">🛠️</div>
              <h3 className="strategy-card-title">
                Build Your Own Strategy
              </h3>
            </div>
            <p className="strategy-card-description">
              Create a custom financial strategy tailored to your specific goals and risk tolerance.
            </p>
            <button 
              onClick={handleBuildStrategy}
              className="strategy-button strategy-button--secondary"
            >
              Start building
            </button>
          </Card>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', color: '#999', fontSize: '12px' }}>
          Educational scenarios only — not financial advice.
        </div>
      </div>
    </div>
  );
}
