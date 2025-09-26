import React from 'react';
import { OnboardingState } from '../../../data/onboardingTypes';
import { onboardingCopy } from '../copy';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import { OnboardingHeader } from '../components/OnboardingHeader';
import '../../../components/Button.css';

interface WelcomeProps {
  data: OnboardingState;
  update: <K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function Welcome({ data, update, onNext, onSkip }: WelcomeProps) {
  return (
    <div className="welcome-screen">
      {/* Background decorative figure */}
      <div className="welcome-background-figure">
      <svg width="393" height="528" viewBox="0 0 393 528" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.25">
      <g filter="url(#filter0_i_213_1270)">
      <path d="M125.373 744.094C67.9687 788.949 -14.9285 778.775 -59.7833 721.371C-104.638 663.967 -94.4646 581.069 -37.0604 536.215L215.226 339.082C272.63 294.228 355.527 304.401 400.382 361.805C445.237 419.21 435.063 502.107 377.659 546.962L125.373 744.094Z" fill="#007A2F"/>
      </g>
      <g filter="url(#filter1_i_213_1270)">
      <path d="M2.6583 266.373C-42.1964 208.969 -32.023 126.072 25.3812 81.2169C82.7855 36.3621 165.683 46.5355 210.538 103.94L407.67 356.226C452.524 413.63 442.351 496.527 384.947 541.382C327.543 586.237 244.645 576.063 199.79 518.659L2.6583 266.373Z" fill="#007A2F"/>
      </g>
      </g>
      <defs>
      <filter id="filter0_i_213_1270" x="-87.757" y="311.108" width="516.113" height="460.959" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="31.2208" dy="31.2208"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_213_1270"/>
      </filter>
      <filter id="filter1_i_213_1270" x="-25.3155" y="53.2432" width="460.959" height="516.112" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset dx="31.2208" dy="-31.2208"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0"/>
      <feBlend mode="normal" in2="shape" result="effect1_innerShadow_213_1270"/>
      </filter>
      </defs>
      </svg>

      </div>

      {/* Main content */}
      <div className="welcome-content">
        {/* Logo */}
        <div className="welcome-logo">
          <img
            src="/guidewell-logo_light.svg"
            alt="Guidewell"
            className="logo-image light-logo"
          />
          <img
            src="/guidewell-logo_dark.png"
            alt="Guidewell"
            className="logo-image dark-logo"
          />
        </div>

        {/* Tagline */}
        <div className="welcome-tagline">
          <h2>Making money make sense</h2>
        </div>
      </div>

      {/* Button at bottom */}
      <div className="onboarding-actions">
        <div className="action-buttons single-button">
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            fullWidth={true}
            onClick={onNext}
          >
            Get started
          </Button>
        </div>
      </div>
    </div>
  );
}
