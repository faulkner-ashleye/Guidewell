'use client';
import Sheet from './Sheet';
import { Icon, IconNames } from '../../components/Icon';

type Props = {
  open: boolean;
  onClose: () => void;
  onAddGoal: () => void;
  onConnectAccount: () => void;
  onLogContribution: () => void;
  onUploadDocument: () => void;
};

function Row({ icon, title, desc, onClick }:{
  icon: string; title: string; desc: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card card-interactive card-visible"

    >
    <Icon name={icon} size="sm" />
      <div className="card-content">

        <strong className="typography-h6">{title}</strong>
         <span className="card-subtitle">{desc}</span>
      </div>

    </button>
  );
}

export default function QuickActionsSheet({
  open, onClose, onAddGoal, onConnectAccount, onLogContribution, onUploadDocument
}: Props) {
  console.log('QuickActionsSheet rendered with open:', open);
  console.log('QuickActionsSheet props:', { open, onClose: !!onClose, onAddGoal: !!onAddGoal, onConnectAccount: !!onConnectAccount, onLogContribution: !!onLogContribution, onUploadDocument: !!onUploadDocument });

  return (
    <Sheet open={open} onClose={onClose} title="Quick actions">
      <div className="menu-list">
        <Row icon={IconNames.add} title="Add goal"
             desc="Savings, debt payoff, or investing starter"
             onClick={() => { onClose(); onAddGoal(); }} />
        <Row icon={IconNames.account_balance_wallet} title="Connect account"
             desc="Link via Plaid"
             onClick={() => { onClose(); onConnectAccount(); }} />
        <Row icon={IconNames.file_upload} title="Upload document"
             desc="Add bank statements or receipts"
             onClick={() => { onClose(); onUploadDocument(); }} />
        <Row icon={IconNames.payment} title="Log contribution"
             desc="Record a manual deposit or payment"
             onClick={() => { onClose(); onLogContribution(); }} />
      </div>
      <div>
      </div>
    </Sheet>
  );
}
