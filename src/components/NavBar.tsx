import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, IconNames } from './Icon';
import { AIChatSheet } from './AIChatSheet';
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
  { path: '/opportunities', label: 'Insights', icon: IconNames.lightbulb_outline }
];

export function NavBar() {
  const location = useLocation();

  // AI Chat state
  const [aiChatOpen, setAiChatOpen] = useState(false);

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

            {/* Insert AI Chat FAB between strategies and plan */}
            {index === 1 && (
              <div className="navbar-item">
                <button
                  className="navbar-fab"
                  onClick={() => setAiChatOpen(true)}
                  aria-label="AI Chat"
                >
                  <Icon name={IconNames.auto_awesome} size="md" />
                </button>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* AI Chat Sheet */}
      <AIChatSheet
        open={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
      />
    </>
  );
}
