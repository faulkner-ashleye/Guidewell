import React from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  target: number;
  current: number;
  goalType: 'debt' | 'savings' | 'investment' | 'emergency' | 'other';
  className?: string;
}

export function ProgressBar({ target, current, goalType, className = '' }: ProgressBarProps) {
  // For debt goals: target = original debt amount, current = remaining balance
  // For other goals: target = goal amount, current = amount saved/invested
  const achieved = goalType === 'debt' ? Math.max(0, target - current) : current;
  const remaining = goalType === 'debt' ? current : Math.max(0, target - current);

  // Calculate percentages
  const achievedPercent = target > 0 ? (achieved / target) * 100 : 0;
  const remainingPercent = target > 0 ? (remaining / target) * 100 : 0;

  // Handle edge case where no target is set
  if (target === 0) {
    return (
      <div className={`progress-bar ${className}`}>
      <div className="progress-bar-center">
        <div className="progress-percentage">0%</div>
        <div className="progress-label">No Goal Set</div>
      </div>
        <div className="progress-bar-container">
          <div className="progress-bar-track">
            <div className="progress-bar-fill empty" />
          </div>
        </div>

        <div className="progress-bar-legend">
          <div className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: 'var(--color-grey-400)' }} />
            <div className="legend-content">
              <div className="legend-label">No Target</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`progress-bar ${className}`}>
      {/* Center percentage */}
      <div className="progress-bar-center">
        <div className="progress-percentage">
          {Math.round(achievedPercent)}%
        </div>
        <div className="progress-label">
          {goalType === 'debt' ? 'paid off' : 'complete'}
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill achieved"
            style={{
              width: `${achievedPercent}%`,
              backgroundColor: 'var(--color-success-main)'
            }}
          />
          <div
            className="progress-bar-fill remaining"
            style={{
              width: `${remainingPercent}%`,
              backgroundColor: 'var(--color-error-main)'
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="progress-bar-legend">
        {achieved > 0 && (
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: 'var(--color-success-main)' }}
            />
            <div className="legend-content">
              <div className="legend-label">
                {goalType === 'debt' ? 'Paid off' : 'Saved'}
              </div>
            </div>
          </div>
        )}

        {/* Always show remaining amount (even if it's the full target) */}
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{ backgroundColor: 'var(--color-error-main)' }}
          />
          <div className="legend-content">
            <div className="legend-label">To go</div>
          </div>
        </div>
      </div>
    </div>
  );
}
