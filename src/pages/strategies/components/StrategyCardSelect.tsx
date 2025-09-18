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




