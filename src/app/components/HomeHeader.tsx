'use client';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, IconNames } from '../../components/Icon';
import { Button, ButtonVariants } from '../../components/Button';

interface HomeHeaderProps {
  greeting: string;
  subtitle: string;
  rightAction?: ReactNode;
  insightsCount?: number;
  showQuickActions?: boolean;
  onQuickActionsClick?: () => void;
}

export default function HomeHeader({
  greeting,
  subtitle,
  rightAction,
  insightsCount = 0,
  showQuickActions = true,
  onQuickActionsClick
}: HomeHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header shadow-sm">
      <div className="home-header-content">
        <div className="home-header-left">
          <div className="home-header-text">
            <div className="home-header-greeting">{greeting}</div>
            <p className="typography-subtitle2 home-header-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="home-header-actions">
          <Button
            variant={ButtonVariants.text}
            size="small"
            onClick={() => navigate('/settings')}
            aria-label="Settings"
          >
            <Icon name={IconNames.settings} size="md" />
          </Button>
          {showQuickActions && onQuickActionsClick && (
            <Button
              variant={ButtonVariants.text}
              size="small"
              onClick={onQuickActionsClick}
              aria-label="Quick actions"
            >
              <Icon name={IconNames.add} size="md" />
            </Button>
          )}
          {rightAction && (
            <div className="home-header-action">
              {rightAction}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
