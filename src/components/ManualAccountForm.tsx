import React, { useState } from 'react';

type Props = { onSave: (a: any) => void };

export default function ManualAccountForm({ onSave }: Props) {
  const [type, setType] = useState<'loan' | 'credit_card' | 'savings' | 'checking' | 'investment'>('loan');
  const [name, setName] = useState('');
  const [balance, setBalance] = useState<number>(0);
  const [apr, setApr] = useState<number | undefined>(undefined);

  return (
    <div>
      <select value={type} onChange={e => setType(e.target.value as any)}>
        <option value="loan">Loan</option>
        <option value="credit_card">Credit card</option>
        <option value="savings">Savings</option>
        <option value="checking">Checking</option>
        <option value="investment">Investment</option>
      </select>
      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="number" placeholder="Balance" value={balance} onChange={e => setBalance(Number(e.target.value))} />
      <input type="number" placeholder="APR (optional)" value={apr ?? ''} onChange={e => setApr(e.target.value ? Number(e.target.value) : undefined)} />
      <button onClick={() => onSave({ id: crypto.randomUUID(), type, name, balance, apr })}>Add account</button>
    </div>
  );
}











