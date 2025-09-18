import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

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
    <nav className="nav-bar">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}




