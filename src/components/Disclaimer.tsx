import React from 'react';

export function Disclaimer() {
  return (
    <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 border border-yellow-500 rounded-lg px-4 py-3 my-4 flex items-start gap-3 sm:px-3 sm:py-2.5 sm:my-3">
      <div className="text-xl flex-shrink-0 mt-0.5 sm:text-lg">⚠️</div>
      <div className="text-sm text-yellow-800 leading-relaxed sm:text-xs">
        <strong>Educational scenarios only</strong> — not financial, legal, or investment advice. 
        Actual results may vary.
      </div>
    </div>
  );
}









