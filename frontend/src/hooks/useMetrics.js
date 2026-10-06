// Role/Owner: Member 3 (Analytics, Graph & Visualization Lead)
// Core Responsibility: Data fetching hook for model evaluation scores and baseline benchmarks
// Key Interface/Contract: Consumes `getMetricsApi` from `services/api.js`; returns `{ metrics, loading, error, refetch }`

import { useState, useEffect, useCallback } from 'react';
import { getMetricsApi } from '../services/api.js';

export function useMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMetricsApi();
      setMetrics(data);
    } catch (err) {
      setError(err.message || 'Failed to load model metrics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  return { metrics, loading, error, refetch: fetchMetrics };
}
