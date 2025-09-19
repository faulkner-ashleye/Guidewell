import React, { useState } from 'react';
import PlaidLinkButton from '../../../components/PlaidLinkButton';
import Sheet from '../../../components/Sheet';
import { ConnectChoose } from './ConnectChoose';
import { useAppState } from '../../../state/AppStateContext';
import ServerTest from '../../../components/ServerTest';
import { Button, ButtonVariants, ButtonColors } from '../../../components/Button';
import '../../../components/Button.css';

export default function Connect({ onNext, onBack, onSkip }: { onNext: () => void; onBack: () => void; onSkip: () => void }) {
  const [open, setOpen] = useState(false);
  const { clearSampleData, setAccounts } = useAppState();
  
  
  return (
    <section>
      <h2>Let's connect your accounts</h2>
      <p>Connecting is optional. Guidewell provides educational scenarios, not financial advice.</p>
      
      <ServerTest />

      <PlaidLinkButton
        key="plaid-link-singleton"
        userId="demo-user-123"
        onSuccess={(linked) => {
          // Clear sample data when user adds their own accounts
          clearSampleData();
          setAccounts(linked);
          onNext();
        }}
      />

      {/* Add accounts another way button / sheet */}
      <Button 
        variant={ButtonVariants.outline}
        color={ButtonColors.secondary}
        onClick={() => setOpen(true)}
      >
        Add accounts another way
      </Button>
      
      <Button 
        variant={ButtonVariants.outline}
        color={ButtonColors.secondary}
        onClick={onSkip}
      >
        Skip
      </Button>
      
      <Sheet open={open} onClose={() => setOpen(false)} title="Upload documents or enter manually">
        <ConnectChoose 
          onClose={() => setOpen(false)} 
          onComplete={() => { 
            setOpen(false); 
            onNext(); 
          }} 
        />
      </Sheet>
    </section>
  );
}
