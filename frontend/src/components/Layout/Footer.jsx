// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Application footer displaying academic unit attribution, dataset references, and project status
// Key Interface/Contract: Stateless layout component rendered at the bottom of `App.jsx`

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
      <p>
        COS30048/COS30049 — Automated Political & Breaking News Misinformation Detection System
      </p>
      <p className="mt-1">
        Powered by DistilBERT (INT8 Quantized) & Ridge Cascade Regressor | Datasets: PHEME + FakeNewsNet PolitiFact
      </p>
    </footer>
  );
}
