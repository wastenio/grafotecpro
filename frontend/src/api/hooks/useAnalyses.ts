import { useState } from 'react';
import { AnalysesAPI } from '../client';

export const useAnalyses = () => {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchByCase = async (caseId: number, params?: any) => {
    setLoading(true);
    try {
      const data = await AnalysesAPI.listByCase(caseId, params);
      setAnalyses(data);
    } finally {
      setLoading(false);
    }
  };

  const createAnalysis = async (caseId: number, payload: any) => {
    const data = await AnalysesAPI.create(caseId, payload);
    setAnalyses(prev => [...prev, data]);
    return data;
  };

  const getAnalysis = async (id: number) => {
    return await AnalysesAPI.get(id);
  };

  const exportPdf = async (caseId: number) => {
    return await AnalysesAPI.exportPdf(caseId);
  };

  return { analyses, loading, fetchByCase, createAnalysis, getAnalysis, exportPdf };
};
