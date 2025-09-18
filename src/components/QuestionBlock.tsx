import React, { ReactNode } from 'react';

interface QuestionBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
  locked?: boolean;
  completed?: boolean;
}

export function QuestionBlock({ 
  title, 
  description, 
  children, 
  locked = false, 
  completed = false 
}: QuestionBlockProps) {
  return (
    <div 
      style={{
        padding: '24px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: locked ? '#f9fafb' : 'white',
        opacity: locked ? 0.7 : 1,
        position: 'relative'
      }}
    >
      {completed && (
        <div 
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            color: '#10b981',
            fontSize: '20px'
          }}
        >
          ✓
        </div>
      )}
      
      <h3 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '18px', 
        fontWeight: '600',
        color: locked ? '#6b7280' : '#111827'
      }}>
        {title}
      </h3>
      
      {description && (
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#6b7280', 
          fontSize: '14px' 
        }}>
          {description}
        </p>
      )}
      
      <div style={{ pointerEvents: locked ? 'none' : 'auto' }}>
        {children}
      </div>
    </div>
  );
}




