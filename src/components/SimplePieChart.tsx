import React from 'react';
import { formatMoney } from '../state/planSelectors';
import './SimplePieChart.css';

interface SimplePieChartProps {
  target: number;
  current: number;
  goalType: 'debt' | 'savings' | 'investment' | 'emergency' | 'other';
  className?: string;
}

export function SimplePieChart({ target, current, goalType, className = '' }: SimplePieChartProps) {
  // For debt goals: target = original debt amount, current = remaining balance
  // For other goals: target = goal amount, current = amount saved/invested
  const achieved = goalType === 'debt' ? Math.max(0, target - current) : current;
  const remaining = goalType === 'debt' ? current : Math.max(0, target - current);

  // Calculate percentages
  const achievedPercent = target > 0 ? (achieved / target) * 100 : 0;
  const remainingPercent = target > 0 ? (remaining / target) * 100 : 0;

  // Use consistent colors for all goal types
  const getColors = () => {
    return {
      achieved: 'var(--color-success-main)', // Green for paid off/saved/invested
      remaining: 'var(--color-error-main)' // Red for remaining amounts
    };
  };

  const colors = getColors();

  // Handle edge case where no target is set
  if (target === 0) {
    return (
      <div className={`simple-pie-chart ${className}`}>
        <div className="pie-chart-container">
          <div className="pie-chart empty-chart">
            <div className="pie-slice" style={{ background: 'var(--color-grey-200)' }} />
          </div>

        </div>
        <div className="pie-center">
          <div className="percentage-text">0%</div>
          <div className="percentage-label">No Goal Set</div>
        </div>
        <div className="pie-legend">
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

  // Create a single conic gradient for the entire pie
  // Always show the full target amount, even if no progress has been made
  const gradientStops = [];

  if (achievedPercent > 0) {
    gradientStops.push(`${colors.achieved} 0deg ${achievedPercent * 3.6}deg`);
  }

  // Always show remaining amount (even if it's the full target)
  const startAngle = achievedPercent * 3.6;
  const endAngle = startAngle + (remainingPercent * 3.6);
  gradientStops.push(`${colors.remaining} ${startAngle}deg ${endAngle}deg`);

  const pieBackground = `conic-gradient(from 0deg, ${gradientStops.join(', ')})`;

  return (
    <div className={`simple-pie-chart ${className}`}>
      <div className="pie-chart-container">
        <div className="pie-chart">
          <div className="pie-slice" style={{ background: pieBackground }} />
        </div>
      </div>

      {/* Center percentage */}
      <div className="pie-center">
        <div className="percentage-text">
          {Math.round(achievedPercent)}%
        </div>
         <div className="percentage-label">
           {goalType === 'debt' ? 'paid off' : 'complete'}
         </div>
      </div>

      {/* Legend */}
      <div className="pie-legend">
        {achieved > 0 && (
          <div className="legend-item">
            <div
              className="legend-dot"
              style={{ backgroundColor: colors.achieved }}
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
            style={{ backgroundColor: colors.remaining }}
          />
          <div className="legend-content">
            <div className="legend-label">
             To go
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
