import React from 'react';

type Timeframe = 'short' | 'mid' | 'long';

interface TimelineChipsProps {
  selected: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
}

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 20px',
        border: selected ? '2px solid #3b82f6' : '2px solid #d1d5db',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        backgroundColor: selected ? '#3b82f6' : 'white',
        color: selected ? 'white' : '#374151'
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.backgroundColor = 'white';
        }
      }}
    >
      {label}
    </button>
  );
}

export function TimelineChips({ selected, onSelect }: TimelineChipsProps) {
  const timeframes = [
    { id: 'short' as Timeframe, label: 'Short (3-12 mo)' },
    { id: 'mid' as Timeframe, label: 'Mid (1-5 yr)' },
    { id: 'long' as Timeframe, label: 'Long (5+ yr)' }
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {timeframes.map(timeframe => (
        <Chip
          key={timeframe.id}
          label={timeframe.label}
          selected={selected === timeframe.id}
          onClick={() => onSelect(timeframe.id)}
        />
      ))}
    </div>
  );
}

