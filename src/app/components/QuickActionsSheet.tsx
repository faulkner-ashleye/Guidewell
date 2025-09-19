'use client';
import Sheet from './Sheet';
import { Icon, IconNames } from '../../components/Icon';

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
      style={{
        width: '100%',
        textAlign: 'left',
        padding: '12px',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: 'transparent',
        cursor: 'pointer',
        display: 'grid',
        gap: '4px',
        transition: 'background-color 0.2s'
      }}
      onMouseEnter={(e) => (e.target as HTMLButtonElement).style.backgroundColor = '#f9fafb'}
      onMouseLeave={(e) => (e.target as HTMLButtonElement).style.backgroundColor = 'transparent'}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon name={icon} size="sm" className="icon-muted" />
        <strong>{title}</strong>
      </div>
      <span style={{ opacity: 0.75, fontSize: '12px' }}>{desc}</span>
    </button>
  );
}

export default function QuickActionsSheet({
  open, onClose, onAddGoal, onConnectAccount, onLogContribution
}: Props) {
  console.log('QuickActionsSheet rendered with open:', open);
  
  return (
    <Sheet open={open} onClose={onClose} title="Quick actions">
      <div style={{
        display: 'grid',
        gap: '8px',
        paddingTop: '4px',
        paddingBottom: '4px',
        paddingLeft: '4px',
        paddingRight: '4px'
      }}>
        <Row icon={IconNames.add} title="Add goal"
             desc="Savings, debt payoff, or investing starter"
             onClick={() => { onClose(); onAddGoal(); }} />
        <Row icon={IconNames.account_balance_wallet} title="Connect account"
             desc="Link via Plaid (or add another way)"
             onClick={() => { onClose(); onConnectAccount(); }} />
        <Row icon={IconNames.payment} title="Log contribution"
             desc="Record a manual deposit or payment"
             onClick={() => { onClose(); onLogContribution(); }} />
      </div>
      <div style={{
        marginTop: '4px',
        opacity: 0.7,
        fontSize: '12px',
        paddingLeft: '4px',
        paddingRight: '4px'
      }}>
        Educational scenarios only — not financial advice.
      </div>
    </Sheet>
  );
}
