'use client';
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconNames } from '../../components/Icon';
import { Button, ButtonVariants } from '../../components/Button';

export default function AppHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
  showOpportunities = true,
}: { 
  title: string; 
  subtitle?: string; 
  leftAction?: ReactNode; 
  rightAction?: ReactNode;
  showOpportunities?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show opportunities button on the opportunities page itself
  const shouldShowOpportunities = showOpportunities && location.pathname !== '/opportunities';

  return (
    <header className="app-header">
      <div className="flex items-center justify-between p-sm">
        <div className="flex items-center gap-sm">
          {leftAction && <div>{leftAction}</div>}
          <div>
            <div className="typography-display2">{title}</div>
            {subtitle && <div className="typography-caption">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center gap-sm">
          {shouldShowOpportunities && (
            <Button
              variant={ButtonVariants.text}
              onClick={() => navigate('/opportunities')}
              aria-label="View opportunities and insights"
            >
              <Icon name={IconNames.lightbulb_outline} size="sm" />
            </Button>
          )}
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </header>
  );
}
