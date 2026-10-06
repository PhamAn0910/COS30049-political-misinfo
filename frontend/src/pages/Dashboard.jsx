// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Main claim verification view integrating InputForm, ResultCard, and live prediction hooks
// Key Interface/Contract: Integrates `usePredict` hook with `InputForm.jsx` and `ResultCard.jsx`

import React from 'react';
import InputForm from '../components/Predict/InputForm.jsx';
import ResultCard from '../components/Predict/ResultCard.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { usePredict } from '../hooks/usePredict.js';

export default function Dashboard() {
  const { predict, result, loading, error } = usePredict();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Political & Breaking News Veracity Detector
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Verify political claims and breaking news tweets with INT8 DistilBERT contextual classification and cascade spread risk analysis.
        </p>
      </div>

      <InputForm onSubmit={predict} loading={loading} />

      {loading && <LoadingSpinner label="Evaluating claim against fine-tuned Transformer & diffusion regressor..." />}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
