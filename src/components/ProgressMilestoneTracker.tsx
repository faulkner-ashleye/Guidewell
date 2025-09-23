import React from 'react';
import { Card } from './Card';
import './ProgressMilestoneTracker.css';

interface ProgressMilestoneTrackerProps {
  currentStage: 'foundation' | 'growth' | 'wealth';
  className?: string;
}

export function ProgressMilestoneTracker({ currentStage, className }: ProgressMilestoneTrackerProps) {
  const stages = [
    { id: 'foundation', label: 'Foundation', icon: '🏗️', description: 'Build emergency fund & pay down debt' },
    { id: 'growth', label: 'Growth', icon: '📈', description: 'Invest for long-term goals' },
    { id: 'wealth', label: 'Wealth', icon: '💎', description: 'Preserve & grow wealth' }
  ];

  const getCurrentStageIndex = () => {
    return stages.findIndex(stage => stage.id === currentStage);
  };

  const currentIndex = getCurrentStageIndex();

  return (
    <Card className={`progress-milestone-tracker ${className || ''}`}>
      <div className="progress-header">
        <h3 className="progress-title">Your Financial Journey</h3>
        <p className="progress-subtitle">Track your progress through key financial milestones</p>
      </div>
      
      <div className="progress-stages">
        {stages.map((stage, index) => {
          const isActive = stage.id === currentStage;
          const isCompleted = index < currentIndex;
          const isUpcoming = index > currentIndex;
          
          return (
            <div 
              key={stage.id}
              className={`progress-stage ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isUpcoming ? 'upcoming' : ''}`}
            >
              <div className="stage-icon">
                {isCompleted ? '✅' : stage.icon}
              </div>
              <div className="stage-content">
                <h4 className="stage-label">{stage.label}</h4>
                <p className="stage-description">{stage.description}</p>
              </div>
              {isActive && (
                <div className="stage-indicator">
                  <div className="indicator-dot"></div>
                  <span className="indicator-text">Current Stage</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${((currentIndex + 1) / stages.length) * 100}%` }}
        ></div>
      </div>
    </Card>
  );
}
