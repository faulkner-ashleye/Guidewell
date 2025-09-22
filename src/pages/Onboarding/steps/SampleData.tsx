import React, { useState } from 'react';
import { useAppState } from '../../../state/AppStateContext';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { OnboardingHeader } from '../components/OnboardingHeader';
import { sampleScenarios } from '../../../data/sampleScenarios';
import '../../../components/Button.css';

interface SampleDataProps {
  onNext: () => void;
  onBack: () => void;
}

export default function SampleData({ onNext, onBack }: SampleDataProps) {
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const { loadSampleScenario } = useAppState();

  const handleProfileSelect = (scenarioId: string) => {
    setSelectedProfile(scenarioId);
  };

  const handleNext = () => {
    if (selectedProfile) {
      loadSampleScenario(selectedProfile);
      onNext();
    }
  };

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <div className="onboarding-step">
          <h1 className="typography-h1">Choose a Sample Profile</h1>
          <p className="typography-body1">
            Select a sample profile to explore Guidewell with realistic financial data.
          </p>

          <div className="sample-profiles-list">
            {Object.entries(sampleScenarios).map(([key, scenario]) => (
              <Card
                key={key}
                className={`sample-profile-card ${selectedProfile === key ? 'selected' : ''}`}
                onClick={() => handleProfileSelect(key)}
              >
                <div className="sample-profile-content">
                  <div className="sample-profile-text">
                    <h3>{scenario.userProfile.firstName}</h3>
                    <p>{scenario.description}</p>
                    <div className="sample-profile-details">
                      <span className="sample-profile-age typography-body2">Age: {scenario.userProfile.age}</span>
                      <span className="sample-profile-income typography-body2">Income: ${scenario.userProfile.income?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>


        </div>
      </div>
      <div className="onboarding-actions">
        <div className="action-buttons">
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={handleNext}
            disabled={!selectedProfile}
          >
            Next
          </Button>
          <Button
            variant={ButtonVariants.outline}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={onBack}
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
