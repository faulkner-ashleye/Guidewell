import React from 'react';
import { anchorAvatars, NarrativeAvatar } from '../../../data/narrativeAvatars';

type Strategy = 'debt_crusher' | 'goal_keeper' | 'nest_builder' | 'steady_payer' | 'juggler' | 'interest_minimizer' | 'safety_builder' | 'auto_pilot' | 'opportunistic_saver' | 'future_investor' | 'balanced_builder' | 'risk_taker';

interface StrategyCardSelectProps {
  selected: Strategy;
  onSelect: (strategy: Strategy) => void;
  accountTypes?: string[];
  focusCategory?: 'debt' | 'savings' | 'investment';
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
      className={`p-lg border-2 rounded-xl cursor-pointer transition-all text-left w-full min-w-50 ${
        selected 
          ? 'border-blue-600 bg-blue-50' 
          : 'border-gray-200 bg-white hover:border-blue-600 hover:bg-gray-50'
      }`}
    >
      <div className="text-2xl mb-sm">
        {icon}
      </div>
      
      <h4 className={`mb-xs text-base font-semibold ${
        selected ? 'text-blue-700' : 'text-gray-900'
      }`}>
        {title}
      </h4>
      
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>
    </button>
  );
}

export function StrategyCardSelect({ selected, onSelect, accountTypes = [], focusCategory }: StrategyCardSelectProps) {
  // Get appropriate avatars based on context
  const availableAvatars = focusCategory 
    ? anchorAvatars.filter(avatar => avatar.category === focusCategory)
    : anchorAvatars;

  const strategies = availableAvatars.map(avatar => ({
    id: avatar.id as Strategy,
    title: avatar.name,
    description: avatar.description,
    icon: avatar.emoji,
    narrative: avatar.narrative,
    balance: avatar.balance,
    allocation: avatar.allocation
  }));

  return (
    <div className="flex flex-col gap-md">
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




