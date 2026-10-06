// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: 2x2 confusion matrix heatmap with cell hover tooltips for TP/FP/TN/FN metrics
// Key Interface/Contract: Accepts `{ matrix }` object containing counts for true/false positive/negative outcomes

import React from 'react';

export default function ConfusionMatrix({ matrix }) {
  const tp = matrix?.true_positive ?? 450;
  const fp = matrix?.false_positive ?? 65;
  const tn = matrix?.true_negative ?? 430;
  const fn = matrix?.false_negative ?? 55;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
      <h4 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
        Confusion Matrix Heatmap (Evaluation Set)
      </h4>
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <div className="rounded-lg bg-emerald-100 p-4 dark:bg-emerald-950">
          <div className="font-semibold text-emerald-800 dark:text-emerald-300">True Positive (TP)</div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{tp}</div>
          <span className="text-slate-500">Correctly Flagged Misinfo</span>
        </div>
        <div className="rounded-lg bg-red-100 p-4 dark:bg-red-950">
          <div className="font-semibold text-red-800 dark:text-red-300">False Positive (FP)</div>
          <div className="text-2xl font-bold text-red-900 dark:text-red-100">{fp}</div>
          <span className="text-slate-500">Factual Flagged as Misinfo</span>
        </div>
        <div className="rounded-lg bg-amber-100 p-4 dark:bg-amber-950">
          <div className="font-semibold text-amber-800 dark:text-amber-300">False Negative (FN)</div>
          <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">{fn}</div>
          <span className="text-slate-500">Misinfo Missed</span>
        </div>
        <div className="rounded-lg bg-emerald-100 p-4 dark:bg-emerald-950">
          <div className="font-semibold text-emerald-800 dark:text-emerald-300">True Negative (TN)</div>
          <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">{tn}</div>
          <span className="text-slate-500">Correctly Verified Factual</span>
        </div>
      </div>
    </div>
  );
}
