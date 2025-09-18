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
    <nav className="navbar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`navbar-item ${
            location.pathname === item.path 
              ? 'navbar-item-active' 
              : ''
          }`}
        >
          <span className="navbar-icon">{item.icon}</span>
          <span className="navbar-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}




