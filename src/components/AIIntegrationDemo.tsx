import React, { useState, useEffect } from 'react';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';
import { Account, Goal } from '../data/types';
import { aiIntegrationService, AIAnalysisResult } from '../services/aiIntegrationService';
import { OpportunitiesDashboard } from './OpportunitiesDashboard';
import { ContentDashboard } from './ContentDashboard';
import { sampleScenarios } from '../data/sampleScenarios';
import './AIIntegrationDemo.css';

interface AIIntegrationDemoProps {
  onClose: () => void;
}

export function AIIntegrationDemo({ onClose }: AIIntegrationDemoProps) {
  const [selectedScenario, setSelectedScenario] = useState<string>('recentGrad');
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'opportunities' | 'content'>('overview');

  const currentScenario = sampleScenarios[selectedScenario];
  const scenarioOptions = Object.entries(sampleScenarios).map(([key, scenario]) => ({
    key,
    label: scenario.name,
    description: scenario.description
  }));

  useEffect(() => {
    if (currentScenario) {
      runAIAnalysis();
    }
  }, [selectedScenario]);

  const runAIAnalysis = async () => {
    if (!currentScenario) return;

    setLoading(true);
    try {
      const result = await aiIntegrationService.generateAIAnalysis(
        currentScenario.userProfile,
        currentScenario.accounts,
        currentScenario.goals
      );
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error running AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpportunityAction = (opportunity: any) => {
    console.log('Opportunity action:', opportunity);
    // In a real app, this would navigate to detailed opportunity view
  };

  const handleContentRead = (content: any) => {
    console.log('Content read:', content);
    // In a real app, this would open the content viewer
  };

  return (
    <div className="ai-integration-demo">
      <div className="demo-header">
        <h2>AI Integration Demo</h2>
        <p>Experience how our foundational features work together to provide personalized financial insights</p>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="demo-controls">
        <div className="scenario-selector">
          <label htmlFor="scenario-select">Choose a scenario:</label>
          <select 
            id="scenario-select"
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
          >
            {scenarioOptions.map(option => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          className="refresh-button"
          onClick={runAIAnalysis}
          disabled={loading}
        >
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>

      {currentScenario && (
        <div className="scenario-info">
          <h3>{currentScenario.name}</h3>
          <p>{currentScenario.description}</p>
          <div className="scenario-details">
            <div className="detail">
              <span className="label">Age:</span>
              <span className="value">{currentScenario.userProfile.age}</span>
            </div>
            <div className="detail">
              <span className="label">Income:</span>
              <span className="value">${currentScenario.userProfile.income?.toLocaleString()}</span>
            </div>
            <div className="detail">
              <span className="label">Risk Tolerance:</span>
              <span className="value">{currentScenario.userProfile.riskTolerance}</span>
            </div>
            <div className="detail">
              <span className="label">Financial Literacy:</span>
              <span className="value">{currentScenario.userProfile.financialLiteracy}</span>
            </div>
          </div>
        </div>
      )}

      <div className="demo-tabs">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          AI Analysis Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          Market Opportunities
        </button>
        <button 
          className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          Personalized Content
        </button>
      </div>

      <div className="demo-content">
        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Running AI analysis...</p>
          </div>
        )}

        {!loading && analysisResult && (
          <>
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="analysis-summary">
                  <h3>AI Analysis Summary</h3>
                  <div className="summary-grid">
                    <div className="summary-card">
                      <div className="card-title">Financial Health Score</div>
                      <div className="card-value">{analysisResult.financialHealthScore}/100</div>
                      <div className="card-description">
                        {analysisResult.financialHealthScore >= 80 ? 'Excellent' :
                         analysisResult.financialHealthScore >= 60 ? 'Good' :
                         analysisResult.financialHealthScore >= 40 ? 'Fair' : 'Needs Improvement'}
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="card-title">Total Opportunities</div>
                      <div className="card-value">{analysisResult.opportunities.opportunities.length}</div>
                      <div className="card-description">
                        ${analysisResult.opportunities.totalPotentialSavings.toFixed(0)} annual savings
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="card-title">Content Recommendations</div>
                      <div className="card-value">{analysisResult.contentRecommendations.length}</div>
                      <div className="card-description">
                        {analysisResult.contentRecommendations.filter(c => c.priority === 'high').length} high priority
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <div className="card-title">Risk Level</div>
                      <div className="card-value">{analysisResult.riskAssessment.level}</div>
                      <div className="card-description">
                        {analysisResult.riskAssessment.factors.length} risk factors identified
                      </div>
                    </div>
                  </div>
                </div>

                <div className="insights-section">
                  <h3>Personalized Insights</h3>
                  <div className="insights-list">
                    {analysisResult.personalizedInsights.map((insight, index) => (
                      <div key={index} className="insight-item">
                        <span className="insight-icon">💡</span>
                        <span className="insight-text">{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="next-steps-section">
                  <h3>Recommended Next Steps</h3>
                  <div className="next-steps-list">
                    {analysisResult.nextSteps.map((step, index) => (
                      <div key={index} className="next-step-item">
                        <span className="step-number">{index + 1}</span>
                        <span className="step-text">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="risk-assessment-section">
                  <h3>Risk Assessment</h3>
                  <div className="risk-factors">
                    <h4>Risk Factors:</h4>
                    <ul>
                      {analysisResult.riskAssessment.factors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="risk-recommendations">
                    <h4>Recommendations:</h4>
                    <ul>
                      {analysisResult.riskAssessment.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'opportunities' && currentScenario && (
              <OpportunitiesDashboard
                userProfile={currentScenario.userProfile}
                accounts={currentScenario.accounts}
                goals={currentScenario.goals}
                onOpportunityAction={handleOpportunityAction}
              />
            )}

            {activeTab === 'content' && currentScenario && (
              <ContentDashboard
                userProfile={currentScenario.userProfile}
                accounts={currentScenario.accounts}
                goals={currentScenario.goals}
                onContentRead={handleContentRead}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
