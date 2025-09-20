'use client';
import { ReactNode } from 'react';

export default function HomeHeader({
  greeting,
  subtitle,
  rightAction,
}: { greeting: string; subtitle: string; rightAction?: ReactNode }) {
  return (
    <header className="app-header">
      <div className="home-header-content">
        <div className="home-header-left">
          <div className="home-header-logo">
            <img src="/logo.svg" alt="Guidewell" className="logo-image" />
          </div>
          <div className="home-header-text">
            <h1 className="home-header-greeting">{greeting}</h1>
            <p className="home-header-subtitle">{subtitle}</p>
          </div>
        </div>
        {rightAction && (
          <div className="home-header-action">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  );
}
