import React, { useState } from 'react';
import { AvatarSelector } from './AvatarSelector';
import { NarrativeAvatar, AvatarUtils } from '../data/narrativeAvatars';
import { useAppState } from '../state/AppStateContext';
import './AvatarSystemDemo.css';

export function AvatarSystemDemo() {
  const { accounts, userProfile } = useAppState();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [focusCategory, setFocusCategory] = useState<'debt' | 'savings' | 'investment' | undefined>(undefined);

  // Get account types from user's accounts
  const accountTypes = accounts.map(account => account.type);
  const hasDebt = accountTypes.some(type => ['credit_card', 'loan'].includes(type));
  const hasSavings = accountTypes.some(type => ['checking', 'savings'].includes(type));
  const hasInvestment = accountTypes.some(type => type === 'investment');

  const handleAvatarSelect = (avatar: NarrativeAvatar) => {
    setSelectedAvatar(avatar.id);
  };

  const handleCategoryFocus = (category: 'debt' | 'savings' | 'investment' | undefined) => {
    setFocusCategory(category);
    setSelectedAvatar(''); // Reset selection when changing focus
  };

  const getContextDescription = () => {
    if (focusCategory === 'debt') {
      return 'When focusing on debt accounts, you can see all debt-related strategies including supporting personas.';
    }
    if (focusCategory === 'savings') {
      return 'When focusing on savings accounts, you can see all savings-related strategies including supporting personas.';
    }
    if (focusCategory === 'investment') {
      return 'When focusing on investment accounts, you can see all investment-related strategies including supporting personas.';
    }
    return 'When comparing all accounts, you see the main 3 anchor strategies. Supporting strategies become available when focusing on specific account types.';
  };

  return (
    <div className="avatar-system-demo">
      <div className="demo-header">
        <h2>Enhanced Narrative Avatar System</h2>
        <p>Experience the new avatar system with context-aware strategy selection</p>
      </div>

      <div className="demo-controls">
        <div className="context-selector">
          <h3>Choose Context:</h3>
          <div className="context-buttons">
            <button 
              className={`context-button ${!focusCategory ? 'active' : ''}`}
              onClick={() => handleCategoryFocus(undefined)}
            >
              All Accounts ({accountTypes.length} types)
            </button>
            {hasDebt && (
              <button 
                className={`context-button ${focusCategory === 'debt' ? 'active' : ''}`}
                onClick={() => handleCategoryFocus('debt')}
              >
                Debt Focus
              </button>
            )}
            {hasSavings && (
              <button 
                className={`context-button ${focusCategory === 'savings' ? 'active' : ''}`}
                onClick={() => handleCategoryFocus('savings')}
              >
                Savings Focus
              </button>
            )}
            {hasInvestment && (
              <button 
                className={`context-button ${focusCategory === 'investment' ? 'active' : ''}`}
                onClick={() => handleCategoryFocus('investment')}
              >
                Investment Focus
              </button>
            )}
          </div>
        </div>

        <div className="context-description">
          <p>{getContextDescription()}</p>
        </div>
      </div>

      <div className="avatar-selector-container">
        <AvatarSelector
          accountTypes={accountTypes}
          focusCategory={focusCategory}
          selectedAvatar={selectedAvatar}
          onAvatarSelect={handleAvatarSelect}
          userProfile={userProfile ? {
            riskTolerance: userProfile.riskTolerance || 'moderate',
            mainGoals: userProfile.mainGoals || [],
            financialLiteracy: userProfile.financialLiteracy || 'intermediate'
          } : undefined}
        />
      </div>

      {selectedAvatar && (
        <div className="selected-avatar-details">
          <h3>Selected Strategy Details</h3>
          <div className="avatar-details">
            {(() => {
              const avatar = AvatarUtils.getAvatarById(selectedAvatar);
              if (!avatar) return null;
              
              return (
                <div className="avatar-detail-card">
                  <div className="detail-header">
                    <span className="detail-icon">{avatar.emoji}</span>
                    <div className="detail-info">
                      <h4>{avatar.name}</h4>
                      <span className="detail-category">{avatar.category} • {avatar.tier}</span>
                    </div>
                  </div>
                  
                  <div className="detail-content">
                    <div className="detail-section">
                      <h5>Narrative</h5>
                      <p>"{avatar.narrative}"</p>
                    </div>
                    
                    <div className="detail-section">
                      <h5>Balance</h5>
                      <p>{avatar.balance}</p>
                    </div>
                    
                    <div className="detail-section">
                      <h5>Allocation Strategy</h5>
                      <div className="allocation-breakdown">
                        <div className="allocation-item">
                          <span className="allocation-label">Debt:</span>
                          <span className="allocation-value">{avatar.allocation.debt}%</span>
                        </div>
                        <div className="allocation-item">
                          <span className="allocation-label">Savings:</span>
                          <span className="allocation-value">{avatar.allocation.savings}%</span>
                        </div>
                        <div className="allocation-item">
                          <span className="allocation-label">Investment:</span>
                          <span className="allocation-value">{avatar.allocation.investing}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-section">
                      <h5>Risk & Timeline</h5>
                      <div className="risk-timeline">
                        <span className="risk-badge">{avatar.riskLevel} risk</span>
                        <span className="timeline-badge">{avatar.timeline} timeline</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <div className="demo-info">
        <h3>How It Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🎯 Anchor Strategies</h4>
            <p>The main 3 strategies (Debt Crusher, Goal Keeper, Nest Builder) are always available when comparing all accounts.</p>
          </div>
          <div className="info-card">
            <h4>🔍 Context-Aware</h4>
            <p>When focusing on specific account types (debt, savings, investment), supporting strategies become available.</p>
          </div>
          <div className="info-card">
            <h4>🎭 Supporting Personas</h4>
            <p>Each category has 3 supporting personas with different approaches and risk levels.</p>
          </div>
          <div className="info-card">
            <h4>🤖 AI-Ready</h4>
            <p>All avatars include rich context for AI narrative generation and personalized recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
