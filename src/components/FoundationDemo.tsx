import React, { useState, useEffect } from 'react';
import { FinancialCalculations, FinancialUtils } from '../utils/financialCalculations';
import { ValidationUtils } from '../utils/validation';
import { UserProfileUtils } from '../data/enhancedUserProfile';
import { OpportunityDetection } from '../data/marketData';
import { SampleScenarioUtils, sampleScenarios } from '../data/sampleScenarios';
import { Card } from './Card';
import './FoundationDemo.css';

export function FoundationDemo() {
  const [selectedScenario, setSelectedScenario] = useState<string>('recentGrad');
  const [calculations, setCalculations] = useState<any>(null);
  const [opportunities, setOpportunities] = useState<any>(null);
  const [validationResults, setValidationResults] = useState<any>(null);
  const [userContext, setUserContext] = useState<string>('');

  const scenario = SampleScenarioUtils.getScenario(selectedScenario);

  useEffect(() => {
    if (scenario) {
      // Run financial calculations
      const debtAccounts = scenario.accounts.filter(a => ['loan', 'credit_card'].includes(a.type));
      const investmentAccounts = scenario.accounts.filter(a => a.type === 'investment');
      
      const calcResults: any = {
        financialHealth: FinancialCalculations.calculateFinancialHealth(scenario.accounts),
        debtStrategies: debtAccounts.length > 0 ? 
          FinancialCalculations.calculateOptimalDebtStrategy(debtAccounts) : null,
        goalProgress: scenario.goals.map(goal => ({
          goal: goal.name,
          progress: FinancialCalculations.calculateGoalProgress(goal, scenario.accounts)
        }))
      };

      // Calculate emergency fund
      if (scenario.userProfile.monthlyExpenses) {
        const savingsAccounts = scenario.accounts.filter(a => a.type === 'savings');
        const currentSavings = savingsAccounts.reduce((sum, a) => sum + a.balance, 0);
        calcResults.emergencyFund = FinancialCalculations.calculateEmergencyFund(
          scenario.userProfile.monthlyExpenses,
          6, // 6 months target
          currentSavings,
          500 // Monthly contribution
        );
      }

      setCalculations(calcResults);

      // Run opportunity detection
      const oppAnalysis = OpportunityDetection.analyzeOpportunities(
        scenario.accounts,
        scenario.userProfile
      );
      setOpportunities(oppAnalysis);

      // Run data validation
      const validation = ValidationUtils.validateFinancialData({
        accounts: scenario.accounts,
        goals: scenario.goals,
        userProfile: scenario.userProfile
      });
      setValidationResults(validation);

      // Generate user context
      const context = UserProfileUtils.generateUserContext(
        scenario.userProfile,
        scenario.accounts,
        scenario.goals
      );
      setUserContext(context);
    }
  }, [selectedScenario]);

  if (!scenario) return <div>Loading...</div>;

  return (
    <div className="foundation-demo">
      <div className="demo-header">
        <h2>🏗️ Foundation Features Demo</h2>
        <p>Demonstrating the core foundation features that will power AI integration</p>
      </div>

      {/* Scenario Selection */}
      <div className="demo-section">
        <h3>📋 Sample Scenarios</h3>
        <div className="scenario-selector">
          {Object.entries(sampleScenarios).map(([key, scenario]) => (
            <button
              key={key}
              className={`scenario-button ${selectedScenario === key ? 'active' : ''}`}
              onClick={() => setSelectedScenario(key)}
            >
              <div className="scenario-name">{scenario.name}</div>
              <div className="scenario-desc">{scenario.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Current Scenario Info */}
      <div className="demo-section">
        <h3>👤 Current Scenario: {scenario.name}</h3>
        <div className="scenario-info">
          <div className="info-grid">
            <div className="info-item">
              <strong>Age:</strong> {scenario.userProfile.age} ({scenario.userProfile.ageRange})
            </div>
            <div className="info-item">
              <strong>Income:</strong> {FinancialUtils.formatCurrency(scenario.userProfile.income || 0)}
            </div>
            <div className="info-item">
              <strong>Risk Tolerance:</strong> {scenario.userProfile.riskTolerance}
            </div>
            <div className="info-item">
              <strong>Financial Literacy:</strong> {scenario.userProfile.financialLiteracy}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Calculations */}
      <div className="demo-section">
        <h3>🧮 Financial Calculations</h3>
        {calculations && (
          <div className="calculations-grid">
            <Card className="calculation-card">
              <h4>Financial Health Score</h4>
              <div className="score-display">
                <div className="score-number">{calculations.financialHealth?.healthScore || 0}</div>
                <div className="score-label">out of 100</div>
              </div>
              <div className="score-details">
                <div>Net Worth: {FinancialUtils.formatCurrency(calculations.financialHealth?.netWorth || 0)}</div>
                <div>Total Assets: {FinancialUtils.formatCurrency(calculations.financialHealth?.totalAssets || 0)}</div>
                <div>Total Debt: {FinancialUtils.formatCurrency(calculations.financialHealth?.totalDebt || 0)}</div>
              </div>
            </Card>

            {calculations.debtStrategies && (
              <Card className="calculation-card">
                <h4>Debt Strategy Analysis</h4>
                <div className="strategy-comparison">
                  <div className="strategy-item">
                    <strong>Snowball Method:</strong>
                    <div>Total Interest: {FinancialUtils.formatCurrency(calculations.debtStrategies.snowball.totalInterest)}</div>
                  </div>
                  <div className="strategy-item">
                    <strong>Avalanche Method:</strong>
                    <div>Total Interest: {FinancialUtils.formatCurrency(calculations.debtStrategies.avalanche.totalInterest)}</div>
                  </div>
                  <div className="recommendation">
                    <strong>Recommendation:</strong> {calculations.debtStrategies.recommendation}
                    <div>Savings: {FinancialUtils.formatCurrency(calculations.debtStrategies.savings)}</div>
                  </div>
                </div>
              </Card>
            )}

            {calculations.emergencyFund && (
              <Card className="calculation-card">
                <h4>Emergency Fund Analysis</h4>
                <div className="emergency-fund">
                  <div>Target Amount: {FinancialUtils.formatCurrency(calculations.emergencyFund.target)}</div>
                  <div>Remaining: {FinancialUtils.formatCurrency(calculations.emergencyFund.remainingAmount)}</div>
                  <div>Months to Complete: {calculations.emergencyFund.monthsToComplete}</div>
                  <div>Recommended Monthly: {FinancialUtils.formatCurrency(calculations.emergencyFund.recommendedMonthlyContribution)}</div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Opportunity Detection */}
      <div className="demo-section">
        <h3>🎯 Opportunity Detection</h3>
        {opportunities && (
          <div className="opportunities">
            <div className="opportunity-summary">
              <strong>Summary:</strong> {opportunities.summary}
            </div>
            <div className="opportunity-stats">
              <div className="stat">
                <div className="stat-number">{opportunities.opportunities.length}</div>
                <div className="stat-label">Opportunities Found</div>
              </div>
              <div className="stat">
                <div className="stat-number">{FinancialUtils.formatCurrency(opportunities.totalPotentialSavings)}</div>
                <div className="stat-label">Total Annual Savings</div>
              </div>
              <div className="stat">
                <div className="stat-number">{opportunities.quickWins.length}</div>
                <div className="stat-label">Quick Wins</div>
              </div>
            </div>
            
            {opportunities.opportunities.length > 0 && (
              <div className="opportunity-list">
                <h4>Top Opportunities:</h4>
                {opportunities.opportunities.slice(0, 3).map((opp: any, index: number) => (
                  <div key={index} className="opportunity-item">
                    <div className="opportunity-header">
                      <span className="opportunity-type">{opp.type.replace('_', ' ')}</span>
                      <span className="opportunity-savings">+{FinancialUtils.formatCurrency(opp.potentialSavings)}/year</span>
                    </div>
                    <div className="opportunity-description">{opp.description}</div>
                    <div className="opportunity-action">{opp.actionRequired}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Data Validation */}
      <div className="demo-section">
        <h3>✅ Data Validation</h3>
        {validationResults && (
          <div className="validation-results">
            <div className={`validation-status ${validationResults.success ? 'success' : 'error'}`}>
              {validationResults.success ? '✅ All data valid' : '❌ Validation errors found'}
            </div>
            {validationResults.errorMessages && (
              <div className="validation-errors">
                <h4>Validation Errors:</h4>
                <ul>
                  {validationResults.errorMessages.map((error: string, index: number) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Context for AI */}
      <div className="demo-section">
        <h3>🤖 AI Context Generation</h3>
        <div className="ai-context">
          <h4>Generated User Context:</h4>
          <pre className="context-text">{userContext}</pre>
        </div>
        <div className="ai-recommendations">
          <h4>AI Recommendations:</h4>
          <ul>
            {SampleScenarioUtils.getAIRecommendations(scenario).map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Foundation Features Summary */}
      <div className="demo-section">
        <h3>🏗️ Foundation Features Summary</h3>
        <div className="features-grid">
          <div className="feature-item">
            <h4>✅ Financial Calculations</h4>
            <p>Real mathematical formulas for debt payoff, investment growth, emergency funds, and financial health scoring.</p>
          </div>
          <div className="feature-item">
            <h4>✅ Data Validation</h4>
            <p>Comprehensive Zod schemas ensure all financial data is valid and safe for AI processing.</p>
          </div>
          <div className="feature-item">
            <h4>✅ Enhanced User Profiles</h4>
            <p>Rich user context including preferences, literacy level, and communication style for AI personalization.</p>
          </div>
          <div className="feature-item">
            <h4>✅ Market Benchmarks</h4>
            <p>Current market rates and opportunity detection algorithms to identify improvement opportunities.</p>
          </div>
          <div className="feature-item">
            <h4>✅ Sample Scenarios</h4>
            <p>Comprehensive test data representing different user types and financial situations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
