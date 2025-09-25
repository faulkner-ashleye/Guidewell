import React from 'react';
import { Icon, IconNames } from './Icon';
import './PlaidSandboxBanner.css';

interface PlaidSandboxBannerProps {
  isVisible: boolean;
  currentStep?: 'initial' | 'login' | 'success';
  onClose?: () => void;
}

export function PlaidSandboxBanner({ isVisible, currentStep = 'initial', onClose }: PlaidSandboxBannerProps) {
  if (!isVisible) return null;

  const getStepInfo = () => {
    switch (currentStep) {
      case 'initial':
        return {
          message: 'You are currently in Sandbox mode. Sandbox phone number: 415-555-0011,  passcode: 123456',
        };

      case 'login':
        return {
          message: 'You are currently in Sandbox mode. Sandbox UN: user_good, PW: pass_good, Verification code: 123456',
        };

      case 'success':
        return {
          message: 'Your accounts have been connected!',
        };

      default:
        return {
          message: 'You are currently in Sandbox mode. Sandbox phone number: 415-555-0011,  passcode: 123456',
        };
    }
  };

  const stepInfo = getStepInfo();

  return (
    <div className="plaid-sandbox-banner">
      <div className="banner-content">
        <div className="banner-header">
          <Icon name={IconNames.info} className="banner-icon" />
          <div className="banner-text">
            <p className="banner-message">{stepInfo.message}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default PlaidSandboxBanner;
