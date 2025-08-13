import { useState } from 'react';
import { ComparisonsAPI } from '../client';

export const useComparisons = () => {
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchByAnalysis = async (analysisId: number) => {
    setLoading(true);
    try {
      const data = await ComparisonsAPI.listByAnalysis(analysisId);
      setComparisons(data);
    } finally {
      setLoading(false);
    }
  };

  const createComparison = async (analysisId: number, payload: any) => {
    const data = await ComparisonsAPI.create(analysisId, payload);
    setComparisons(prev => [...prev, data]);
    return data;
  };

  const getDetailResult = async (comparisonId: number) => {
    return await ComparisonsAPI.detailResult(comparisonId);
  };

  return { comparisons, loading, fetchByAnalysis, createComparison, getDetailResult };
};
