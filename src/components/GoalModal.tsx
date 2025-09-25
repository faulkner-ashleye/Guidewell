import React, { useMemo, useState, useEffect } from 'react';
import { Account, Goal, GoalType } from '../app/types';
import { Button, ButtonVariants, ButtonColors } from './Button';
import { Chip } from './Chips';
import Sheet from '../app/components/Sheet';
import { Modal } from './Modal';
import './Button.css';

type GoalModalMode = 'add' | 'edit' | 'set';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate?: (goal: Goal) => void;
  onUpdate?: (goal: Goal) => void;
  accounts: Account[];
  preselectedAccountId?: string;
  existingGoal?: Goal; // For edit mode
  mode?: GoalModalMode; // Defaults to 'add'
  useSheet?: boolean; // Whether to use Sheet or Modal component
};

const NAME_MAX = 40;

export default function GoalModal({
  open,
  onClose,
  onCreate,
  onUpdate,
  accounts,
  preselectedAccountId,
  existingGoal,
  mode = 'add',
  useSheet = true
}: Props) {
  const [name, setName] = useState('');
  const [type, setType] = useState<GoalType>('savings');
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [accountIds, setAccountIds] = useState<string[]>([]);
  const [target, setTarget] = useState<number | ''>('');
  const [targetDate, setTargetDate] = useState<string | undefined>(undefined);
  const [monthlyContribution, setMonthlyContribution] = useState<number | ''>('');
  const [priority, setPriority] = useState<'low'|'medium'|'high'|undefined>(undefined);
  const [note, setNote] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Eligible accounts by type
  const eligibleAccounts = useMemo(() => {
    switch (type) {
      case 'savings':
      case 'emergency_fund':
        return accounts;
      case 'debt':
      case 'debt_payoff':
        return accounts.filter(a => a.type === 'loan' || a.type === 'credit_card' || a.type === 'debt');
      case 'investing':
      case 'investment':
      case 'retirement':
        return accounts;
      case 'custom':
        return accounts;
      default:
        return accounts;
    }
  }, [type, accounts]);

  // Get selected account for debt goals
  const selectedAccount = accountId ? accounts.find(a => a.id === accountId) : null;

  // Get selected accounts for multi-select
  const selectedAccounts = accountIds.map(id => accounts.find(a => a.id === id)).filter(Boolean) as Account[];

  // Calculate total debt for multi-select debt goals
  const totalDebtAmount = selectedAccounts.reduce((sum, account) => sum + account.balance, 0);

  // Initialize form with existing goal data for edit mode
  useEffect(() => {
    if (existingGoal && mode === 'edit') {
      setName(existingGoal.name || '');
      setType(existingGoal.type || 'savings');
      setAccountId(existingGoal.accountId);
      setAccountIds(existingGoal.accountIds || []);
      setTarget(existingGoal.target || '');
      setTargetDate(existingGoal.targetDate || undefined);
      setMonthlyContribution(existingGoal.monthlyContribution || '');
      setPriority(existingGoal.priority);
      setNote(existingGoal.note || '');
    }
  }, [existingGoal, mode]);

  // Auto-populate account and goal type when preselected
  useEffect(() => {
    if (preselectedAccountId && !accountId) {
      setAccountId(preselectedAccountId);

      const preselectedAccount = accounts.find(a => a.id === preselectedAccountId);
      if (preselectedAccount) {
        switch (preselectedAccount.type) {
          case 'checking':
          case 'savings':
            setType('savings');
            break;
          case 'credit_card':
          case 'loan':
            setType('debt');
            break;
          case 'investment':
            setType('investing');
            break;
        }
      }
    }
  }, [preselectedAccountId, accountId, accounts]);

  // Toggle account selection for multi-select
  const toggleAccountSelection = (accountId: string) => {
    setAccountIds(prev => {
      if (prev.includes(accountId)) {
        return prev.filter(id => id !== accountId);
      } else {
        return [...prev, accountId];
      }
    });
  };

  // Auto-populate target for debt goals when account(s) are selected
  useEffect(() => {
    if (type === 'debt') {
      if (selectedAccount) {
        setTarget(selectedAccount.balance);
      } else if (selectedAccounts.length > 0) {
        setTarget(totalDebtAmount);
      } else if (target !== '') {
        setTarget('');
      }
    }
  }, [type, selectedAccount, selectedAccounts, totalDebtAmount]);

  // Reset form when modal is closed
  useEffect(() => {
    if (!open) {
      setName('');
      setType('savings');
      setAccountId(undefined);
      setAccountIds([]);
      setTarget('');
      setTargetDate(undefined);
      setMonthlyContribution('');
      setPriority(undefined);
      setNote('');
      setError(null);
    }
  }, [open]);

  if (!open) return null;

  const headingByType: Record<GoalType, string> = {
    savings: 'Savings goal',
    debt: 'Debt payoff goal',
    investing: 'Investing starter goal',
    debt_payoff: 'Debt payoff goal',
    emergency_fund: 'Emergency fund goal',
    retirement: 'Retirement goal',
    investment: 'Investment goal',
    custom: 'Custom goal',
  };

  const validate = () => {
    if (!name.trim()) return 'Please enter a goal name.';
    if (name.length > NAME_MAX) return `Goal name must be ≤ ${NAME_MAX} characters.`;
    if (!type) return 'Please choose a goal type.';
    if (target === '' || (typeof target === 'number' && target <= 0)) {
      if (type === 'debt') {
        if (selectedAccount || selectedAccounts.length > 0) {
          return 'Please select debt account(s) to automatically set the payoff amount.';
        }
        return 'Enter your current payoff amount (estimated).';
      }
      return 'Enter a positive target amount.';
    }
    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); return; }

    const goal: Goal = {
      id: existingGoal?.id || crypto.randomUUID(),
      name: name.trim(),
      type,
      accountId: accountId || undefined,
      accountIds: accountIds.length > 0 ? accountIds : undefined,
      target: typeof target === 'number' ? target : Number(target),
      targetDate: targetDate || undefined,
      monthlyContribution: monthlyContribution === '' ? undefined : Number(monthlyContribution),
      priority,
      note: note.trim() ? note.trim() : undefined,
      createdAt: existingGoal?.createdAt || new Date().toISOString(),
    };

    if (mode === 'edit' && onUpdate) {
      onUpdate(goal);
    } else if (onCreate) {
      onCreate(goal);
    }

    onClose();
  };

  const getTitle = () => {
    switch (mode) {
      case 'edit':
        return 'Edit Goal';
      case 'set':
        return 'Set Goal';
      default:
        return 'Add a Goal';
    }
  };

  const getSaveButtonText = () => {
    switch (mode) {
      case 'edit':
        return 'Update Goal';
      case 'set':
        return 'Set Goal';
      default:
        return 'Save Goal';
    }
  };

  const modalContent = (
    <div>
      {!preselectedAccountId && (
        <div className="form-field">
          <label className="form-label">Goal type</label>
          <div className="form-row">
            <Chip
              label="Savings"
              selected={type==='savings'}
              onClick={() => setType('savings')}
            />
            <Chip
              label="Debt"
              selected={type==='debt'}
              onClick={() => setType('debt')}
            />
            <Chip
              label="Investing"
              selected={type==='investing'}
              onClick={() => setType('investing')}
            />
          </div>
        </div>
      )}

      {preselectedAccountId && (
        <div className="form-field">
          <label className="form-label">Goal type</label>
          <div className="card-compact text-base font-medium">
            {headingByType[type]} for {selectedAccount?.name}
          </div>
          <small className="form-help">
            Automatically determined by account type
          </small>
        </div>
      )}

      <div className="form-field">
        <label className="form-label">Goal name</label>
        <input
          className="input"
          placeholder="e.g., Wedding Fund"
          value={name}
          onChange={e=>setName(e.target.value)}
          maxLength={NAME_MAX}
        />
      </div>

      <div className="form-field">
        <label className="form-label">Linked account(s) (optional)</label>
        {preselectedAccountId ? (
          <div className="card-compact text-base font-medium">
            {selectedAccount?.name}
          </div>
        ) : type === 'debt' && eligibleAccounts && eligibleAccounts.length > 1 ? (
          <div className="space-y-2">
            <div className="text-sm text-muted mb-2">
              Select all accounts you want to include in this payoff goal:
            </div>
            {eligibleAccounts?.map(account => (
              <label key={account.id} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accountIds.includes(account.id)}
                  onChange={() => toggleAccountSelection(account.id)}
                  className="rounded"
                />
                <span className="text-sm">
                  {account.name} (${account.balance.toLocaleString()})
                </span>
              </label>
            ))}
            {selectedAccounts.length > 0 && (
              <div className="text-sm text-muted mt-2">
                Total debt: ${totalDebtAmount.toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <select
            className="select"
            value={accountId || ''}
            onChange={e=>setAccountId(e.target.value || undefined)}
          >
            <option value="">Not linked yet</option>
            {eligibleAccounts?.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">{type === 'debt' ? 'Current payoff amount' : 'Target amount'}</label>
        <input
          className={`input ${type === 'debt' && (selectedAccount || selectedAccounts.length > 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
          type="text"
          placeholder="15000"
          value={target}
          onChange={e=>setTarget(e.target.value === '' ? '' : Number(e.target.value))}
          readOnly={type === 'debt' && (!!selectedAccount || selectedAccounts.length > 0)}
        />
        {type === 'debt' && selectedAccount && (
          <small className="form-help">
            Automatically set to {selectedAccount.name} balance
          </small>
        )}
        {type === 'debt' && selectedAccounts.length > 0 && (
          <small className="form-help">
            Automatically set to total debt amount (${totalDebtAmount.toLocaleString()})
          </small>
        )}
        {type !== 'debt' && selectedAccount && (
          <small className="form-help">
            Enter your target amount for {selectedAccount.name}
          </small>
        )}
      </div>

      <div className="form-field">
        <label className="form-label">Target date (optional)</label>
        <input
          className="input"
          type="date"
          value={targetDate || ''}
          onChange={e=>setTargetDate(e.target.value || undefined)}
        />
      </div>


      <div className="form-field">
        <label className="form-label">Priority (optional)</label>
        <select
          className="select"
          value={priority || ''}
          onChange={e => setPriority((e.target.value || undefined) as any)}
        >
          <option value="">None</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="form-field">
        <label className="form-label">Motivation note (optional)</label>
        <input
          className="input"
          placeholder="Why this matters to you"
          value={note}
          onChange={e=>setNote(e.target.value)}
        />
      </div>

      {error && <div className="form-error">{error}</div>}
    </div>
  );

  if (useSheet) {
    return (
      <Sheet
        open={open}
        onClose={onClose}
        title={getTitle()}
        footer={
          <div>
            <Button
              variant={ButtonVariants.outline}
              color={ButtonColors.secondary}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant={ButtonVariants.contained}
              color={ButtonColors.secondary}
              onClick={handleSave}
            >
              {getSaveButtonText()}
            </Button>
          </div>
        }
      >
        {modalContent}
      </Sheet>
    );
  }

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={getTitle()}
      size="large"
      footer={
        <>
          <Button
            variant={ButtonVariants.outline}
            color={ButtonColors.secondary}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant={ButtonVariants.contained}
            color={ButtonColors.secondary}
            onClick={handleSave}
          >
            {getSaveButtonText()}
          </Button>
        </>
      }
    >
      {modalContent}
    </Modal>
  );
}
