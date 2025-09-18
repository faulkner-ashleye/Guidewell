'use client';
import { ReactNode } from 'react';

export default function Sheet({ open, onClose, title, children }:{
  open:boolean; onClose:()=>void; title?:string; children:ReactNode;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
         style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000 }}>
      <div onClick={(e)=>e.stopPropagation()}
           style={{ position:'fixed', left:0, right:0, bottom:0, borderTopLeftRadius:16, borderTopRightRadius:16,
                    background:'#fff', padding:12, maxHeight:'75vh', overflow:'auto' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 4px' }}>
          <div style={{ fontWeight:600 }}>{title}</div>
          <button aria-label="Close" onClick={onClose} style={{ background:'transparent', border:'none', fontSize:22 }}>×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
