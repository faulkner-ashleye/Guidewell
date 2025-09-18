import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OnboardingState } from '../../data/onboardingTypes';
import { useAppState } from '../../state/AppStateContext';
import { transformJasmineData, jasmineProfile, transformJasmineTransactions } from '../../data/personas/jasmineRiveraTransformed';
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
    // Load Jasmine Rivera's realistic financial data when user skips
    const jasmineAccounts = transformJasmineData();
    const jasmineTransactions = transformJasmineTransactions();
    setAccounts(jasmineAccounts);
    setTransactions(jasmineTransactions);
    
    // Add some sample manual contributions for testing
    const sampleContributions = [
      {
        id: 'sample-contrib-1',
        accountId: 'jasmine-1', // Jasmine's savings account
        amount: 722,
        date: '2025-01-15',
        description: 'Wedding fund contribution',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-contrib-2',
        accountId: 'jasmine-0', // Jasmine's checking account
        amount: -150,
        date: '2025-01-14',
        description: 'Manual expense entry',
        createdAt: new Date().toISOString()
      },
      {
        id: 'sample-contrib-3',
        accountId: 'jasmine-3', // Federal Loan A
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
        name: 'Wedding Fund',
        type: 'savings' as const,
        accountId: 'jasmine-1', // Jasmine's savings account
        target: 15000,
        targetDate: '2026-07-15', // 18 months from January 2025
        monthlyContribution: 722, // $13,000 needed ÷ 18 months
        priority: 'high' as const,
        note: 'Dream wedding fund - $15K goal over 18 months',
        createdAt: new Date().toISOString()
      },
      {
        id: 'credit-card-payoff',
        name: 'Credit Card Payoff',
        type: 'debt' as const,
        accountId: 'jasmine-2', // Jasmine's credit card
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
        accountId: 'jasmine-3', // Primary account (for backward compatibility)
        accountIds: ['jasmine-3', 'jasmine-4', 'jasmine-5'], // All three student loans
        target: 23880, // Current total debt amount after $120 payment ($8,080 + $7,100 + $8,700)
        targetDate: '2027-12-31', // 3-year payoff timeline
        monthlyContribution: 800, // Aggressive payoff: $23.88K ÷ 30 months
        priority: 'medium' as const,
        note: 'Pay off all student loans (3 loans) over 3 years',
        createdAt: new Date().toISOString()
      }
    ];
    setGoals(sampleGoals);
    
    // Set user profile with sample data flag and any completed onboarding data
    setUserProfile({
      ...jasmineProfile,
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