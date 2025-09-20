'use client';
import { ReactNode } from 'react';

export default function AppHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
}: { title: string; subtitle?: string; leftAction?: ReactNode; rightAction?: ReactNode }) {
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
        <div>{rightAction}</div>
      </div>
    </header>
  );
}
