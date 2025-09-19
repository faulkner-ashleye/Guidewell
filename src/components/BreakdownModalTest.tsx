import React, { useState } from 'react';
import { BreakdownModal } from '../app/strategies/components/BreakdownModal';
import { EnhancedUserProfile } from '../data/enhancedUserProfile';

// Test component to verify BreakdownModal AI integration
export function BreakdownModalTest() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Create test user profiles with different AI personalities
  const testProfiles: { name: string; profile: EnhancedUserProfile }[] = [
    {
      name: 'Encouraging Conservative',
      profile: {
        id: 'test-alex-001',
        firstName: 'Alex',
        age: 28,
        ageRange: '25-30',
        income: 75000,
        monthlyExpenses: 4500,
        riskTolerance: 'conservative',
        financialLiteracy: 'intermediate',
        mainGoals: ['pay_down_debt', 'build_emergency'],
        topPriority: 'pay_down_debt',
        timeline: 'mid',
        communicationStyle: 'concise',
        notificationFrequency: 'weekly',
        preferredLanguage: 'simple',
        aiPersonality: 'encouraging',
        detailLevel: 'medium',
        hasSampleData: true,
        onboardingCompleted: true
      }
    },
    {
      name: 'Analytical Aggressive',
      profile: {
        id: 'test-jordan-001',
        firstName: 'Jordan',
        age: 32,
        ageRange: '30-35',
        income: 95000,
        monthlyExpenses: 5500,
        riskTolerance: 'aggressive',
        financialLiteracy: 'advanced',
        mainGoals: ['start_investing', 'retirement'],
        topPriority: 'start_investing',
        timeline: 'long',
        communicationStyle: 'visual',
        notificationFrequency: 'monthly',
        preferredLanguage: 'technical',
        aiPersonality: 'analytical',
        detailLevel: 'high',
        hasSampleData: true,
        onboardingCompleted: true
      }
    },
    {
      name: 'Casual Balanced',
      profile: {
        id: 'test-sam-001',
        firstName: 'Sam',
        age: 26,
        ageRange: '25-30',
        income: 65000,
        monthlyExpenses: 4000,
        riskTolerance: 'moderate',
        financialLiteracy: 'beginner',
        mainGoals: ['save_big_goal', 'build_emergency'],
        topPriority: 'build_emergency',
        timeline: 'short',
        communicationStyle: 'concise',
        notificationFrequency: 'weekly',
        preferredLanguage: 'simple',
        aiPersonality: 'casual',
        detailLevel: 'low',
        hasSampleData: true,
        onboardingCompleted: true
      }
    }
  ];

  const [selectedProfile, setSelectedProfile] = useState(0);

  // Test accounts
  const testAccounts = [
    {
      id: '1',
      name: 'Chase Checking',
      type: 'checking' as const,
      balance: 2500,
      apr: 0.01
    },
    {
      id: '2',
      name: 'Chase Savings',
      type: 'savings' as const,
      balance: 8000,
      apr: 0.5
    },
    {
      id: '3',
      name: 'Chase Freedom Credit Card',
      type: 'credit_card' as const,
      balance: 4500,
      apr: 22.99
    },
    {
      id: '4',
      name: 'Student Loan',
      type: 'loan' as const,
      balance: 25000,
      apr: 4.5
    }
  ];

  // Test goals
  const testGoals = [
    {
      id: '1',
      name: 'Emergency Fund',
      type: 'savings' as const,
      target: 10000,
      accountId: '2',
      monthlyContribution: 500,
      priority: 'high' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      name: 'Vacation Fund',
      type: 'savings' as const,
      target: 3000,
      monthlyContribution: 200,
      priority: 'medium' as const,
      createdAt: '2024-01-01T00:00:00.000Z'
    }
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>BreakdownModal AI Integration Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Test User Profiles:</h3>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {testProfiles.map((profile, index) => (
            <button
              key={index}
              onClick={() => setSelectedProfile(index)}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedProfile === index ? '#3b82f6' : '#e5e7eb',
                color: selectedProfile === index ? 'white' : 'black',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {profile.name}
            </button>
          ))}
        </div>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h4>Current Profile: {testProfiles[selectedProfile].name}</h4>
          <p><strong>Name:</strong> {testProfiles[selectedProfile].profile.firstName}</p>
          <p><strong>Age:</strong> {testProfiles[selectedProfile].profile.age} ({testProfiles[selectedProfile].profile.ageRange})</p>
          <p><strong>Income:</strong> ${testProfiles[selectedProfile].profile.income?.toLocaleString()}</p>
          <p><strong>AI Personality:</strong> {testProfiles[selectedProfile].profile.aiPersonality}</p>
          <p><strong>Communication Style:</strong> {testProfiles[selectedProfile].profile.communicationStyle}</p>
          <p><strong>Detail Level:</strong> {testProfiles[selectedProfile].profile.detailLevel}</p>
          <p><strong>Risk Tolerance:</strong> {testProfiles[selectedProfile].profile.riskTolerance}</p>
          <p><strong>Financial Literacy:</strong> {testProfiles[selectedProfile].profile.financialLiteracy}</p>
          <p><strong>Main Goals:</strong> {testProfiles[selectedProfile].profile.mainGoals.join(', ')}</p>
          <p><strong>Timeline:</strong> {testProfiles[selectedProfile].profile.timeline}</p>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Test Different Strategies:</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['debt_crusher', 'goal_keeper', 'nest_builder', 'steady_payer', 'balanced_builder'].map(strategy => (
            <button
              key={strategy}
              onClick={() => setIsOpen(true)}
              style={{
                padding: '10px 15px',
                backgroundColor: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Test {strategy.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ 
        background: '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>What to Test:</h4>
        <ul>
          <li>Narrative should adapt based on AI personality (encouraging, analytical, casual)</li>
          <li>Communication style should affect detail level and visual elements</li>
          <li>Market insights should be personalized based on user's accounts</li>
          <li>Allocations should match the narrative avatar system</li>
          <li>Loading states should work properly</li>
        </ul>
      </div>

      <BreakdownModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        scope="all"
        strategy="debt_crusher"
        timeframe="mid"
        extraDollars={500}
        accounts={testAccounts}
        goals={testGoals}
        userProfile={testProfiles[selectedProfile].profile}
        assumedAnnualReturn={0.06}
      />
    </div>
  );
}
