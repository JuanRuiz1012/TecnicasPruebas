import { useState, useEffect } from 'react';
import { fetchDescriptiveDashboard } from '../services/api';

export function useDashboardData(filters = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchDescriptiveDashboard(filters);
      if (result) {
        setData(result);
        setError(null);
      } else {
        setError('No se pudo conectar con el servidor de FastAPI.');
      }
      setLoading(false);
    }

    loadData();
  }, [JSON.stringify(filters)]); // Recarga cada vez que cambien los filtros

  return { data, loading, error };
}