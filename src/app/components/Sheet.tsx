'use client';
import { ReactNode, useEffect } from 'react';

export default function Sheet({ open, onClose, title, children, footer }:{
  open:boolean; onClose:()=>void; title?:string; children:ReactNode; footer?:ReactNode;
}) {
  
  // Prevent body scrolling when sheet is open
  useEffect(() => {
    if (open) {
      document.body.classList.add('sheet-open');
      // Also add to phone content if it exists
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.add('sheet-open');
      }
    } else {
      document.body.classList.remove('sheet-open');
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('sheet-open');
      }
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('sheet-open');
      const phoneContent = document.querySelector('.phone-content');
      if (phoneContent) {
        phoneContent.classList.remove('sheet-open');
      }
    };
  }, [open]);
  
  if (!open) return null;
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e)=>e.stopPropagation()}>
        <div className="sheet-header">
          <div>{title}</div>
        </div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-footer">{footer}</div>}
      </div>
    </div>
  );
}
