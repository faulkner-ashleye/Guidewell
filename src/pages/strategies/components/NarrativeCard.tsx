import React from 'react';

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
      className={`bg-white border border-gray-200 rounded-xl p-lg ${className || ''}`}
      style={style}
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
        </div>
        
        {onViewBreakdown && (
          <button
            onClick={onViewBreakdown}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#2563eb';
              e.currentTarget.style.borderColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#3b82f6';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            style={{
              background: '#3b82f6',
              border: '2px solid #3b82f6',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 16px',
              borderRadius: '6px',
              minWidth: '120px',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1000
            }}
          >
            See full breakdown →
          </button>
        )}
      </div>
    </div>
  );
}




