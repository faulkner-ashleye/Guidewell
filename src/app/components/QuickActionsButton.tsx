'use client';
export default function QuickActionsButton({ onClick }:{ onClick:()=>void }) {
  return (
    <button 
      aria-label="Quick actions" 
      onClick={onClick} 
      className="inline-flex items-center gap-xs px-sm py-xs rounded-lg border border-gray-300 bg-transparent hover:bg-gray-50 transition-colors"
    >
      <span className="text-lg leading-none">＋</span>
      <span>Quick actions</span>
    </button>
  );
}
