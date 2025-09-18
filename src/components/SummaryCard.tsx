import React from 'react';

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
      className={`card p-md grid gap-xs min-h-72 ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
    >
      <div className="text-muted text-xs">{title}</div>
      <div className="text-text text-xl font-semibold">{value}</div>
      {subline && <div className="text-muted text-xs">{subline}</div>}
      {children}
    </div>
  );
}