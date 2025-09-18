'use client';
import { ReactNode } from 'react';

export default function AppHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
}: { title: string; subtitle?: string; leftAction?: ReactNode; rightAction?: ReactNode }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-sm">
      <div className="flex items-center justify-between p-sm">
        <div className="flex items-center gap-sm">
          {leftAction && <div>{leftAction}</div>}
          <div>
            <div className="font-bold text-lg">{title}</div>
            {subtitle && <div className="text-sm opacity-75">{subtitle}</div>}
          </div>
        </div>
        <div>{rightAction}</div>
      </div>
    </header>
  );
}

