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
      className={`px-lg py-md border-2 rounded-full text-sm font-medium cursor-pointer transition-all ${
        selected 
          ? 'border-blue-600 bg-blue-600 text-white' 
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      }`}
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




