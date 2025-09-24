import React from 'react';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';

interface NarrativeCardProps {
  title: string;
  narrative: string;
  onViewBreakdown?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function NarrativeCard({ title, narrative, onViewBreakdown, style, className }: NarrativeCardProps) {
  return (
    <div 
      className={`card ${className || ''}`}
      style={style}
    >
      <h3 className="narrative-title">
        {title}
      </h3>
      
      <p className="narrative-content">
        {narrative}
      </p>
      
      <div className="narrative-footer">
        <div className="narrative-meta">
        </div>
        
        {onViewBreakdown && (
          <Button
            onClick={onViewBreakdown}
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            fullWidth
          >
            See full breakdown →
          </Button>
        )}
      </div>
    </div>
  );
}




