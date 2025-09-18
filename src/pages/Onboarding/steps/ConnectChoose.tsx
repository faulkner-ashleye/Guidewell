import React, { useState } from 'react';
import { useAppState } from '../../../state/AppStateContext';
import DocUpload from '../../../components/DocUpload';
import ManualAccountForm from '../../../components/ManualAccountForm';

interface ConnectChooseProps {
  onClose: () => void;
  onComplete: () => void;
}

export function ConnectChoose({ onClose, onComplete }: ConnectChooseProps) {
  const [mode, setMode] = useState<'menu' | 'upload' | 'manual'>('menu');
  const { setAccounts, clearSampleData } = useAppState();

  const addLinked = (arr: any[]) => {
    // Clear sample data when user adds their own accounts
    clearSampleData();
    setAccounts(arr);
  };

  if (mode === 'menu') {
    return (
      <div className="connect-choose">
        <div className="connect-options">
          <button 
            className="connect-button secondary" 
            onClick={() => setMode('upload')}
          >
            Upload documents (photo/PDF)
          </button>
          
          <button 
            className="connect-button secondary" 
            onClick={() => setMode('manual')}
          >
            Enter manually
          </button>
        </div>
        
        <div className="connect-actions">
          <button className="action-button secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'upload') {
    return (
      <div className="connect-choose">
        <DocUpload onParsed={(arr) => { addLinked(arr); onComplete(); }} />
        <div className="connect-actions">
          <button className="action-button secondary" onClick={() => setMode('menu')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  if (mode === 'manual') {
    return (
      <div className="connect-choose">
        <ManualAccountForm onSave={(acc) => { addLinked([acc]); onComplete(); }} />
        <div className="connect-actions">
          <button className="action-button secondary" onClick={() => setMode('menu')}>
            Back
          </button>
        </div>
      </div>
    );
  }

  return null;
}
