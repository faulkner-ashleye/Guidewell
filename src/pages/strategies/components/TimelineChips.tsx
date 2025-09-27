import React from 'react';
import { Chip } from '../../../components/ChipGroup';

type Timeframe = 'short' | 'mid' | 'long' | 'custom';

interface TimelineChipsProps {
  selected: Timeframe;
  onSelect: (timeframe: Timeframe) => void;
  showCustom?: boolean;
}

const TIMELINE_PRESETS = [
  { id: 'short' as Timeframe, label: 'Short (1–2 years)', months: 18 },
  { id: 'mid' as Timeframe, label: 'Mid (3–5 years)', months: 36 },
  { id: 'long' as Timeframe, label: 'Long (5+ years)', months: 60 },
  { id: 'custom' as Timeframe, label: 'Custom', months: 24 }
];

export function TimelineChips({ selected, onSelect, showCustom = true }: TimelineChipsProps) {
  const presets = showCustom ? TIMELINE_PRESETS : TIMELINE_PRESETS.slice(0, 3);

  const handleTimelineChange = (preset: typeof TIMELINE_PRESETS[0]) => {
    onSelect(preset.id);
  };

  return (
    <div className="timeline-chips">
      {presets.map(preset => (
        <Chip
          key={preset.id}
          label={preset.label}
          selected={selected === preset.id}
          onClick={() => handleTimelineChange(preset)}
        />
      ))}
    </div>
  );
}
