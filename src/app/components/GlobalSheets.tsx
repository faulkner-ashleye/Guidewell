'use client';
import React from 'react';
import { useAppState } from '../../state/AppStateContext';
import Sheet from './Sheet';
import GoalModal from '../../components/GoalModal';
import LogContributionModal from './LogContributionModal';
import UploadDocumentModal from './UploadDocumentModal';
import QuickActionsSheet from './QuickActionsSheet';
import PlaidLinkButton from '../../components/PlaidLinkButton';

export default function GlobalSheets() {
  const { 
    accounts = [], 
    goals = [], 
    setAccounts, 
    clearSampleData, 
    userProfile 
  } = useAppState();

  // Global state for all sheets/modals
  const [globalSheets, setGlobalSheets] = React.useState({
    goalModal: { open: false, mode: 'add' as 'add' | 'edit' | 'set', preselectedAccountId: undefined as string | undefined },
    logContribution: { open: false },
    uploadDocument: { open: false },
    plaidDirect: { open: false },
    quickActions: { open: false }
  });

  // Global functions to open sheets
  const openGoalModal = (mode: 'add' | 'edit' | 'set' = 'add', preselectedAccountId?: string) => {
    setGlobalSheets(prev => ({
      ...prev,
      goalModal: { open: true, mode, preselectedAccountId }
    }));
  };

  const openLogContribution = () => {
    setGlobalSheets(prev => ({
      ...prev,
      logContribution: { open: true }
    }));
  };

  const openUploadDocument = () => {
    setGlobalSheets(prev => ({
      ...prev,
      uploadDocument: { open: true }
    }));
  };

  const openPlaidDirect = () => {
    setGlobalSheets(prev => ({
      ...prev,
      plaidDirect: { open: true }
    }));
  };

  const openQuickActions = () => {
    console.log('openQuickActions called');
    setGlobalSheets(prev => ({
      ...prev,
      quickActions: { open: true }
    }));
  };

  // Close functions
  const closeGoalModal = () => {
    setGlobalSheets(prev => ({
      ...prev,
      goalModal: { open: false, mode: 'add' as 'add' | 'edit' | 'set', preselectedAccountId: undefined }
    }));
  };

  const closeLogContribution = () => {
    setGlobalSheets(prev => ({
      ...prev,
      logContribution: { open: false }
    }));
  };

  const closeUploadDocument = () => {
    setGlobalSheets(prev => ({
      ...prev,
      uploadDocument: { open: false }
    }));
  };

  const closePlaidDirect = () => {
    setGlobalSheets(prev => ({
      ...prev,
      plaidDirect: { open: false }
    }));
  };

  const closeQuickActions = () => {
    setGlobalSheets(prev => ({
      ...prev,
      quickActions: { open: false }
    }));
  };

  // Expose functions globally (you can use a context or global state manager for this)
  React.useEffect(() => {
    (window as any).globalSheets = {
      openGoalModal,
      openLogContribution,
      openUploadDocument,
      openPlaidDirect,
      openQuickActions
    };
  }, []);

  return (
    <>
      {/* Goal Modal */}
      <GoalModal
        open={globalSheets.goalModal.open}
        onClose={closeGoalModal}
        onCreate={(goal) => {
          // Handle goal creation
          closeGoalModal();
        }}
        accounts={accounts}
        mode={globalSheets.goalModal.mode}
        preselectedAccountId={globalSheets.goalModal.preselectedAccountId}
        useSheet={true}
      />

      {/* Log Contribution Modal */}
      <LogContributionModal
        open={globalSheets.logContribution.open}
        onClose={closeLogContribution}
        onSave={(contribution) => {
          // Handle contribution saving
          closeLogContribution();
        }}
        accounts={accounts}
        goals={goals}
      />

      {/* Upload Document Modal */}
      <UploadDocumentModal
        open={globalSheets.uploadDocument.open}
        onClose={closeUploadDocument}
      />

      {/* Direct Plaid Link */}
      <PlaidLinkButton
        instanceId="global-direct"
        hidden={true}
        plaidOpenRequested={globalSheets.plaidDirect.open}
        onSuccess={(data: any) => {
          clearSampleData();
          
          // Handle both accounts and transactions if provided
          if (Array.isArray(data)) {
            setAccounts(data);
          } else if (data.accounts) {
            setAccounts(data.accounts);
          } else {
            setAccounts(Array.isArray(data) ? data : []);
          }
          
          closePlaidDirect();
        }}
      />

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        open={globalSheets.quickActions.open}
        onClose={closeQuickActions}
        onAddGoal={() => {
          closeQuickActions();
          openGoalModal('add');
        }}
        onConnectAccount={() => {
          closeQuickActions();
          openPlaidDirect();
        }}
        onUploadDocument={() => {
          closeQuickActions();
          openUploadDocument();
        }}
        onLogContribution={() => {
          closeQuickActions();
          openLogContribution();
        }}
      />
    </>
  );
}
