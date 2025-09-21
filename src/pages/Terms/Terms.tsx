import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, IconNames } from '../../components/Icon';
import { Button, ButtonVariants } from '../../components/Button';
import AppHeader from '../../app/components/AppHeader';
import './Terms.css';

export function Terms() {
  const navigate = useNavigate();

  return (
    <div className="terms-page">
      <AppHeader
        title="Terms of Service"
        leftAction={
          <Button
            variant={ButtonVariants.text}
            onClick={() => navigate('/settings')}
            aria-label="Go back to settings"
          >
            <Icon name={IconNames.arrow_back} size="sm" />
          </Button>
        }
      />

      <div className="terms-content">


        <div className="terms-body">
        <section className="terms-section">
        <h2 className="terms-section-title">
          <Icon name={IconNames.info} size="md" />
          Guidewell Terms of Service & Disclaimer</h2>
          <p>
            Guidewell is an educational tool designed to help you explore financial concepts and visualize potential outcomes. It is not a financial advisor and does not provide financial, investment, tax, or legal advice. Any information, scenarios, or recommendations displayed within Guidewell are for illustrative purposes only and may not reflect your actual circumstances. Decisions about your finances should be made based on your own situation, and you may wish to consult a qualified professional before taking action.
          </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              <Icon name={IconNames.info} size="md" />
              Use of Information
            </h2>
            <p>
              By using Guidewell, you understand and agree that the information provided is general in nature and should not be relied upon as professional advice. Guidewell does not guarantee the accuracy, completeness, or applicability of any scenario presented.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              <Icon name={IconNames.security} size="md" />
              Security & Privacy
            </h2>
            <p>
              Guidewell takes reasonable steps to protect the information you provide. However, no system is completely secure, and you acknowledge that you share information at your own discretion. Data used within this prototype may not be encrypted or stored to production-level standards. Guidewell does not sell or share personal information with third parties.
            </p>
          </section>

          <section className="terms-section">
            <h2 className="terms-section-title">
              <Icon name={IconNames.verified_user} size="md" />
              User Responsibility
            </h2>
            <p>
              You are solely responsible for the financial decisions you make. Guidewell is intended as a tool to support learning and exploration, not as a substitute for professional guidance.
            </p>
          </section>

          
        </div>
      </div>
    </div>
  );
}
