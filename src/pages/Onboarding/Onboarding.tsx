import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingState } from '../../data/onboardingTypes';
import { useAppState } from '../../state/AppStateContext';
import { sampleScenarios, SampleScenarioUtils } from '../../data/sampleScenarios';
import { Welcome } from './steps/Welcome';
import { Goals } from './steps/Goals';
import { Priority } from './steps/Priority';
import { Timeline } from './steps/Timeline';
import { Comfort } from './steps/Comfort';
import Connect from './steps/Connect';
import { Finish } from './steps/Finish';
import './Onboarding.css';

type OnboardingStep = 'welcome' | 'goals' | 'priority' | 'timeline' | 'comfort' | 'connect' | 'finish';

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
    const baseSteps: OnboardingStep[] = ['welcome', 'goals'];
    
    // Add priority step if multiple goals are selected
    if (data.mainGoals.length > 1) {
      baseSteps.push('priority');
    }
    
    // Add remaining steps
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
    } else {
      const nextStep = stepOrder[currentStepIndex + 1];
      setCurrentStep(nextStep);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      const prevStep = stepOrder[currentStepIndex - 1];
      setCurrentStep(prevStep);
    }
  };

  const handleSkip = () => {
    // Load recent graduate scenario data when user skips
    const recentGradScenario = sampleScenarios.recentGrad;
    // Cast accounts to match the app's Account type (remove 'debt' type)
    const accounts = recentGradScenario.accounts.map(account => ({
      ...account,
      type: account.type === 'debt' ? 'loan' : account.type
    })) as any;
    setAccounts(accounts);
    setTransactions([]); // Sample scenarios don't include transactions yet
    
    // Add some sample manual contributions for testing
    const sampleContributions = [
      {
        id: 'sample-contrib-1',
        accountId: 'savings-001', // Recent grad's savings account
        amount: 722,
        date: '2025-01-15',
        description: 'Wedding fund contribution',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-contrib-2',
        accountId: 'checking-001', // Recent grad's checking account
        amount: -150,
        date: '2025-01-14',
        description: 'Manual expense entry',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-contrib-3',
        accountId: 'student-loan-001', // Student loan
        amount: -120,
        date: '2025-01-13',
        description: 'Student loan payment',
        createdAt: new Date().toISOString()
      }
    ];
    setContributions(sampleContributions);
    
    // Add some sample goals for testing
    const sampleGoals = [
      {
        id: 'wedding-fund-goal',
        name: 'Emergency Fund',
        type: 'savings' as const,
        accountId: 'savings-001', // Recent grad's savings account
        target: 6000,
        targetDate: '2026-07-15', // 18 months from January 2025
        monthlyContribution: 200, // $4,500 needed ÷ 18 months
        priority: 'high' as const,
        note: 'Build emergency fund for financial security',
        createdAt: new Date().toISOString()
      },
      {
        id: 'credit-card-payoff',
        name: 'Credit Card Payoff',
        type: 'debt' as const,
        accountId: 'credit-card-001', // Credit card
        target: 0, // Payoff goal
        targetDate: '2025-12-31',
        monthlyContribution: 200,
        priority: 'high' as const,
        note: 'Pay off high-interest credit card debt',
        createdAt: new Date().toISOString()
      },
      {
        id: 'student-loan-payoff',
        name: 'Student Loan Payoff',
        type: 'debt' as const,
        accountId: 'student-loan-001', // Student loan
        target: 25000, // Student loan balance
        targetDate: '2027-12-31', // 3-year payoff timeline
        monthlyContribution: 400, // Aggressive payoff: $25K ÷ 30 months
        priority: 'medium' as const,
        note: 'Pay off student loan over 3 years',
        createdAt: new Date().toISOString()
      }
    ];
    setGoals(sampleGoals);
    
    // Set user profile with sample data flag and any completed onboarding data
    setUserProfile({
      ...recentGradScenario.userProfile,
      ...data, // Preserve any completed onboarding data
      hasSampleData: true // Flag to indicate sample data was loaded
    });
    
    navigate('/home');
  };

  const handleFinish = (finalData: OnboardingState) => {
    setUserProfile({
      ...userProfile, // Preserve existing profile data including hasSampleData
      firstName: finalData.firstName,
      lastName: finalData.lastName,
      ageRange: finalData.ageRange,
      mainGoals: finalData.mainGoals,
      topPriority: finalData.topPriority,
      timeline: finalData.timeline,
      comfortLevel: finalData.comfort
    });
    navigate('/home');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <Welcome data={data} update={update} onNext={handleNext} onSkip={handleSkip} />;
      case 'goals':
        return <Goals data={data} update={update} onNext={handleNext} onSkip={handleSkip} accounts={accounts} />;
      case 'priority':
        return <Priority data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'timeline':
        return <Timeline data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'comfort':
        return <Comfort data={data} update={update} onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
      case 'connect':
        return <Connect onNext={handleNext} onBack={handleBack} onSkip={handleSkip} />;
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