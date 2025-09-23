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
}

export default function HomeHeader({
  greeting,
  subtitle,
  rightAction,
  insightsCount = 0
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
          <div className="insights-button-container">
            <Button
            variant={ButtonVariants.text}
              className="insights-button"
              onClick={() => navigate('/opportunities')}
              aria-label="View opportunities and insights"
            >
              <Icon name={IconNames.lightbulb_outline} size="md" />
            </Button>
            {insightsCount > 0 && (
              <span className="insights-badge">
                {insightsCount > 99 ? '99+' : insightsCount}
              </span>
            )}
          </div>
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
