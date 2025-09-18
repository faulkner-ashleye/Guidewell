import React, { useState } from 'react';
import { COLORS } from '../ui/colors';
import './Tabs.css';

interface Tab {
  id: string;
  label: string;
  icon?: string;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  children: React.ReactNode;
}

export function Tabs({ tabs, defaultTab, onTabChange, children }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div className="tabs-container">
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
            style={{
              backgroundColor: activeTab === tab.id ? COLORS.card : 'transparent',
              color: activeTab === tab.id ? COLORS.text : COLORS.textMuted,
              borderColor: COLORS.border
            }}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="tabs-content">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.props.tabId === activeTab) {
            return child;
          }
          return null;
        })}
      </div>
    </div>
  );
}

interface TabPanelProps {
  tabId: string;
  children: React.ReactNode;
}

export function TabPanel({ tabId, children }: TabPanelProps) {
  return <div className="tab-panel">{children}</div>;
}




