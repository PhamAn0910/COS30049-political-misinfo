// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: State management and asynchronous dispatch hook for claim veracity prediction
// Key Interface/Contract: Consumes `predictClaimApi` from `services/api.js`; returns `{ predict, result, loading, error, clearResult }`

import { useState, useCallback } from 'react';
import { predictClaimApi } from '../services/api.js';

export function usePredict() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictClaimApi(payload);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message || 'Failed to analyze claim veracity.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { predict, result, loading, error, clearResult };
}
