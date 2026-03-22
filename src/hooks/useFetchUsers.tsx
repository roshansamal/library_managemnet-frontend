// src/hooks/useFetchUsers.ts
import { useEffect, useState } from 'react';
//import api from '../lib/axios';
import api from '../api/axios';

export function useFetchUsers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await api.get('/api/users');
        setData(res.data ?? res);      // depends on your axios interceptor
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return { data, loading };
}
