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
  const { clearSampleData, setAccounts, setTransactions } = useAppState();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSampleDataClick = () => {
    setSelectedOption('sample-data');
  };

  const handleManualEntryClick = () => {
    setSelectedOption('manual-entry');
  };

  const handlePlaidClick = () => {
    setSelectedOption('plaid');
  };

  const handleNext = () => {
    if (selectedOption === 'sample-data') {
      onNavigateToSampleData();
    } else if (selectedOption === 'manual-entry') {
      onNavigateToManualEntry();
    } else if (selectedOption === 'plaid') {
      // Plaid will handle its own flow via the PlaidLinkButton
      // The onSuccess callback will call onNext()
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
            <Card 
              className={`connect-card ${selectedOption === 'plaid' ? 'selected' : ''}`}
              onClick={handlePlaidClick}
            >
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
                    autoOpen={selectedOption === 'plaid'}
                    onSuccess={(data) => {
                      console.log('Plaid success callback received:', data);
                      console.log('User connected real accounts via Plaid - clearing sample data');
                      
                      // Clear sample data when user connects real accounts
                      clearSampleData();
                      
                      // Handle both accounts and transactions if provided
                      if (Array.isArray(data)) {
                        // Legacy format: just accounts array
                        console.log('Setting accounts (legacy format):', data);
                        setAccounts(data);
                      } else if (data.accounts) {
                        // New format: object with accounts and transactions
                        console.log('Setting accounts (new format):', data.accounts);
                        setAccounts(data.accounts);
                        
                        // Set transactions if provided
                        if (data.transactions) {
                          console.log('Setting transactions:', data.transactions);
                          setTransactions(data.transactions);
                        }
                      } else {
                        // Fallback: treat as accounts array
                        console.log('Setting accounts (fallback):', data);
                        setAccounts(Array.isArray(data) ? data : []);
                      }
                      
                      console.log('Real accounts set, calling onNext()');
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
