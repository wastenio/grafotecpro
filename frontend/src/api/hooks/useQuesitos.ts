import { useState } from 'react';
import { QuesitosAPI } from '../client';

export const useQuesitos = () => {
  const [quesitos, setQuesitos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchByCase = async (caseId: number) => {
    setLoading(true);
    try {
      const data = await QuesitosAPI.listByCase(caseId);
      setQuesitos(data);
    } finally {
      setLoading(false);
    }
  };

  const updateQuesito = async (id: number, payload: any) => {
    const data = await QuesitosAPI.update(id, payload);
    setQuesitos(prev => prev.map(q => (q.id === id ? data : q)));
    return data;
  };

  return { quesitos, loading, fetchByCase, updateQuesito };
};
