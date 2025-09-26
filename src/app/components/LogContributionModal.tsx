'use client';
import { useState } from 'react';
import Sheet from './Sheet';
import { Input, Select } from '../../components/Inputs';
import { Button } from '../../components/Button';

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (contribution: any) => void;
  accounts: any[];
  goals: any[];
  preselectedGoalId?: string;
  preselectedAccountId?: string;
};

export default function LogContributionModal({
  open,
  onClose,
  onSave,
  accounts,
  goals,
  preselectedGoalId,
  preselectedAccountId
}: Props) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('deposit');
  const [accountId, setAccountId] = useState(preselectedAccountId || '');

  const handleClose = () => {
    setAmount('');
    setAccountId(preselectedAccountId || '');
    onClose();
  };

  const handleSave = () => {
    const contribution = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      accountId,
      date: new Date().toISOString(),
    };
    onSave(contribution);
    handleClose();
  };

  const accountOptions = [
    { value: '', label: 'Select account' },
    ...accounts.map(account => ({
      value: account.id,
      label: account.name
    }))
  ];

  const typeOptions = [
    { value: 'deposit', label: 'Deposit' },
    { value: 'payment', label: 'Payment' }
  ];

  return (
    <Sheet
      open={open}
      onClose={handleClose}
      title="Log Contribution"
      footer={
        <div className="form-actions">
          <Button
            variant="outline"
            onClick={handleClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!amount || !accountId}
            fullWidth
          >
            Save
          </Button>
        </div>
      }
    >
      <div className="form-fields">
        <Input
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />

        <Select
          label="Type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          options={typeOptions}
        />

        <Select
          label="Account"
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          options={accountOptions}
        />
      </div>
    </Sheet>
  );
}
