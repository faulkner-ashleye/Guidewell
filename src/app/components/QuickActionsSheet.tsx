'use client';
import Sheet from './Sheet';

type Props = {
  open: boolean;
  onClose: () => void;
  onAddGoal: () => void;
  onConnectAccount: () => void;
  onLogContribution: () => void;
};

function Row({ icon, title, desc, onClick }:{
  icon: string; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      width:'100%', textAlign:'left', padding:'12px', border:'1px solid rgba(0,0,0,0.1)',
      borderRadius:12, background:'transparent', display:'grid', gap:2
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span aria-hidden style={{ fontSize:18 }}>{icon}</span>
        <strong>{title}</strong>
      </div>
      <span style={{ opacity:0.75, fontSize:13 }}>{desc}</span>
    </button>
  );
}

export default function QuickActionsSheet({
  open, onClose, onAddGoal, onConnectAccount, onLogContribution
}: Props) {
  return (
    <Sheet open={open} onClose={onClose} title="Quick actions">
      <div style={{ display:'grid', gap:10, padding:'8px 4px' }}>
        <Row icon="🎯" title="Add goal"
             desc="Savings, debt payoff, or investing starter"
             onClick={() => { onClose(); onAddGoal(); }} />
        <Row icon="🔗" title="Connect account"
             desc="Link via Plaid (or add another way)"
             onClick={() => { onClose(); onConnectAccount(); }} />
        <Row icon="💸" title="Log contribution"
             desc="Record a manual deposit or payment"
             onClick={() => { onClose(); onLogContribution(); }} />
      </div>
      <div style={{ marginTop:8, opacity:0.7, fontSize:12, padding:'0 4px' }}>
        Educational scenarios only — not financial advice.
      </div>
    </Sheet>
  );
}
