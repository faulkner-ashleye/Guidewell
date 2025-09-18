import React, { useState, useEffect } from 'react';
import { useAppState } from '../state/AppStateContext';
import { FinancialCalculations, FinancialUtils } from '../utils/financialCalculations';
import { UserProfileUtils } from '../data/enhancedUserProfile';
import { OpportunityDetection } from '../data/marketData';
import { sampleScenarios, SampleScenarioUtils } from '../data/sampleScenarios';
import { Card } from './Card';

export function FoundationFeatures() {
  const { 
    accounts, 
    goals, 
    userProfile, 
    enhancedUserProfile, 
    opportunities, 
    validationErrors,
    validateData,
    detectOpportunities,
    enrichUserProfile
  } = useAppState();

  const [selectedScenario, setSelectedScenario] = useState<string>('recentGrad');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [financialHealth, setFinancialHealth] = useState<any>(null);

  // Calculate financial health when accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      try {
        const health = FinancialCalculations.calculateFinancialHealth(accounts);
        setFinancialHealth(health);
      } catch (error) {
        console.error('Error calculating financial health:', error);
      }
    }
  }, [accounts]);

  const handleLoadScenario = () => {
    const scenario = SampleScenarioUtils.getScenario(selectedScenario);
    if (scenario) {
      // This would integrate with your existing state management
      console.log('Loading scenario:', scenario.name);
      // You could add methods to load scenario data into your app state
    }
  };

  const handleValidateData = () => {
    const isValid = validateData();
    if (isValid) {
      enrichUserProfile();
      detectOpportunities();
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px' }}>
        <h2>🏗️ Foundation Features</h2>
        <p style={{ color: '#666', fontSize: '14px' }}>
          Advanced financial analysis and AI-ready features (non-breaking enhancements)
        </p>
      </div>

      {/* Financial Health Overview */}
      {financialHealth && (
        <Card className="foundation-card">
          <h3>📊 Financial Health Score</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#28a745' }}>
                {financialHealth.healthScore}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>out of 100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Net Worth:</strong> {FinancialUtils.formatCurrency(financialHealth.netWorth)}
              </div>
              <div style={{ marginBottom: '8px' }}>
                <strong>Total Assets:</strong> {FinancialUtils.formatCurrency(financialHealth.totalAssets)}
              </div>
              <div>
                <strong>Total Debt:</strong> {FinancialUtils.formatCurrency(financialHealth.totalDebt)}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Data Validation */}
      <Card className="foundation-card">
        <h3>✅ Data Validation</h3>
        <div style={{ marginBottom: '15px' }}>
          <button 
            onClick={handleValidateData}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Validate All Data
          </button>
        </div>
        
        {validationErrors && validationErrors.length > 0 ? (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            <strong>Validation Errors:</strong>
            <ul style={{ margin: '5px 0 0 20px' }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            ✅ All data is valid and ready for AI processing
          </div>
        )}
      </Card>

      {/* Enhanced User Profile */}
      {enhancedUserProfile && (
        <Card className="foundation-card">
          <h3>👤 Enhanced User Profile</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '14px' }}>
            <div>
              <strong>Financial Literacy:</strong> {enhancedUserProfile.financialLiteracy}
            </div>
            <div>
              <strong>Risk Tolerance:</strong> {enhancedUserProfile.riskTolerance}
            </div>
            <div>
              <strong>Communication Style:</strong> {enhancedUserProfile.communicationStyle}
            </div>
            <div>
              <strong>AI Personality:</strong> {enhancedUserProfile.aiPersonality}
            </div>
            <div>
              <strong>Detail Level:</strong> {enhancedUserProfile.detailLevel}
            </div>
            <div>
              <strong>Health Score:</strong> {enhancedUserProfile.financialHealthScore || 'N/A'}
            </div>
          </div>
        </Card>
      )}

      {/* Opportunities */}
      {opportunities && opportunities.length > 0 && (
        <Card className="foundation-card">
          <h3>🎯 Detected Opportunities</h3>
          <div style={{ fontSize: '14px' }}>
            {opportunities.slice(0, 3).map((opp, index) => (
              <div key={index} style={{ 
                marginBottom: '10px', 
                padding: '10px', 
                backgroundColor: '#fff3cd', 
                borderRadius: '4px',
                borderLeft: '4px solid #ffc107'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                  {opp.type.replace('_', ' ').toUpperCase()}
                </div>
                <div style={{ marginBottom: '5px' }}>{opp.description}</div>
                <div style={{ color: '#28a745', fontWeight: 'bold' }}>
                  Potential Savings: {FinancialUtils.formatCurrency(opp.potentialSavings)}/year
                </div>
              </div>
            ))}
            {opportunities.length > 3 && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                +{opportunities.length - 3} more opportunities available
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Sample Scenarios */}
      <Card className="foundation-card">
        <h3>📋 Sample Scenarios</h3>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
          Load realistic test data for different user types
        </p>
        
        <div style={{ marginBottom: '15px' }}>
          <select 
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            style={{ 
              padding: '8px', 
              border: '1px solid #ddd', 
              borderRadius: '4px',
              marginRight: '10px'
            }}
          >
            {Object.entries(sampleScenarios).map(([key, scenario]) => (
              <option key={key} value={key}>{scenario.name}</option>
            ))}
          </select>
          <button 
            onClick={handleLoadScenario}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Load Scenario
          </button>
        </div>

        {selectedScenario && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong>Description:</strong> {sampleScenarios[selectedScenario]?.description}
          </div>
        )}
      </Card>

      {/* Advanced Features Toggle */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          style={{
            padding: '10px 20px',
            backgroundColor: showAdvanced ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Features
        </button>
      </div>

      {/* Advanced Features */}
      {showAdvanced && (
        <Card className="foundation-card">
          <h3>🔧 Advanced Foundation Features</h3>
          <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '15px' }}>
              <strong>✅ Financial Calculations:</strong> Real mathematical formulas for debt payoff, investment growth, and emergency funds
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>✅ Data Validation:</strong> Comprehensive Zod schemas ensure all financial data is valid and safe for AI processing
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>✅ Enhanced User Profiles:</strong> Rich user context including preferences, literacy level, and communication style for AI personalization
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>✅ Market Benchmarks:</strong> Current market rates and opportunity detection algorithms to identify improvement opportunities
            </div>
            <div style={{ marginBottom: '15px' }}>
              <strong>✅ Sample Scenarios:</strong> Comprehensive test data representing different user types and financial situations
            </div>
            <div style={{ 
              padding: '10px', 
              backgroundColor: '#e7f3ff', 
              borderRadius: '4px',
              borderLeft: '4px solid #007bff'
            }}>
              <strong>🚀 Ready for AI Integration:</strong> All foundation features are designed to work seamlessly with AI services for document parsing, personalized narratives, and intelligent financial guidance.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
