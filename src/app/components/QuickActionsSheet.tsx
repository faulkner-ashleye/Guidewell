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
    <button 
      onClick={onClick} 
      className="w-full text-left p-md border border-gray-200 rounded-xl bg-transparent hover:bg-gray-50 transition-colors grid gap-xs"
    >
      <div className="flex items-center gap-sm">
        <span aria-hidden className="text-lg">{icon}</span>
        <strong>{title}</strong>
      </div>
      <span className="opacity-75 text-xs">{desc}</span>
    </button>
  );
}

export default function QuickActionsSheet({
  open, onClose, onAddGoal, onConnectAccount, onLogContribution
}: Props) {
  return (
    <Sheet open={open} onClose={onClose} title="Quick actions">
      <div className="grid gap-sm py-xs px-xs">
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
      <div className="mt-xs opacity-70 text-xs px-xs">
        Educational scenarios only — not financial advice.
      </div>
    </Sheet>
  );
}
