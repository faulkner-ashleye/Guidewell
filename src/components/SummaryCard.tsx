import React from 'react';
import { COLORS } from '../ui/colors';

interface SummaryCardProps {
  title: string;
  value: string;
  subline?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export function SummaryCard({ title, value, subline, onClick, children }: SummaryCardProps) {
  return (
    <div 
      style={{
        background: COLORS.card, 
        border: `1px solid ${COLORS.border}`, 
        borderRadius: 12,
        padding: 12, 
        display: 'grid', 
        gap: 4, 
        minHeight: 72,
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{title}</div>
      <div style={{ color: COLORS.text, fontSize: 20, fontWeight: 600 }}>{value}</div>
      {subline && <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{subline}</div>}
      {children}
    </div>
  );
}