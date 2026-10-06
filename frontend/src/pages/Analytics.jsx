// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Analytics dashboard page compiling evaluation metrics, confusion matrix, radar, and timeline charts
// Key Interface/Contract: Integrates `useMetrics` and `useCascades` with Recharts components

import React from 'react';
import MetricsRadarChart from '../components/Charts/MetricsRadarChart.jsx';
import ConfusionMatrix from '../components/Charts/ConfusionMatrix.jsx';
import CategoryBarChart from '../components/Charts/CategoryBarChart.jsx';
import CascadeBubbleChart from '../components/Charts/CascadeBubbleChart.jsx';
import TimelineAreaChart from '../components/Charts/TimelineAreaChart.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useMetrics } from '../hooks/useMetrics.js';
import { useCascades } from '../hooks/useCascades.js';

export default function Analytics() {
  const { metrics, loading: metricsLoading } = useMetrics();
  const { stats, loading: cascadesLoading } = useCascades();

  if (metricsLoading || cascadesLoading) {
    return <LoadingSpinner label="Loading model evaluation metrics and chart telemetry..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Model Performance & Cascade Analytics
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Comprehensive evaluation metrics comparing fine-tuned DistilBERT against baseline TF-IDF on PHEME & FakeNewsNet PolitiFact.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MetricsRadarChart metrics={metrics} />
        <ConfusionMatrix matrix={metrics?.confusion_matrix} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryBarChart />
        <CascadeBubbleChart />
      </div>

      <div>
        <TimelineAreaChart />
      </div>
    </div>
  );
}
