import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, IconNames } from './Icon';
import QuickActionsSheet from '../app/components/QuickActionsSheet';
import AddGoalModal from '../app/plan/components/AddGoalModal';
import LogContributionModal from '../app/components/LogContributionModal';
import PlaidLinkButton from './PlaidLinkButton';
import Sheet from '../app/components/Sheet';
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
  const { accounts = [], goals = [], setAccounts, clearSampleData } = useAppState();

  // Quick Actions state
  const [qaOpen, setQaOpen] = useState(false);
  const [goalOpen, setGoalOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

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
        onAddGoal={() => setGoalOpen(true)}
        onConnectAccount={() => setConnectOpen(true)}
        onLogContribution={() => setLogOpen(true)}
      />

      {/* Add Goal modal */}
      <AddGoalModal
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        onCreate={(g: any) => {/* setGoals(prev=>[...prev, g]) handled inside modal caller */}}
        accounts={accounts}
      />

      {/* Log Contribution modal */}
      <LogContributionModal
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSave={(c: any) => { /* apply to state in your handler */ }}
        accounts={accounts}
        goals={goals}
      />

      {/* Connect account sheet (Plaid or other methods) */}
      <Sheet open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect account">
        <div className="grid-auto">
          <PlaidLinkButton onSuccess={(linked: any) => {
            clearSampleData();
            setAccounts(linked);
          }} />
        </div>
      </Sheet>
    </>
  );
}
