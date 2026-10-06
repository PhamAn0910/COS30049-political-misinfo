// Role/Owner: Member 2 (ML & Data Engineering Lead)
// Core Responsibility: Prediction outcome display card with color-coded status, confidence score, and reach metrics
// Key Interface/Contract: Accepts `{ result }` prop matching `PredictResponse` schema; embeds ConfidenceGauge and SpreadRiskBadge

import React from 'react';
import ConfidenceGauge from './ConfidenceGauge.jsx';
import SpreadRiskBadge from './SpreadRiskBadge.jsx';

export default function ResultCard({ result }) {
  if (!result) return null;

  const isMisinfo = result.veracity_label === 'misinformation';

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${
      isMisinfo
        ? 'border-red-200 bg-red-50/50 dark:border-red-900/50 dark:bg-red-950/20'
        : 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-950/20'
    }`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{isMisinfo ? '❌' : '✅'}</span>
            <h3 className={`text-xl font-bold ${isMisinfo ? 'text-red-700 dark:text-red-400' : 'text-emerald-700 dark:text-emerald-400'}`}>
              {isMisinfo ? 'Misinformation / Unverified Rumor' : 'Factual / Verified Statement'}
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Model Confidence: {(result.veracity_score * 100).toFixed(1)}%
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <SpreadRiskBadge riskLevel={result.spread_risk} />
            <span className="text-xs text-slate-500">
              Estimated Reach: ~{result.expected_reach?.toLocaleString()} users
            </span>
          </div>
        </div>
        <ConfidenceGauge score={result.veracity_score} isMisinfo={isMisinfo} />
      </div>
    </div>
  );
}
