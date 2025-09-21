'use client';
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconNames } from '../../components/Icon';
import { Button, ButtonVariants } from '../../components/Button';

export default function AppHeader({
  title,
  leftAction,
  rightAction,
  showOpportunities = true,
}: {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  showOpportunities?: boolean;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show opportunities button on the opportunities page itself
  const shouldShowOpportunities = showOpportunities && location.pathname !== '/opportunities';

  return (
    <header className="app-header shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm grow">
          <div className="app-header-left-spacer">
            {leftAction ? leftAction : <div className="back-button-placeholder" />}
          </div>
          <div className="app-title-container">
            <div className="app-title">{title}</div>
          </div>
        </div>
        <div className="flex items-center gap-sm">
          {shouldShowOpportunities && (
            <Button
              className="insights-button"
              onClick={() => navigate('/opportunities')}
              aria-label="View opportunities and insights"
            >
              <Icon name={IconNames.lightbulb_outline} size="md" />
            </Button>
          )}
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </header>
  );
}
