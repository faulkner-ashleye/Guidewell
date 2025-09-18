'use client';
import { ReactNode } from 'react';

export default function Sheet({ open, onClose, title, children }:{
  open:boolean; onClose:()=>void; title?:string; children:ReactNode;
}) {
  console.log('Sheet rendered with open:', open, 'title:', title);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           right: 0,
           bottom: 0,
           backgroundColor: 'rgba(0, 0, 0, 0.4)',
           zIndex: 50
         }}>
      <div onClick={(e)=>e.stopPropagation()}
           style={{
             position: 'fixed',
             left: 0,
             right: 0,
             bottom: 0,
             borderTopLeftRadius: '16px',
             borderTopRightRadius: '16px',
             backgroundColor: 'white',
             padding: '16px',
             maxHeight: '75vh',
             overflow: 'auto'
           }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '4px',
          paddingBottom: '4px',
          paddingLeft: '4px',
          paddingRight: '4px'
        }}>
          <div style={{ fontWeight: '600' }}>{title}</div>
          <button aria-label="Close" onClick={onClose} 
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
