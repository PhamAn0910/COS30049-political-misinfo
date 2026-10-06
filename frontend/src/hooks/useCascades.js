// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Data fetching hook for cascade statistics and social interaction network graph data
// Key Interface/Contract: Consumes `getCascadeStatsApi` and `getCascadeNetworkApi`; returns `{ stats, network, loading, error, refetch }`

import { useState, useEffect, useCallback } from 'react';
import { getCascadeStatsApi, getCascadeNetworkApi } from '../services/api.js';

export function useCascades() {
  const [stats, setStats] = useState(null);
  const [network, setNetwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCascadeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, networkData] = await Promise.all([
        getCascadeStatsApi(),
        getCascadeNetworkApi(),
      ]);
      setStats(statsData);
      setNetwork(networkData);
    } catch (err) {
      setError(err.message || 'Failed to load cascade and network data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCascadeData();
  }, [fetchCascadeData]);

  return { stats, network, loading, error, refetch: fetchCascadeData };
}
