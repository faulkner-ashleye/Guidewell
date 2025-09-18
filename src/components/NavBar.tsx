import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

const navItems: NavItem[] = [
  { path: '/home', label: 'Home', icon: '🏠' },
  { path: '/strategies', label: 'Strategies', icon: '📊' },
  { path: '/plan', label: 'Plan', icon: '📋' },
  { path: '/settings', label: 'Settings', icon: '⚙️' }
];

export function NavBar() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2 z-[1000] shadow-[0_-2px_10px_rgba(0,0,0,0.1)] sm:py-1.5">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex flex-col items-center no-underline text-gray-500 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] hover:bg-gray-100 hover:text-gray-700 sm:px-2 sm:py-1.5 sm:min-w-[50px] ${
            location.pathname === item.path 
              ? 'text-blue-500 bg-blue-50' 
              : ''
          }`}
        >
          <span className="text-xl mb-1 sm:text-lg">{item.icon}</span>
          <span className="text-xs font-medium sm:text-[11px]">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}




