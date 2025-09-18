'use client';
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
        fontSize: '14px'
      }}
    >
      <span className="quick-actions-icon">＋</span>
      <span>Quick actions</span>
    </button>
  );
}
