'use client';
import { ReactNode } from 'react';

export default function Sheet({ open, onClose, title, children }:{
  open:boolean; onClose:()=>void; title?:string; children:ReactNode;
}) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" onClick={onClose}
         className="fixed inset-0 bg-black bg-opacity-40 z-50">
      <div onClick={(e)=>e.stopPropagation()}
           className="fixed left-0 right-0 bottom-0 rounded-t-2xl bg-white p-md max-h-75vh overflow-auto">
        <div className="flex justify-between items-center py-xs px-xs">
          <div className="font-semibold">{title}</div>
          <button aria-label="Close" onClick={onClose} className="bg-transparent border-none text-xl">×</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
