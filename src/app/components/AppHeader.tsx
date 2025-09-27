'use client';
import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, IconNames } from '../../components/Icon';
import { Button, ButtonVariants } from '../../components/Button';

export default function AppHeader({
  title,
  leftAction,
  rightAction,
  showSettings = true,
  showQuickActions = true,
  onQuickActionsClick,
}: {
  title: string;
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  showSettings?: boolean;
  showQuickActions?: boolean;
  onQuickActionsClick?: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show settings button on the settings page itself
  const shouldShowSettings = showSettings && location.pathname !== '/settings';

  return (
    <header className="app-header shadow-sm">
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
          {shouldShowSettings && (
            <Button
            variant={ButtonVariants.text}
              size="small"
              onClick={() => navigate('/settings')}
              aria-label="Settings"
            >
              <Icon name={IconNames.settings} size="sm" />
            </Button>
          )}
          {showQuickActions && onQuickActionsClick && (
            <Button
              variant={ButtonVariants.text}
              size="small"
              onClick={onQuickActionsClick}
              aria-label="Quick actions"
            >
              <Icon name={IconNames.add} size="sm" />
            </Button>
          )}
          {rightAction && <div>{rightAction}</div>}
        </div>
      </div>
    </header>
  );
}
