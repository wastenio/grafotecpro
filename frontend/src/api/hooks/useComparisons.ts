import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ComparisonsAPI } from '../client';
import { ComparisonSchema, type Comparison } from '../schemas';

// Listar comparações de uma análise
export const useComparisonsByAnalysis = (analysisId: number) => {
  return useQuery<Comparison[]>({
    queryKey: ['comparisons', analysisId],
    queryFn: async () => {
      const data = await ComparisonsAPI.listByAnalysis(analysisId);
      return data.map(ComparisonSchema.parse);
    },
  });
};

// Criar comparação
export const useCreateComparison = (analysisId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await ComparisonsAPI.create(analysisId, payload);
      return ComparisonSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comparisons', analysisId] });
    },
  });
};

// Obter resultado detalhado
export const useComparisonDetail = (comparisonId: number) => {
  return useQuery<Comparison>({
    queryKey: ['comparison', comparisonId],
    queryFn: async () => {
      const data = await ComparisonsAPI.detailResult(comparisonId);
      return ComparisonSchema.parse(data);
    },
  });
};
