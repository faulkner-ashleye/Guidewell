import React from 'react';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder';

interface StrategyCardSelectProps {
  selected: Strategy;
  onSelect: (strategy: Strategy) => void;
}

interface SelectCardProps {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  icon: string;
}

function SelectCard({ title, description, selected, onClick, icon }: SelectCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '20px',
        border: selected ? '2px solid #3b82f6' : '2px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: selected ? '#eff6ff' : 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        width: '100%',
        minWidth: '200px'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#3b82f6';
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = '#e5e7eb';
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '12px' }}>
        {icon}
      </div>
      
      <h4 style={{ 
        margin: '0 0 8px 0', 
        fontSize: '16px', 
        fontWeight: '600',
        color: selected ? '#1d4ed8' : '#111827'
      }}>
        {title}
      </h4>
      
      <p style={{ 
        margin: '0', 
        fontSize: '14px', 
        color: '#6b7280',
        lineHeight: '1.5'
      }}>
        {description}
      </p>
    </button>
  );
}

export function StrategyCardSelect({ selected, onSelect }: StrategyCardSelectProps) {
  const strategies = [
    {
      id: 'debt_crusher' as Strategy,
      title: 'Debt Crusher',
      description: 'Aggressively pay down debt while maintaining minimal savings',
      icon: '💪'
    },
    {
      id: 'goal_keeper' as Strategy,
      title: 'Goal Keeper', 
      description: 'Balanced approach focusing on savings goals and debt management',
      icon: '🎯'
    },
    {
      id: 'nest_builder' as Strategy,
      title: 'Nest Builder',
      description: 'Long-term wealth building with emphasis on investments',
      icon: '🏗️'
    }
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {strategies.map(strategy => (
        <SelectCard
          key={strategy.id}
          title={strategy.title}
          description={strategy.description}
          selected={selected === strategy.id}
          onClick={() => onSelect(strategy.id)}
          icon={strategy.icon}
        />
      ))}
    </div>
  );
}



