'use client';
import { ReactNode } from 'react';

export default function AppHeader({
  title,
  subtitle,
  leftAction,
  rightAction,
}: { title: string; subtitle?: string; leftAction?: ReactNode; rightAction?: ReactNode }) {
  return (
    <header style={{ position:'sticky', top:0, zIndex:50, backdropFilter:'blur(6px)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap: '12px' }}>
          {leftAction && <div>{leftAction}</div>}
          <div>
            <div style={{ fontWeight:700, fontSize:18 }}>{title}</div>
            {subtitle && <div style={{ fontSize:14, opacity:0.75 }}>{subtitle}</div>}
          </div>
        </div>
        <div>{rightAction}</div>
      </div>
    </header>
  );
}

