import React, { useState } from 'react';

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
    <div className="w-full">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-lg py-md text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-gray-900 border-blue-600' 
                : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700'
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="mr-xs">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-md">
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
  return <div>{children}</div>;
}





