// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Social graph exploration page visualizing user echo chambers and information cascade diffusion
// Key Interface/Contract: Integrates `useCascades` hook with `NetworkGraph.jsx` and filter controls

import React, { useState } from 'react';
import NetworkGraph from '../components/Charts/NetworkGraph.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useCascades } from '../hooks/useCascades.js';

export default function Network() {
  const { network, loading, error } = useCascades();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return <LoadingSpinner label="Rendering force-directed social diffusion graph..." />;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950">
        {error}
      </div>
    );
  }

  const filteredNodes = network?.nodes?.filter((node) => {
    if (filter === 'all') return true;
    return node.veracity === filter;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Echo Chamber & User Interaction Graph
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            D3 Force-directed graph showing community clusters, retweet propagation, and misinformation hubs across PHEME events.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-500">Filter Nodes:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">All Communities</option>
            <option value="factual">Factual Verified Clusters</option>
            <option value="misinformation">Misinformation Rumor Hubs</option>
          </select>
        </div>
      </div>

      <NetworkGraph nodes={filteredNodes} edges={network?.edges || []} />
    </div>
  );
}
