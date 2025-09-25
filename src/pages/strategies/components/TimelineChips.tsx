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
    >
      {label}
    </button>
  );
}

export function TimelineChips({ selected, onSelect }: TimelineChipsProps) {
  const timeframes = [
    { id: 'short' as Timeframe, label: 'Short (1–2 years)' },
    { id: 'mid' as Timeframe, label: 'Mid (3–5 years)' },
    { id: 'long' as Timeframe, label: 'Long (5+ years)' }
  ];

  return (
    <div className="flex gap-sm flex-wrap">
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
