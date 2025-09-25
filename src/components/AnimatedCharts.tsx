import React, { useState, useEffect } from 'react';
import './Charts.css';

interface ChartProps {
  title?: string;
  data?: number[];
  labels?: string[];
  className?: string;
}

// Hook for animated counter
const useAnimatedCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(target * easeOut));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [target, duration]);
  
  return count;
};

// Hook for progressive reveal
const useProgressiveReveal = (items: any[], delay: number = 100) => {
  const [visibleItems, setVisibleItems] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleItems(prev => Math.min(prev + 1, items.length));
    }, delay);
    
    return () => clearInterval(timer);
  }, [items.length, delay]);
  
  return items.slice(0, visibleItems);
};

export function AnimatedLineChart({ title, data = [], labels = [], className = '' }: ChartProps) {
  const maxValue = Math.max(...data, 1);
  const animatedData = useProgressiveReveal(data, 150);
  
  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="chart-placeholder">
        <div className="chart-bars">
          {animatedData.map((value, index) => (
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

export function AnimatedPieChart({ title, data = [], labels = [], className = '' }: ChartProps) {
  const total = data.reduce((sum, value) => sum + value, 0);
  const animatedData = useProgressiveReveal(data, 200);
  
  return (
    <div className={`chart-container ${className}`}>
      {title && <h3 className="chart-title">{title}</h3>}
      <div className="pie-chart-placeholder">
        <div className="pie-chart">
          {animatedData.map((value, index) => {
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

export function AnimatedProgressChart({ 
  value, 
  max, 
  label, 
  className = '',
  showCounter = true 
}: { 
  value: number; 
  max: number; 
  label: string; 
  className?: string;
  showCounter?: boolean;
}) {
  const percentage = Math.min((value / max) * 100, 100);
  const animatedValue = useAnimatedCounter(value, 1500);
  const animatedMax = useAnimatedCounter(max, 1500);
  
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
        {showCounter ? (
          <>
            {animatedValue.toLocaleString()} / {animatedMax.toLocaleString()}
            <span style={{ marginLeft: '8px', fontSize: '11px', opacity: 0.7 }}>
              ({Math.round(percentage)}%)
            </span>
          </>
        ) : (
          `${Math.round(percentage)}%`
        )}
      </div>
    </div>
  );
}

// Enhanced card component with entrance animations
export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  onClick 
}: { 
  children: React.ReactNode; 
  className?: string;
  delay?: number;
  onClick?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div 
      className={`card ${isVisible ? 'card-visible' : ''} ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </div>
  );
}

// Loading skeleton component
export function LoadingSkeleton({ 
  width = '100%', 
  height = '20px', 
  className = '' 
}: { 
  width?: string; 
  height?: string; 
  className?: string; 
}) {
  return (
    <div 
      className={`loading-skeleton ${className}`}
      style={{ width, height }}
    />
  );
}

// Success celebration component
export function SuccessCelebration({ 
  children, 
  trigger 
}: { 
  children: React.ReactNode; 
  trigger: boolean; 
}) {
  const [isCelebrating, setIsCelebrating] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      setIsCelebrating(true);
      const timer = setTimeout(() => setIsCelebrating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger]);
  
  return (
    <div className={isCelebrating ? 'goal-achieved' : ''}>
      {children}
    </div>
  );
}

// Export original components for backward compatibility
export { LineChart, PieChart, ProgressChart } from './Charts';

