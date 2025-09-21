'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { Account, Goal, GoalType } from '../../types';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import Sheet from '../../components/Sheet';
import '../../../components/Button.css';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (goal: Goal) => void;
  accounts: Account[]; // pass from context
  preselectedAccountId?: string; // account to pre-select and lock
};

const NAME_MAX = 40;

export default function AddGoalModal({ open, onClose, onCreate, accounts, preselectedAccountId }: Props) {
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
        return accounts; // Savings goals can be assigned to any account
      case 'debt':      
      case 'debt_payoff':
        return accounts.filter(a => a.type === 'loan' || a.type === 'credit_card' || a.type === 'debt'); // Debt goals only for debt accounts
      case 'investing': 
      case 'investment':
      case 'retirement':
        return accounts; // Investing goals can be assigned to any account
      case 'custom':
        return accounts; // Custom goals can be assigned to any account
      default:
        return accounts; // Default to all accounts
    }
  }, [type, accounts]);

  // Get selected account for debt goals
  const selectedAccount = accountId ? accounts.find(a => a.id === accountId) : null;
  
  // Get selected accounts for multi-select
  const selectedAccounts = accountIds.map(id => accounts.find(a => a.id === id)).filter(Boolean) as Account[];
  
  // Calculate total debt for multi-select debt goals
  const totalDebtAmount = selectedAccounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Auto-populate account and goal type when preselected
  useEffect(() => {
    if (preselectedAccountId && !accountId) {
      setAccountId(preselectedAccountId);
      
      // Auto-select goal type based on account type
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
        // Single account selected - use its balance
        setTarget(selectedAccount.balance);
      } else if (selectedAccounts.length > 0) {
        // Multiple accounts selected - use total debt amount
        setTarget(totalDebtAmount);
      } else if (target !== '') {
        // No accounts selected - reset target
        setTarget('');
      }
    }
    // For savings/investing goals, don't auto-populate even if account is selected
    // User should manually enter their target amount
  }, [type, selectedAccount, selectedAccounts, totalDebtAmount]);

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
    // target date optional; monthly contribution optional
    return null;
  };

  const handleSave = () => {
    const err = validate();
    if (err) { setError(err); return; }

    const goal: Goal = {
      id: crypto.randomUUID(),
      name: name.trim(),
      type,
      accountId: accountId || undefined,
      accountIds: accountIds.length > 0 ? accountIds : undefined,
      target: typeof target === 'number' ? target : Number(target),
      targetDate: targetDate || undefined,
      monthlyContribution: monthlyContribution === '' ? undefined : Number(monthlyContribution),
      priority,
      note: note.trim() ? note.trim() : undefined,
      createdAt: new Date().toISOString(),
    };
    onCreate(goal);
    // reset + close
    setName(''); setType('savings'); setAccountId(undefined); setAccountIds([]); setTarget('');
    setTargetDate(undefined); setMonthlyContribution(''); setPriority(undefined); setNote(''); setError(null);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Add a Goal">
      <div className="modal-body">
          {!preselectedAccountId && (
            <div className="form-field">
              <label className="form-label">Goal type</label>
              <div className="form-row">
                <TypeChip 
                  label="Savings" 
                  active={type==='savings'} 
                  onClick={() => setType('savings')} 
                />
                <TypeChip 
                  label="Debt" 
                  active={type==='debt'} 
                  onClick={() => setType('debt')} 
                />
                <TypeChip 
                  label="Investing" 
                  active={type==='investing'} 
                  onClick={() => setType('investing')} 
                />
              </div>
              <small className="form-help">{headingByType[type]}</small>
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
            <small className="form-help">
              {preselectedAccountId 
                ? `Goal will be linked to ${selectedAccount?.name}` 
                : type === 'debt' && eligibleAccounts && eligibleAccounts.length > 1
                ? 'Select multiple accounts to create a combined payoff goal.'
                : 'Linking helps track progress automatically.'
              }
            </small>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">{type === 'debt' ? 'Current payoff amount' : 'Target amount'}</label>
              <input 
                className={`input ${type === 'debt' && (selectedAccount || selectedAccounts.length > 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
                type="number" 
                inputMode="decimal" 
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
          </div>

          <div className="form-field">
            <label className="form-label">Monthly contribution (optional)</label>
            <input 
              className="input" 
              type="number" 
              inputMode="decimal" 
              placeholder="200" 
              value={monthlyContribution}
              onChange={e=>setMonthlyContribution(e.target.value === '' ? '' : Number(e.target.value))}
            />
            <small className="form-help">You can leave this blank and explore scenarios later.</small>
          </div>

          <div className="form-row">
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
          </div>

          {error && <div className="form-error">{error}</div>}
          <div className="text-xs text-muted">
          </div>
        </div>

        <div className="modal-footer" style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e7eb'
        }}>
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
            Save goal
          </Button>
        </div>
    </Sheet>
  );
}

function TypeChip({ label, active, onClick }:{ label:string; active?:boolean; onClick:()=>void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '6px 10px',
        borderRadius: 999,
        border: `1px solid ${active ? '#7084FF' : '#3C3C3C'}`,
        background: active ? '#1C1C1C' : 'transparent',
        color: active ? '#FFFFFF' : '#B6B6B6',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

// Styles object removed - now using CSS classes from globals.css and components.css
