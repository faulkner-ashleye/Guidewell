import React from 'react';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';

// Function to parse **text** into h4 tags
function parseNarrativeText(text: string) {
  // Split the text by **text** patterns and create JSX elements
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    // If the part matches **text** pattern, render as h4
    if (part.match(/^\*\*(.*?)\*\*$/)) {
      const content = part.replace(/\*\*/g, ''); // Remove the ** markers
      return <h4 key={index} className="narrative-heading" style={{ 
        margin: '16px 0 8px 0', 
        fontSize: '16px', 
        fontWeight: '600', 
        color: 'var(--color-text-primary)',
        lineHeight: '1.4'
      }}>{content}</h4>;
    }
    // Otherwise render as regular text
    return <span key={index}>{part}</span>;
  });
}

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
        {error && <span className="error-indicator"> ⚠️ Using fallback narrative</span>}
      </h3>
      
      <div className="narrative-content">
        {loading ? (
          <div className="narrative-loading">
            <div className="loading-spinner"></div>
          </div>
        ) : error ? (
          <div className="narrative-error">
            <p>{narrative}</p>
            <small className="error-message">{error}</small>
          </div>
        ) : (
          <div className="narrative-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {parseNarrativeText(narrative)}
          </div>
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




