'use client';
export default function QuickActionsButton({ onClick }:{ onClick:()=>void }) {
  return (
    <button aria-label="Quick actions" onClick={onClick} style={{
      display:'inline-flex', alignItems:'center', gap:6, padding:'8px 10px',
      borderRadius:8, border:'1px solid rgba(0,0,0,0.15)', background:'transparent'
    }}>
      <span style={{ fontSize:18, lineHeight:1 }}>＋</span>
      <span>Quick actions</span>
    </button>
  );
}
