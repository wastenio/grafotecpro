import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ComparisonsAPI } from '../client';
import { ComparisonSchema, type Comparison } from '../schemas';
import type { ComparisonDetail } from '../types';


// Listar comparações de uma análise
export const useComparisonsByAnalysis = (analysisId: number) => {
  return useQuery<Comparison[]>({
    queryKey: ['comparisons', analysisId],
    queryFn: async () => {
      const data = await ComparisonsAPI.listByAnalysis(analysisId);
      // Ajuste: usar 'unknown' para cada item antes do parse
      return data.map((item: unknown) => ComparisonSchema.parse(item));
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
  return useQuery<ComparisonDetail>({
    queryKey: ['comparison', comparisonId],
    queryFn: async () => {
      const data = await ComparisonsAPI.detailResult(comparisonId);
      // Mapeia os documentos, caso existam
      return {
        ...data,
        left_document_version: data.left_document_version ?? null,
        right_document_version: data.right_document_version ?? null,
      };
    },
  });
};
