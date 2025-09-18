import React from 'react';

interface NarrativeCardProps {
  title: string;
  narrative: string;
  onViewBreakdown?: () => void;
  style?: React.CSSProperties;
}

export function NarrativeCard({ title, narrative, onViewBreakdown, style }: NarrativeCardProps) {
  return (
    <div 
      style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '24px',
        ...style
      }}
    >
      <h3 style={{
        margin: '0 0 16px 0',
        fontSize: '20px',
        fontWeight: '600',
        color: '#111827'
      }}>
        {title}
      </h3>
      
      <p style={{
        margin: '0 0 20px 0',
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#374151'
      }}>
        {narrative}
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #f3f4f6'
      }}>
        <div style={{
          fontSize: '12px',
          color: '#9ca3af',
          fontStyle: 'italic'
        }}>
          Educational scenario only — not financial advice.
        </div>
        
        {onViewBreakdown && (
          <button
            onClick={onViewBreakdown}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#3b82f6',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#3b82f6';
            }}
          >
            See full breakdown →
          </button>
        )}
      </div>
    </div>
  );
}



