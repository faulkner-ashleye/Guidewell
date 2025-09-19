import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Disclaimer } from '../../components/Disclaimer';
import { Select } from '../../components/Inputs';
import SupabaseTest from '../../components/SupabaseTest';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Button, ButtonVariants, ButtonColors } from '../../components/Button';
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
  { value: '20-25', label: '20-25' },
  { value: '26-30', label: '26-30' },
  { value: '31-35', label: '31-35' },
  { value: '36-40', label: '36-40' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' }
];

export function Settings() {
  const { userProfile, setUserProfile } = useAppState();
  const [profileData, setProfileData] = useState<OnboardingState>({
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
      ageRange: profileData.ageRange,
      mainGoals: profileData.mainGoals,
      topPriority: profileData.topPriority,
      timeline: profileData.timeline,
      comfortLevel: profileData.comfort
    });
  };

  return (
    <div className="settings">
      <div className="settings-header">
        <div className="settings-header-content">
          <div>
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              Customize your Guidewell experience
            </p>
          </div>
          <ThemeToggle />
        </div>
        <Link to="/onboarding" className="onboarding-link">
          Run onboarding again
        </Link>
      </div>

      <Disclaimer />

      <div className="settings-content">
        {/* Financial Profile Section */}
        <Card className="settings-section">
          <h3 className="section-title">Your Financial Profile</h3>
          
          <div className="profile-form">
            {/* Age Range */}
            <Select
              label="Age Range"
              value={profileData.ageRange || ''}
              onChange={(e) => setProfileData(prev => ({ ...prev, ageRange: e.target.value as any }))}
              options={ageRangeOptions}
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
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>

            <Button 
              variant={ButtonVariants.contained}
              color={ButtonColors.secondary}
              onClick={handleSave}
            >
              Save Profile
            </Button>
          </div>
        </Card>

        {/* Supabase Integration Test */}
        <SupabaseTest />

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
              <span className="info-value">January 2024</span>
            </div>
            <div className="info-item">
              <span className="info-label">Privacy Policy</span>
              <span className="info-value link">View Policy</span>
            </div>
            <div className="info-item">
              <span className="info-label">Terms of Service</span>
              <span className="info-value link">View Terms</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
