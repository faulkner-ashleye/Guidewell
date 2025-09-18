import React from 'react';

interface ChartPlaceholderProps {
  data?: any;
  style?: React.CSSProperties;
}

export function ChartPlaceholder({ data, style }: ChartPlaceholderProps) {
  return (
    <div 
      style={{
        height: '220px',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%),
          linear-gradient(-45deg, transparent 40%, rgba(0,0,0,0.02) 50%, transparent 60%)
        `,
        backgroundSize: '20px 20px'
      }} />
      
      {/* Chart placeholder content */}
      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: '#f3f4f6',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '32px',
          color: '#9ca3af'
        }}>
          📊
        </div>
        
        <h3 style={{
          margin: '0 0 8px 0',
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827'
        }}>
          Scenario Trajectory
        </h3>
        
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#6b7280',
          maxWidth: '300px'
        }}>
          Chart visualization will show projected growth and timeline based on your strategy parameters.
        </p>
        
        {data && (
          <div style={{
            marginTop: '12px',
            padding: '8px 16px',
            background: '#f8fafc',
            borderRadius: '6px',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            Strategy: {data.strategy} • Timeline: {data.timeframe}
            {data.extra && ` • Extra: $${data.extra.toLocaleString()}`}
          </div>
        )}
      </div>
    </div>
  );
}




