import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon, IconNames } from './Icon';

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
          <Icon 
            name={item.icon} 
            size="sm" 
            className={`navbar-icon ${
              location.pathname === item.path 
                ? 'icon-primary' 
                : 'icon-muted'
            }`}
          />
          <span className="navbar-label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}




