// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Header status badge indicating backend server and model runtime connectivity
// Key Interface/Contract: Accepts `{ status }` prop ('live' | 'demo' | 'offline'); rendered in Header.jsx

import React from 'react';

export default function StatusBadge({ status }) {
  const isLive = (status === 'ok');
  console.log("status: " + status);

  return (
    <span className="inline-flex items-center space-x-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium dark:border-slate-700 dark:bg-slate-900">
      <span className={`h-2 w-2 rounded-full 
          ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500 animate-pulse'
        }`
      }/>
      <span className="text-slate-700 dark:text-slate-300">
        {isLive ? 'Backend Online (INT8 Active)' : 'Backend Offline'}
      </span>
    </span>
  );
}
