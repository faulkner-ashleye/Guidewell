import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Select } from '../../components/Inputs';
import { ThemeSwitcher } from '../../components/ThemeSwitcher';
import { Button, ButtonVariants, ButtonColors } from '../../components/Button';
import { Icon, IconNames } from '../../components/Icon';
import AppHeader from '../../app/components/AppHeader';
import '../../components/Button.css';
import { useAppState } from '../../state/AppStateContext';
import { OnboardingState, MainGoal, Timeline as TimelineType, Comfort as ComfortType } from '../../data/onboardingTypes';
import './Settings.css';

const goalOptions: { value: MainGoal; label: string }[] = [
  { value: 'pay_down_debt', label: 'Pay down debt' },
  { value: 'save_big_goal', label: 'Save for a big goal' },
  { value: 'build_emergency', label: 'Build an emergency fund' },
  { value: 'start_investing', label: 'Start investing' }
];

const timelineOptions: { value: TimelineType; label: string }[] = [
  { value: 'short', label: 'Short (1–2 years)' },
  { value: 'mid', label: 'Mid (3–5 years)' },
  { value: 'long', label: 'Long (5+ years)' }
];

const comfortOptions: { value: ComfortType; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'confident', label: 'Confident' }
];

const ageRangeOptions = [
  { value: '', label: 'Select age range' },
  { value: 'under_20', label: 'Under 20' },
  { value: '20-25', label: '20-25' },
  { value: '26-30', label: '26-30' },
  { value: '31-35', label: '31-35' },
  { value: '36-40', label: '36-40' },
  { value: '41-45', label: '41-45' },
  { value: '45+', label: '45+' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

// AI Coaching Preferences Options
const aiPersonalityOptions = [
  { value: 'encouraging', label: 'Encouraging' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'casual', label: 'Casual' },
  { value: 'professional', label: 'Professional' }
];

const communicationStyleOptions = [
  { value: 'detailed', label: 'Detailed' },
  { value: 'concise', label: 'Concise' },
  { value: 'visual', label: 'Visual' }
];

const detailLevelOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' }
];

const preferredLanguageOptions = [
  { value: 'simple', label: 'Simple' },
  { value: 'technical', label: 'Technical' },
  { value: 'mixed', label: 'Mixed' }
];

export function Settings() {
  const { userProfile, setUserProfile, logout } = useAppState();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<OnboardingState>({
    name: '',
    firstName: '', // Keep for backward compatibility
    lastName: '',  // Keep for backward compatibility
    mainGoals: [],
    ageRange: undefined,
    topPriority: undefined,
    timeline: undefined,
    comfort: undefined
  });

  // Pre-populate with userProfile from context
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        firstName: userProfile.firstName || '', // Keep for backward compatibility
        lastName: userProfile.lastName || '',   // Keep for backward compatibility
        ageRange: userProfile.ageRange as any,
        mainGoals: userProfile.mainGoals as any,
        topPriority: userProfile.topPriority as any,
        timeline: userProfile.timeline as any,
        comfort: userProfile.comfortLevel as any
      });
    }
  }, [userProfile]);

  const handleGoalToggle = (goal: MainGoal) => {
    const currentGoals = profileData.mainGoals;
    const newGoals = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    setProfileData(prev => ({ ...prev, mainGoals: newGoals }));

    // Clear topPriority if it's no longer in mainGoals
    if (profileData.topPriority && !newGoals.includes(profileData.topPriority)) {
      setProfileData(prev => ({ ...prev, topPriority: undefined }));
    }
  };

  const handleSave = () => {
    setUserProfile({
      ...userProfile, // Preserve existing profile data
      name: profileData.name,
      firstName: profileData.firstName, // Keep for backward compatibility
      lastName: profileData.lastName,   // Keep for backward compatibility
      ageRange: profileData.ageRange,
      mainGoals: profileData.mainGoals,
      topPriority: profileData.topPriority,
      timeline: profileData.timeline,
      comfortLevel: profileData.comfort
    });
    setIsEditing(false); // Exit edit mode after saving
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCancel = () => {
    // Reset form data to current user profile
    if (userProfile) {
      setProfileData({
        name: userProfile.name || '',
        firstName: userProfile.firstName || '', // Keep for backward compatibility
        lastName: userProfile.lastName || '',   // Keep for backward compatibility
        ageRange: userProfile.ageRange as any,
        mainGoals: userProfile.mainGoals as any,
        topPriority: userProfile.topPriority as any,
        timeline: userProfile.timeline as any,
        comfort: userProfile.comfortLevel as any
      });
    }
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="settings">
      <AppHeader
        title="Settings"
        showSettings={false}
        showQuickActions={true}
        onQuickActionsClick={() => {
          if ((window as any).globalSheets) {
            (window as any).globalSheets.openQuickActions();
          }
        }}
      />
      <div className="settings-content">
        {/* Financial Profile Section */}
        <Card className="settings-section">
          <div className="section-header">
            <h3 className="section-title">Your Financial Profile</h3>
            <Button
              variant={ButtonVariants.text}
              color={ButtonColors.secondary}
              size="small"
              onClick={() => setIsEditing(!isEditing)}
              aria-label={isEditing ? "Cancel editing" : "Edit profile"}
            >
              <Icon name={IconNames.edit} size="sm" />
            </Button>
          </div>

          <div className="profile-form">
            {/* Name Field */}
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                value={profileData.name || ''}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="form-input"
                disabled={!isEditing}
              />
            </div>

            {/* Age Range */}
            <Select
              label="Age Range"
              value={profileData.ageRange || ''}
              onChange={(e) => setProfileData(prev => ({ ...prev, ageRange: e.target.value as any }))}
              options={ageRangeOptions}
              disabled={!isEditing}
            />

            {/* Main Goals */}
            <div className="form-group">
              <label className="form-label">Main Goals (select all that apply)</label>
              <div className="checkbox-group">
                {goalOptions.map(option => (
                  <label key={option.value} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={profileData.mainGoals.includes(option.value)}
                      onChange={() => handleGoalToggle(option.value)}
                      disabled={!isEditing}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Top Priority */}
            {profileData.mainGoals.length > 0 && (
              <div className="form-group">
                <label className="form-label">Top Priority</label>
                <div className="radio-group">
                  {profileData.mainGoals.map(goal => (
                    <label key={goal} className="radio-label">
                      <input
                        type="radio"
                        name="topPriority"
                        value={goal}
                        checked={profileData.topPriority === goal}
                        onChange={() => setProfileData(prev => ({ ...prev, topPriority: goal }))}
                        disabled={!isEditing}
                      />
                      {goalOptions.find(opt => opt.value === goal)?.label}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            <div className="form-group">
              <label className="form-label">Timeline</label>
              <div className="radio-group">
                {timelineOptions.map(option => (
                  <label key={option.value} className="radio-label">
                    <input
                      type="radio"
                      name="timeline"
                      value={option.value}
                      checked={profileData.timeline === option.value}
                      onChange={() => setProfileData(prev => ({ ...prev, timeline: option.value }))}
                      disabled={!isEditing}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Comfort Level */}
            <div className="form-group">
              <label className="form-label">Comfort Level</label>
              <div className="radio-group">
                {comfortOptions.map(option => (
                  <label key={option.value} className="radio-label">
                    <input
                      type="radio"
                      name="comfort"
                      value={option.value}
                      checked={profileData.comfort === option.value}
                      onChange={() => setProfileData(prev => ({ ...prev, comfort: option.value }))}
                      disabled={!isEditing}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            {isEditing && (
              <div className="form-actions">
                <Button
                  variant={ButtonVariants.outline}
                  color={ButtonColors.secondary}
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant={ButtonVariants.contained}
                  color={ButtonColors.secondary}
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* AI Coaching Preferences Section - Hidden for now */}
        {false && (
          <Card className="settings-section">
            <h3 className="section-title">AI Coaching Preferences</h3>
            <div className="profile-form">
            <div className="form">
              <label className="form-label">AI Personality</label>
              <Select
                value={userProfile?.aiPersonality || 'encouraging'}
                onChange={(value) => setUserProfile({ ...userProfile!, aiPersonality: value as any })}
                options={aiPersonalityOptions}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Communication Style</label>
              <Select
                value={userProfile?.communicationStyle || 'concise'}
                onChange={(value) => setUserProfile({ ...userProfile!, communicationStyle: value as any })}
                options={communicationStyleOptions}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Detail Level</label>
              <Select
                value={userProfile?.detailLevel || 'medium'}
                onChange={(value) => setUserProfile({ ...userProfile!, detailLevel: value as any })}
                options={detailLevelOptions}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Language</label>
              <Select
                value={userProfile?.preferredLanguage || 'simple'}
                onChange={(value) => setUserProfile({ ...userProfile!, preferredLanguage: value as any })}
                options={preferredLanguageOptions}
              />
            </div>
            </div>
          </Card>
        )}

        {/* Appearance Section */}
        <Card className="settings-section">
          <h3 className="section-title">Appearance</h3>
          <div className="appearance-setting">
            <div className="setting-item">
              <label className="setting-label">Dark Mode</label>
              <ThemeSwitcher
                variant="toggle"
                size="md"
                showLabel={false}
                className="theme-switcher--settings"
              />
            </div>
          </div>
        </Card>

        {/* App Information */}
        <Card className="settings-section">
          <h3 className="section-title">About Guidewell</h3>
          <div className="app-info">
            <div className="info-item">
              <span className="info-label">Version</span>
              <span className="info-value">1.0.0</span>
            </div>
            <div className="info-item">
              <span className="info-label">Last Updated</span>
              <span className="info-value">September 2025</span>
            </div>
            <div className="info-item">
              <span className="info-label">Terms of Service</span>
              <button
                className="info-value link"
                onClick={() => navigate('/terms')}
              >
                View Terms
              </button>
            </div>
            <div className="info-item">
              <span className="info-label">Account</span>
              <button
                className="info-value link logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
