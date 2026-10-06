// Role/Owner: Member 2 (ML & Data Engineering Lead)
// Core Responsibility: Color-coded status badge for information cascade virality risk levels
// Key Interface/Contract: Accepts `{ riskLevel }` prop ('High' | 'Moderate' | 'Low')

import React from 'react';

export default function SpreadRiskBadge({ riskLevel = 'Low' }) {
  const getBadgeStyle = () => {
    switch (riskLevel?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-200';
      case 'moderate':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200';
      case 'low':
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200';
    }
  };

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${getBadgeStyle()}`}>
      Spread Risk: {riskLevel}
    </span>
  );
}
