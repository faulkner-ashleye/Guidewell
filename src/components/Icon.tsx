import React from 'react';

export interface IconProps {
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'primary' | 'success' | 'warning' | 'error' | 'debt' | 'savings' | 'investing' | 'muted' | 'white';
  alignment?: 'top' | 'middle' | 'bottom' | 'baseline';
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export function Icon({ 
  name, 
  size = 'lg', 
  color, 
  alignment = 'baseline',
  className = '',
  onClick,
  style
}: IconProps) {
  const sizeClass = `icon-${size}`;
  const colorClass = color ? `icon-${color}` : '';
  const alignmentClass = `icon-align-${alignment}`;
  const clickableClass = onClick ? 'cursor-pointer' : '';
  
  const classes = [
    'material-icons',
    sizeClass,
    colorClass,
    alignmentClass,
    clickableClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={classes}
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {name}
    </span>
  );
}

// Common icon names for easy reference (Material Symbols Outlined)
export const IconNames = {
  // Navigation
  menu: 'menu',
  close: 'close',
  arrow_back: 'arrow_back',
  arrow_forward: 'arrow_forward',
  home: 'home',
  settings: 'settings',
  
  // Actions
  add: 'add',
  remove: 'remove',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  cancel: 'cancel',
  check: 'check',
  clear: 'clear',
  
  // Financial
  account_balance: 'account_balance',
  account_balance_wallet: 'account_balance_wallet',
  credit_card: 'credit_card',
  savings: 'savings',
  trending_up: 'trending_up',
  trending_down: 'trending_down',
  attach_money: 'attach_money',
  payment: 'payment',
  
  // Status
  check_circle: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
  help: 'help',
  
  // UI
  visibility: 'visibility',
  visibility_off: 'visibility_off',
  expand_more: 'expand_more',
  expand_less: 'expand_less',
  refresh: 'refresh',
  search: 'search',
  filter_list: 'filter_list',
  sort: 'sort',
  
  // Communication
  email: 'email',
  phone: 'phone',
  chat: 'chat',
  notification: 'notifications',
  
  // Data
  bar_chart: 'bar_chart',
  pie_chart: 'pie_chart',
  show_chart: 'show_chart',
  table_chart: 'table_chart',
  
  // Files
  file_download: 'file_download',
  file_upload: 'file_upload',
  description: 'description',
  folder: 'folder',
  
  // Time
  schedule: 'schedule',
  calendar_today: 'calendar_today',
  access_time: 'access_time',
  
  // Security
  security: 'security',
  lock: 'lock',
  lock_open: 'lock_open',
  verified_user: 'verified_user'
} as const;

export type IconName = typeof IconNames[keyof typeof IconNames];

export default Icon;
