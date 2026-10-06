// Role/Owner: Member 1 (Full-Stack & Integration Lead)
// Core Responsibility: Central Axios API client with timeout handling, base URL resolution, and error interceptors
// Key Interface/Contract: Consumed by React custom hooks (`usePredict`, `useMetrics`, `useCascades`)

import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.detail || error.message || 'An unexpected API error occurred',
      status: error.response?.status || 500,
    };
    return Promise.reject(customError);
  }
);

export const predictClaimApi = (payload) => apiClient.post('/predict', payload);
export const clearPredictionHistoryApi = () => apiClient.delete('/predict/history');
export const getMetricsApi = () => apiClient.get('/metrics');
export const getCascadeStatsApi = () => apiClient.get('/cascades/stats');
export const getCascadeNetworkApi = () => apiClient.get('/cascades/network');

export default apiClient;
