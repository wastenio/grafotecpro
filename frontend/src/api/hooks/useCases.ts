import { useState } from 'react';
import { CasesAPI } from '../client';

export const useCases = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCases = async (params?: any) => {
    setLoading(true);
    try {
      const data = await CasesAPI.list(params);
      setCases(data);
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (payload: any) => {
    const data = await CasesAPI.create(payload);
    setCases(prev => [...prev, data]);
    return data;
  };

  const getCase = async (id: number) => {
    return await CasesAPI.get(id);
  };

  const uploadReport = async (caseId: number, file: File) => {
    return await CasesAPI.uploadReport(caseId, file);
  };

  return { cases, loading, fetchCases, createCase, getCase, uploadReport };
};
