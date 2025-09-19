import React from 'react';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Sheet({ open, onClose, title, children }: SheetProps) {
  if (!open) return null;
  
  return (
    <div role="dialog" aria-modal="true">
      <div>
        <h3>{title}</h3>
        <button onClick={onClose} aria-label="Close">×</button>
      </div>
      <div>{children}</div>
    </div>
  );
}











