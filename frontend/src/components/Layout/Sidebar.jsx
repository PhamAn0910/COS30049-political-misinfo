// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Sidebar navigation menu for routing between Dashboard, Analytics, Network, and About views
// Key Interface/Contract: Accepts `{ activeTab, setActiveTab }` props to trigger application view changes

import React from 'react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Claim Verifier', icon: '🔍' },
  { id: 'analytics', label: 'Model Analytics', icon: '📊' },
  { id: 'network', label: 'Echo Chamber Graph', icon: '🕸️' },
  { id: 'about', label: 'About & Metrics', icon: 'ℹ️' },
];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === item.id
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-400'
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
