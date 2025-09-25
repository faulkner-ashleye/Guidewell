import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingState } from '../../data/onboardingTypes';
import { useAppState } from '../../state/AppStateContext';
import { sampleScenarios, SampleScenarioUtils } from '../../data/sampleScenarios';
import { Welcome } from './steps/Welcome';
import { NameStep } from './steps/NameStep';
import { Goals } from './steps/Goals';
import { Priority } from './steps/Priority';
import { Timeline } from './steps/Timeline';
import { Comfort } from './steps/Comfort';
import Connect from './steps/Connect';
import SampleData from './steps/SampleData';
import ManualEntry from './steps/ManualEntry';
import { Finish } from './steps/Finish';
import './Onboarding.css';

type OnboardingStep = 'welcome' | 'name' | 'goals' | 'priority' | 'timeline' | 'comfort' | 'connect' | 'sample-data' | 'manual-entry' | 'finish';

export function Onboarding() {
  // Onboarding flow controller
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingState>({ mainGoals: [] });
  const navigate = useNavigate();
  const { 
    setUserProfile, 
    setAccounts, 
    setTransactions, 
    setContributions, 
    setGoals, 
    accounts, 
    userProfile
  } = useAppState();

  const update = <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) =>
    setData(prev => ({ ...prev, [key]: value }));

  // Dynamic step order based on whether multiple goals are selected
  const getStepOrder = (): OnboardingStep[] => {
    const baseSteps: OnboardingStep[] = ['welcome', 'name', 'goals'];
    
    // Add priority step if multiple goals are selected
    if (data.mainGoals.length > 1) {
      baseSteps.push('priority');
    }
    
    // Add remaining steps - connect and finish are always included
    baseSteps.push('timeline', 'comfort', 'connect', 'finish');
    
    return baseSteps;
  };

  const stepOrder = getStepOrder();
  const currentStepIndex = stepOrder.indexOf(currentStep);
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepOrder.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      navigate('/home');
    } else if (currentStep === 'sample-data' || currentStep === 'manual-entry') {
      // Special handling for sample-data and manual-entry steps - go directly to finish
      setCurrentStep('finish');
    } else {
      const nextStep = stepOrder[currentStepIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    // Prevent going back from the name step
    if (currentStep === 'name') {
      return;
    }
    
    // Special handling for sample-data and manual-entry steps
    if (currentStep === 'sample-data' || currentStep === 'manual-entry') {
      setCurrentStep('connect');
      return;
    }
    
    if (!isFirstStep) {
      const prevStep = stepOrder[currentStepIndex - 1];
      setCurrentStep(prevStep);
    }
  };

  const handleSkip = () => {
    // Randomly select a scenario when user skips onboarding
    const scenarioIds = Object.keys(sampleScenarios);
    const randomScenarioId = scenarioIds[Math.floor(Math.random() * scenarioIds.length)];
    const selectedScenario = sampleScenarios[randomScenarioId];
    
    console.log(`Loading random scenario: ${selectedScenario.name} (${selectedScenario.description})`);
    console.log(`Scenario details:`, selectedScenario);
    // Cast accounts to match the app's Account type (remove 'debt' type)
    const accounts = selectedScenario.accounts.map(account => ({
      ...account,
      type: account.type === 'debt' ? 'loan' : account.type
    })) as any;
    setAccounts(accounts);
    setTransactions(selectedScenario.transactions); // Load full transaction data from scenario
    setContributions([]); // Clear contributions since we have full transaction data
    
    // Convert goals from sample scenario to app format and link to accounts
    const convertedGoals = selectedScenario.goals.map(goal => {
      // Find matching account(s) for this goal
      let accountId: string | undefined;
      let accountIds: string[] | undefined;
      
      if (goal.type === 'debt_payoff') {
        // Link to credit card or loan accounts
        const debtAccounts = accounts.filter((acc: any) => ['credit_card', 'loan'].includes(acc.type));
        if (debtAccounts.length === 1) {
          accountId = debtAccounts[0].id;
        } else if (debtAccounts.length > 1) {
          accountIds = debtAccounts.map((acc: any) => acc.id);
        }
      } else if (goal.type === 'emergency_fund') {
        // Link to savings account
        const savingsAccount = accounts.find((acc: any) => acc.type === 'savings');
        if (savingsAccount) {
          accountId = savingsAccount.id;
        }
      } else if (goal.type === 'investment') {
        // Link to investment account
        const investmentAccount = accounts.find((acc: any) => acc.type === 'investment');
        if (investmentAccount) {
          accountId = investmentAccount.id;
        }
      }
      
      return {
        id: goal.id,
        name: goal.name,
        type: goal.type === 'debt_payoff' ? 'debt' as const : 
              goal.type === 'emergency_fund' ? 'savings' as const :
              goal.type === 'investment' ? 'investing' as const :
              'savings' as const,
        target: goal.target,
        targetDate: goal.targetDate,
        priority: goal.priority,
        note: `Sample goal from ${selectedScenario.name} scenario`,
        createdAt: new Date().toISOString(),
        accountId,
        accountIds
      };
    });
    setGoals(convertedGoals);
    
    // Set user profile with sample data flag and any completed onboarding data
    setUserProfile({
      ...selectedScenario.userProfile,
      ...data, // Preserve any completed onboarding data including name
      hasSampleData: true // Flag to indicate sample data was loaded
    });
    
    navigate('/home');
  };

  const handleFinish = (finalData: OnboardingState) => {
    setUserProfile({
      ...userProfile, // Preserve existing profile data including hasSampleData
      name: finalData.name,
      firstName: finalData.firstName,
      lastName: finalData.lastName,
      ageRange: finalData.ageRange,
      mainGoals: finalData.mainGoals,
      topPriority: finalData.topPriority,
      timeline: finalData.timeline,
      comfortLevel: finalData.comfort
    });
    
    // Onboarding complete - preserve whatever accounts the user has
    console.log('Onboarding complete - preserving user accounts');
    console.log('Final accounts:', accounts);
    console.log('Account count:', accounts.length);
    navigate('/home');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <Welcome data={data} update={update} onNext={handleNext} onSkip={handleSkip} />;
      case 'name':
        return <NameStep data={data} update={update} onNext={handleNext} />;
      case 'goals':
        return <Goals data={data} update={update} onNext={handleNext} onSkip={handleSkip} accounts={accounts} />;
      case 'priority':
        return <Priority data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'timeline':
        return <Timeline data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'comfort':
        return <Comfort data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'connect':
        return <Connect 
          onNext={handleNext} 
          onBack={handleBack} 
          onSkip={handleSkip}
          onNavigateToSampleData={() => setCurrentStep('sample-data')}
          onNavigateToManualEntry={() => setCurrentStep('manual-entry')}
        />;
      case 'sample-data':
        return <SampleData onNext={handleNext} onBack={handleBack} />;
      case 'manual-entry':
        return <ManualEntry onNext={handleNext} onBack={handleBack} />;
      case 'finish':
        return <Finish data={data} update={update} onFinish={handleFinish} onBack={handleBack} />;
      default:
        return <Welcome data={data} update={update} onNext={handleNext} onSkip={handleSkip} />;
    }
  };

  return (
    <div className="onboarding">
      <div className="onboarding-content">
        {renderCurrentStep()}
      </div>
    </div>
  );
}