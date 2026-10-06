// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: About page documenting system architecture, ML methodology, and dataset provenance
// Key Interface/Contract: Informational view component mounted in `App.jsx`

import React from 'react';

export default function About() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          About the Misinformation Detection System
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Academic project designed for COS30048/COS30049 targeting High Distinction (HD) rubric criteria.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">System Architecture & Pipeline</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          The system implements a multi-stage NLP and diffusion pipeline: political text preprocessing (Unicode NFKD, camelCase hashtag splitting, URL masking), INT8 dynamically quantized DistilBERT Transformer sequence classification, and Ridge Regression cascade reach estimation.
        </p>

        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">Datasets Utilized:</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong>PHEME Political Rumour Cascades:</strong> ~4k conversation threads and ~40k tweets from Ferguson, Ottawa Shooting, Putin Missing, and Charlie Hebdo events.</li>
          <li><strong>FakeNewsNet (PolitiFact):</strong> Fact-checked political statements and news articles with ground truth credibility labels.</li>
        </ul>

        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">Machine Learning Implementations:</h3>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1">
          <li><strong>Binary Classification (Primary):</strong> Fine-tuned DistilBERT (INT8 quantized &lt; 200MB RAM footprint).</li>
          <li><strong>NLP Baseline:</strong> TF-IDF n-gram vectorization with balanced Logistic Regression.</li>
          <li><strong>Graph Clustering:</strong> Louvain community detection and K-Means on PHEME interaction graphs.</li>
          <li><strong>Virality Regression:</strong> Ridge Regressor predicting cascade size from author followers and verification badge.</li>
        </ul>
      </div>
    </div>
  );
}
