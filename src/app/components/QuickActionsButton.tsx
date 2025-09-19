'use client';
import { Icon, IconNames } from '../../components/Icon';

export default function QuickActionsButton({ onClick }:{ onClick:()=>void }) {
  const handleClick = () => {
    console.log('QuickActionsButton clicked');
    onClick();
  };

  return (
    <button 
      aria-label="Quick actions" 
      onClick={handleClick} 
      className="quick-actions-button"
      style={{ 
        backgroundColor: '#007bff', 
        color: 'white', 
        padding: '8px 16px', 
        border: 'none', 
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <Icon name={IconNames.add} size="sm" className="icon-white" />
      <span>Quick actions</span>
    </button>
  );
}
