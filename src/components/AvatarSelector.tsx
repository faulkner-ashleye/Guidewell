import React, { useState } from 'react';
import { NarrativeAvatar, AvatarUtils, anchorAvatars } from '../data/narrativeAvatars';
import { AvatarIllustration } from './AvatarIllustration';
import './AvatarSelector.css';

interface AvatarSelectorProps {
  accountTypes: string[];
  focusCategory?: 'debt' | 'savings' | 'investment';
  selectedAvatar?: string;
  onAvatarSelect: (avatar: NarrativeAvatar) => void;
  userProfile?: {
    riskTolerance: 'conservative' | 'moderate' | 'aggressive';
    mainGoals: string[];
    financialLiteracy: 'beginner' | 'intermediate' | 'advanced';
  };
  hideShowAllButton?: boolean;
}

export function AvatarSelector({
  accountTypes,
  focusCategory,
  selectedAvatar,
  onAvatarSelect,
  userProfile,
  hideShowAllButton = false
}: AvatarSelectorProps) {

  // Get appropriate avatars based on context
  const availableAvatars = AvatarUtils.getAvatarsForContext(accountTypes, focusCategory);

  // Get recommended avatars if user profile is provided
  const recommendedAvatars = userProfile
    ? AvatarUtils.getRecommendedAvatars(userProfile)
    : anchorAvatars;

  // When focusing on a specific category, show all avatars
  // When comparing all accounts, show only anchor avatars
  const displayAvatars = focusCategory
    ? availableAvatars // Show all when focusing on a category
    : anchorAvatars; // Show only main strategies when comparing all accounts

  const handleAvatarClick = (avatar: NarrativeAvatar) => {
    onAvatarSelect(avatar);
  };

  const getCategoryTitle = () => {
    if (focusCategory === 'debt') return 'Debt Strategies';
    if (focusCategory === 'savings') return 'Savings Strategies';
    if (focusCategory === 'investment') return 'Investment Strategies';
    return 'Financial Strategies';
  };

  const getCategoryDescription = () => {
    if (focusCategory === 'debt') return 'Choose how to approach your debt payoff';
    if (focusCategory === 'savings') return 'Choose how to build your savings';
    if (focusCategory === 'investment') return 'Choose how to grow your investments';
    return 'Choose a strategy that fits your financial goals';
  };

  return (
    <div className="avatar-selector">
      <div className="avatar-grid">
        {displayAvatars.map(avatar => (
          <div
            key={avatar.id}
            className={`avatar-card ${selectedAvatar === avatar.id ? 'selected' : ''} ${
              avatar.tier === 'anchor' ? 'anchor' : 'supporting'
            }`}
            onClick={() => handleAvatarClick(avatar)}
          >
            <div className="avatar-illustration-container">
              <AvatarIllustration 
                avatarId={avatar.id} 
                fallbackEmoji={avatar.emoji}
                className="avatar-illustration"
              />
            </div>
            <div className="avatar-content">
              <h4 className="avatar-name">{avatar.name}</h4>
              <p className="avatar-narrative">"{avatar.narrative}"</p>
              <div className="avatar-balance">
                <span className="balance-label">Balance:</span>
                <span className="balance-text">{avatar.balance}</span>
              </div>
              <div className="avatar-allocation">
                <div className="allocation-bar">
                  <div
                    className="allocation-segment debt"
                    style={{ width: `${avatar.allocation.debt}%` }}
                    title={`${avatar.allocation.debt}% Debt`}
                  ></div>
                  <div
                    className="allocation-segment savings"
                    style={{ width: `${avatar.allocation.savings}%` }}
                    title={`${avatar.allocation.savings}% Savings`}
                  ></div>
                  <div
                    className="allocation-segment investment"
                    style={{ width: `${avatar.allocation.investing}%` }}
                    title={`${avatar.allocation.investing}% Investment`}
                  ></div>
                </div>
                <div className="allocation-labels">
                  <span className="allocation-label">Debt: {avatar.allocation.debt}%</span>
                  <span className="allocation-label">Savings: {avatar.allocation.savings}%</span>
                  <span className="allocation-label">Investment: {avatar.allocation.investing}%</span>
                </div>
              </div>
            </div>
            {avatar.tier === 'anchor' && (
              <div className="anchor-badge">Main Strategy</div>
            )}
          </div>
        ))}
      </div>


      {userProfile && recommendedAvatars.length > 0 && (
        <div className="recommended-section">
          <h4 className="recommended-title">Recommended for You</h4>
          <div className="recommended-avatars">
            {recommendedAvatars.slice(0, 2).map(avatar => (
              <div
                key={`rec-${avatar.id}`}
                className="recommended-avatar"
                onClick={() => handleAvatarClick(avatar)}
              >
                <div className="recommended-icon-container">
                  <AvatarIllustration 
                    avatarId={avatar.id} 
                    fallbackEmoji={avatar.emoji}
                    className="recommended-icon"
                  />
                </div>
                <span className="recommended-name">{avatar.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
