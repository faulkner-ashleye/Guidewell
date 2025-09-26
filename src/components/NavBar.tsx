import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, IconNames } from './Icon';
import QuickActionsSheet from '../app/components/QuickActionsSheet';
import PlaidLinkButton from './PlaidLinkButton';
import { useAppState } from '../state/AppStateContext';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Home', icon: IconNames.home },
  { path: '/strategies', label: 'Strategies', icon: IconNames.show_chart },
  { path: '/plan', label: 'Plan', icon: IconNames.description },
  { path: '/settings', label: 'Settings', icon: IconNames.settings }
];

export function NavBar() {
  const location = useLocation();
  const { accounts = [], goals = [], setAccounts, clearSampleData, userProfile } = useAppState();

  // Quick Actions state
  const [qaOpen, setQaOpen] = useState(false);
  const [plaidOpenRequested, setPlaidOpenRequested] = useState(false);

  return (
    <>
      <nav className="navbar">
        {navItems.map((item, index) => (
          <div key={item.path}>
            <Link
              to={item.path}
              className={`navbar-item ${
                location.pathname === item.path
                  ? 'navbar-item-active'
                  : ''
              }`}
            >
              <Icon
                name={item.icon}
                size="sm"
                className="navbar-icon"
              />
              <span className="navbar-label">{item.label}</span>
            </Link>

            {/* Insert Quick Actions FAB between strategies and plan */}
            {index === 1 && (
              <div className="navbar-item">
                <button
                  className="navbar-fab"
                  onClick={() => setQaOpen(true)}
                  aria-label="Quick actions"
                >
                  <Icon name={IconNames.add} size="md" />
                </button>
                <span className="navbar-label">Quick Access</span>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Quick Actions Sheet */}
      <QuickActionsSheet
        open={qaOpen}
        onClose={() => setQaOpen(false)}
        onAddGoal={() => {
          setQaOpen(false);
          if ((window as any).globalSheets) {
            (window as any).globalSheets.openGoalModal('add');
          }
        }}
        onConnectAccount={() => {
          setQaOpen(false);
          // Trigger Plaid directly
          setPlaidOpenRequested(true);
        }}
        onUploadDocument={() => {
          setQaOpen(false);
          if ((window as any).globalSheets) {
            (window as any).globalSheets.openUploadDocument();
          }
        }}
        onLogContribution={() => {
          setQaOpen(false);
          if ((window as any).globalSheets) {
            (window as any).globalSheets.openLogContribution();
          }
        }}
      />

      {/* Hidden PlaidLinkButton for direct launch */}
      <PlaidLinkButton 
        instanceId="navbar-direct"
        key={`plaid-link-navbar-direct-${userProfile ? 'logged-in' : 'logged-out'}`}
        hidden={true}
        plaidOpenRequested={plaidOpenRequested}
        onSuccess={(data: any) => {
          clearSampleData();
          
          // Handle both accounts and transactions if provided
          if (Array.isArray(data)) {
            // Legacy format: just accounts array
            setAccounts(data);
          } else if (data.accounts) {
            // New format: object with accounts and transactions
            setAccounts(data.accounts);
          } else {
            // Fallback: treat as accounts array
            setAccounts(Array.isArray(data) ? data : []);
          }
          
          // Reset the open request
          setPlaidOpenRequested(false);
        }} 
      />
    </>
  );
}
