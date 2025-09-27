import React from 'react';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';

interface NarrativeCardProps {
  title: string;
  narrative: string;
  onViewBreakdown?: () => void;
  style?: React.CSSProperties;
  className?: string;
  loading?: boolean;
  error?: string | null;
}

export function NarrativeCard({ 
  title, 
  narrative, 
  onViewBreakdown, 
  style, 
  className,
  loading = false,
  error = null
}: NarrativeCardProps) {
  return (
    <div 
      className={`card ${className || ''}`}
      style={style}
    >
      <h3 className="narrative-title">
        {title}
        {loading && <span className="loading-indicator"> 🤖 Generating AI insights...</span>}
        {error && <span className="error-indicator"> ⚠️ Using fallback narrative</span>}
      </h3>
      
      <div className="narrative-content">
        {loading ? (
          <div className="narrative-loading">
            <div className="loading-spinner"></div>
            <p>I'm putting the pieces together so your options are easier to see…</p>
          </div>
        ) : error ? (
          <div className="narrative-error">
            <p>{narrative}</p>
            <small className="error-message">{error}</small>
          </div>
        ) : (
          <p>{narrative}</p>
        )}
      </div>
      
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
            Try new strategy
          </Button>
        )}
      </div>
    </div>
  );
}




