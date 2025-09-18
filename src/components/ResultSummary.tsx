import React from 'react';

interface ResultSummaryProps {
  scope: string;
  strategy: string;
  timeframe: string;
  contribution?: number;
  allocation?: {
    debt: number;
    savings: number;
    investing: number;
  };
  onEditAnswers: () => void;
  onStartOver: () => void;
  onViewBreakdown: () => void;
}

export function ResultSummary({
  scope,
  strategy,
  timeframe,
  contribution,
  allocation,
  onEditAnswers,
  onStartOver,
  onViewBreakdown
}: ResultSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value}%`;
  };

  return (
    <div 
      style={{
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#f8fafc',
        marginTop: '24px'
      }}
    >
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '20px', 
        fontWeight: '600',
        color: '#111827'
      }}>
        Your Strategy Summary
      </h3>
      
      <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>Scope:</span>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{scope}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>Strategy:</span>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{strategy}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>Timeline:</span>
          <span style={{ fontWeight: '500', fontSize: '14px' }}>{timeframe}</span>
        </div>
        
        {contribution !== undefined && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#6b7280', fontSize: '14px' }}>Extra Contribution:</span>
            <span style={{ fontWeight: '500', fontSize: '14px' }}>{formatCurrency(contribution)}</span>
          </div>
        )}
        
        {allocation && (
          <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
            <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '14px' }}>
              Allocation:
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px' }}>Debt Payoff:</span>
              <span style={{ fontWeight: '500', fontSize: '14px' }}>{formatPercentage(allocation.debt)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px' }}>Savings:</span>
              <span style={{ fontWeight: '500', fontSize: '14px' }}>{formatPercentage(allocation.savings)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px' }}>Investing:</span>
              <span style={{ fontWeight: '500', fontSize: '14px' }}>{formatPercentage(allocation.investing)}</span>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <button
          onClick={onEditAnswers}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          Edit answers
        </button>
        
        <button
          onClick={onStartOver}
          style={{
            padding: '8px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: 'white',
            color: '#374151',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          Start over
        </button>
      </div>
      
      <button
        onClick={onViewBreakdown}
        style={{
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          backgroundColor: '#3b82f6',
          color: 'white',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
      >
        See full breakdown →
      </button>
    </div>
  );
}
