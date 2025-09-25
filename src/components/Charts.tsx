import React from 'react';
import './Charts.css';
import '../styles/card-animations.css';

interface ChartProps {
  title?: string;
  data?: number[];
  labels?: string[];
  className?: string;
}

export function LineChart({ title, data = [], labels = [], className = '' }: ChartProps) {
  // Placeholder chart component - in a real app, you'd use a charting library like Chart.js or Recharts
  const maxValue = Math.max(...data, 1);
  
  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-placeholder">
        <div className="chart-bars">
          {data.map((value, index) => (
            <div
              key={index}
              className="chart-bar"
              style={{ height: `${(value / maxValue) * 100}%` } as React.CSSProperties}
            />
          ))}
        </div>
        <div className="chart-labels">
          {labels.map((label, index) => (
            <span key={index} className="chart-label">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PieChart({ title, data = [], labels = [], className = '' }: ChartProps) {
  // Placeholder pie chart component
  const total = data.reduce((sum, value) => sum + value, 0);
  
  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="pie-chart-placeholder">
        <div className="pie-chart">
          {data.map((value, index) => {
            const percentage = (value / total) * 100;
            return (
              <div
                key={index}
                className="pie-slice"
                style={{
                  transform: `rotate(${index * 90}deg)`,
                  background: `conic-gradient(from 0deg, var(--color-${index % 4}) ${percentage}%, transparent ${percentage}%)`
                }}
              />
            );
          })}
        </div>
        <div className="pie-legend">
          {labels.map((label, index) => (
            <div key={index} className="legend-item">
              <div className={`legend-color color-${index % 4}`} />
              <span className="legend-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgressChart({ value, max, label, className = '' }: { value: number; max: number; label: string; className?: string }) {
  const percentage = Math.min((value / max) * 100, 100);
  
  return (
    <div className={`progress-chart ${className}`}>
      <div className="progress-label">{label}</div>
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${percentage}%` } as React.CSSProperties}
        />
      </div>
      <div className="progress-text">
        {value.toLocaleString()} / {max.toLocaleString()}
      </div>
    </div>
  );
}