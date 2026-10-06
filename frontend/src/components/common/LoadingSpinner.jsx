// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Reusable animated loading spinner component for asynchronous transitions
// Key Interface/Contract: Accepts `{ size, label }` props; utilized during API request states

import React from 'react';

export default function LoadingSpinner({ size = 'md', label = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }[size] || 'h-8 w-8 border-3';

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <div className={`animate-spin rounded-full border-brand-500 border-t-transparent ${sizeClasses}`} />
      {label && <span className="text-xs text-slate-500">{label}</span>}
    </div>
  );
}
