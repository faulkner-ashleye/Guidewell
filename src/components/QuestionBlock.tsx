import React, { ReactNode } from 'react';

interface QuestionBlockProps {
  title: string;
  description?: string;
  children: ReactNode;
  locked?: boolean;
  completed?: boolean;
}

export function QuestionBlock({
  title,
  description,
  children,
  locked = false,
  completed = false
}: QuestionBlockProps) {
  return (
    <div
    >

      <h3 className={`mb-xs text-lg font-semibold ${
        locked ? 'text-gray-500' : 'text-gray-900'
      }`}>
        {title}
      </h3>

      {description && (
        <p className="mb-lg text-muted text-base">
          {description}
        </p>
      )}

      <div className={locked ? 'pointer-events-none' : 'pointer-events-auto'}>
        {children}
      </div>
    </div>
  );
}
