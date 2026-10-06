// Role/Owner: Member 2 (ML & Data Engineering Lead)
// Core Responsibility: Circular SVG confidence gauge visualization with percentage animation
// Key Interface/Contract: Accepts `{ score, isMisinfo }` props to render animated circular arc

import React from 'react';

export default function ConfidenceGauge({ score = 0.5, isMisinfo = false }) {
  const percentage = Math.round(score * 100);
  const strokeColor = isMisinfo ? '#ef4444' : '#10b981';

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
          <path
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            strokeDasharray={`${percentage}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke={strokeColor}
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-xl font-bold">{percentage}%</span>
        </div>
      </div>
      <span className="mt-1 text-xs text-slate-500">Confidence</span>
    </div>
  );
}
