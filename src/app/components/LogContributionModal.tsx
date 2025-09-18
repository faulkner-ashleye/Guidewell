'use client';
import { useState } from 'react';

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
  const [goalId, setGoalId] = useState(preselectedGoalId || '');

  const handleClose = () => {
    setAmount('');
    setAccountId(preselectedAccountId || '');
    setGoalId(preselectedGoalId || '');
    onClose();
  };

  const handleSave = () => {
    const contribution = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      accountId,
      goalId,
      date: new Date().toISOString(),
    };
    onSave(contribution);
    handleClose();
  };

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" onClick={handleClose}
         style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)', zIndex:1000 }}>
      <div onClick={(e)=>e.stopPropagation()}
           style={{ position:'fixed', left:'50%', top:'50%', transform:'translate(-50%, -50%)',
                    background:'#fff', padding:20, borderRadius:12, minWidth:300 }}>
        <h3 style={{ margin:'0 0 16px 0' }}>Log Contribution</h3>
        
        <div style={{ display:'grid', gap:12 }}>
          <div>
            <label style={{ display:'block', marginBottom:4, fontSize:14 }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{ width:'100%', padding:'8px', border:'1px solid #ccc', borderRadius:6 }}
            />
          </div>
          
          <div>
            <label style={{ display:'block', marginBottom:4, fontSize:14 }}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={{ width:'100%', padding:'8px', border:'1px solid #ccc', borderRadius:6 }}
            >
              <option value="deposit">Deposit</option>
              <option value="payment">Payment</option>
            </select>
          </div>
          
          <div>
            <label style={{ display:'block', marginBottom:4, fontSize:14 }}>Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              style={{ width:'100%', padding:'8px', border:'1px solid #ccc', borderRadius:6 }}
            >
              <option value="">Select account</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>{account.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label style={{ display:'block', marginBottom:4, fontSize:14 }}>Goal (optional)</label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              style={{ width:'100%', padding:'8px', border:'1px solid #ccc', borderRadius:6 }}
            >
              <option value="">No goal</option>
              {goals.map(goal => (
                <option key={goal.id} value={goal.id}>{goal.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div style={{ display:'flex', gap:8, marginTop:16 }}>
          <button
            onClick={handleClose}
            style={{ flex:1, padding:'8px', border:'1px solid #ccc', background:'transparent', borderRadius:6 }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!amount || !accountId}
            style={{ flex:1, padding:'8px', border:'none', background:'#3b82f6', color:'white', borderRadius:6 }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
