import React from 'react';
import { ThemeAwareSVG } from './ThemeAwareSVG';

interface AvatarIllustrationProps {
  avatarId: string;
  className?: string;
  fallbackEmoji?: string;
}

// Map avatar IDs to their corresponding SVG files
const avatarSvgMap: Record<string, string> = {
  'debt_crusher': '/images/persona_debtCrusher.svg',
  'goal_keeper': '/images/persona_goalKeeper.svg',
  'nest_builder': '/images/persona_nestBuilder.svg',
  'steady_payer': '/images/persona_steadyPayer.svg',
  'juggler': '/images/persona_juggler.svg',
  'interest_minimizer': '/images/persona_interestMInimizer.svg',
  'safety_builder': '/images/persona_safetyBuilder.svg',
  'auto_pilot': '/images/persona_autoPilot.svg',
  'opportunistic_saver': '/images/persona_opportunisticSaver.svg',
  'balanced_builder': '/images/persona_balancedBuilder.svg',
  'future_investor': '/images/persona_futureInvestor.svg',
  'risk_taker': '/images/persona_riskTaker.svg',
  'build_your_own': '/images/persona_buildYourOwn.svg'
};

export function AvatarIllustration({ avatarId, className = '', fallbackEmoji = '🎯' }: AvatarIllustrationProps) {
  const svgSrc = avatarSvgMap[avatarId];
  
  if (svgSrc) {
    return (
      <ThemeAwareSVG 
        src={svgSrc}
        className={`avatar-illustration ${className}`}
        alt={`${avatarId} illustration`}
      />
    );
  }
  
  // Fallback to emoji if no SVG is available
  return (
    <div className={`avatar-illustration-fallback ${className}`}>
      <div className="fallback-emoji">{fallbackEmoji}</div>
    </div>
  );
}
