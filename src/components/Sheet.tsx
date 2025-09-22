import React, { useEffect } from 'react';
import { Icon, IconNames } from './Icon';

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export default function Sheet({ open, onClose, title, children, className = '' }: SheetProps) {
  useEffect(() => {
    if (open) {
      document.body.classList.add('sheet-open');
    } else {
      document.body.classList.remove('sheet-open');
    }

    // Cleanup function to remove class when component unmounts
    return () => {
      document.body.classList.remove('sheet-open');
    };
  }, [open]);

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className={`sheet ${className}`}>
      <div className="sheet-header">
        <h3>{title}</h3>
        <button onClick={onClose} aria-label="Close" className="sheet-close">
          <Icon name={IconNames.close} size="md" />
        </button>
      </div>
      <div>{children}</div>
    </div>
  );
}
