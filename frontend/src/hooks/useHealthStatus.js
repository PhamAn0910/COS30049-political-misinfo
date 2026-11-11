import { useState, useCallback, useEffect } from "react";
import { getHealthApi } from "../services/api.js";

export function useHealthStatus() {
  const [status, setStatus] = useState(null);
  const [err, setErr] = useState(null);

  const fetchHealthStatus = useCallback(async () => {
    try {
      const data = await getHealthApi();
      setStatus(data.status);
    } catch (err) {
      setStatus("e");
      setErr(err.message);
    }
  }, []);

  useEffect( () => {
    fetchHealthStatus();

  }, [fetchHealthStatus]);

  return {status, err, refetch: fetchHealthStatus};
}
