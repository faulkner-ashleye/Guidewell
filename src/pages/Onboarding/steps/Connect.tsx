import React, { useState } from 'react';
import PlaidLinkButton from '../../../components/PlaidLinkButton';
import { useAppState } from '../../../state/AppStateContext';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { Card } from '../../../components/Card';
import { Icon, IconNames } from '../../../components/Icon';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

export default function Connect({ onNext, onBack, onSkip, onNavigateToSampleData, onNavigateToManualEntry }: {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  onNavigateToSampleData: () => void;
  onNavigateToManualEntry: () => void;
}) {
  const { clearSampleData, setAccounts } = useAppState();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSampleDataClick = () => {
    setSelectedOption('sample-data');
  };

  const handleManualEntryClick = () => {
    setSelectedOption('manual-entry');
  };

  const handleNext = () => {
    if (selectedOption === 'sample-data') {
      onNavigateToSampleData();
    } else if (selectedOption === 'manual-entry') {
      onNavigateToManualEntry();
    }
  };

  return (
    <div className="onboarding-screen">
      <OnboardingHeader />

      <div className="onboarding-content">
        <section>
          <h1 className="typography-h1">Let's connect your accounts</h1>
          <p className="typography-body1">Choose how you'd like to get started with Guidewell.</p>

          <div className="connect-options">
            {/* Sample Accounts Card */}
            <Card
              className={`connect-card ${selectedOption === 'sample-data' ? 'selected' : ''}`}
              onClick={handleSampleDataClick}
            >
              <div className="connect-card-content">
                <div className="connect-card-icon">
                  <Icon name={IconNames.account_balance} size="xl" />
                </div>
                <div className="connect-card-text">
                  <h3>Start with Sample Data</h3>
                  <p>Explore Guidewell with realistic financial scenarios. Perfect for trying out features.</p>
                </div>
              </div>
            </Card>

            {/* Plaid Connection Card */}
            <Card className="connect-card">
              <div className="connect-card-content">
                <div className="connect-card-icon">
                  <Icon name={IconNames.account_balance_wallet} size="xl" />
                </div>
                <div className="connect-card-text">
                  <h3>Connect with Plaid</h3>
                  <p>Securely link your real bank accounts to see your actual financial picture.</p>
                </div>
                <div className="connect-card-action">
                  <PlaidLinkButton
                    key="plaid-link-singleton"
                    userId="demo-user-123"
                    onSuccess={(linked) => {
                      clearSampleData();
                      setAccounts(linked);
                      onNext();
                    }}
                  />
                </div>
              </div>
            </Card>

            {/* Manual Entry Card */}
            <Card
              className={`connect-card ${selectedOption === 'manual-entry' ? 'selected' : ''}`}
              onClick={handleManualEntryClick}
            >
              <div className="connect-card-content">
                <div className="connect-card-icon">
                  <Icon name={IconNames.edit} size="xl" />
                </div>
                <div className="connect-card-text">
                  <h3>Add Accounts Manually</h3>
                  <p>Enter your account information manually or upload documents.</p>
                </div>
              </div>
            </Card>
          </div>


        </section>
      </div>
      <div className="onboarding-actions">
        <div className="action-buttons">
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={handleNext}
            disabled={!selectedOption}
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
