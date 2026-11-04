// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Top application navigation header, branding, live status badge, and theme controls
// Key Interface/Contract: Accepts `{ activeTab, setActiveTab }` props; renders StatusBadge component

import React from 'react';
import StatusBadge from '../common/StatusBadge.jsx';

export default function Header({ activeTab, setActiveTab }) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold tracking-tight dark:text-brand-500">
          <span className="text-red-400">Misinfo</span><span className="text-brand-600">Detector</span>
        </span>
        <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          v1.0 (PolitiFact + PHEME)
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <StatusBadge status="offline" />
      </div>
    </header>
  );
}
