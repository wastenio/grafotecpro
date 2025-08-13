import { useQuery } from '@tanstack/react-query';
import { AuthAPI } from '../client';
import { useAuthStore } from '../../store/authStore';
import { useEffect } from 'react';

export function useMe(enabled = false) {
  const setUser = useAuthStore(s => s.setUser);

  const query = useQuery({
    queryKey: ['me'],
    queryFn: () => AuthAPI.me(),
    enabled,
    retry: false,
  });

  // Efeito colateral após sucesso
  useEffect(() => {
    if (query.isSuccess && query.data) {
      setUser(query.data);
    }
  }, [query.isSuccess, query.data, setUser]);

  return query;
}
