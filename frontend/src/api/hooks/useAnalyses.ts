// src/api/hooks/useAnalysis.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalysesAPI } from '../client';
import { AnalysisSchema, type Analysis } from '../schemas';

// Payload esperado para criar análise
interface CreateAnalysisPayload {
  title: string;
  methodology?: string;
  conclusion?: string;
}

/**
 * Listar análises de um caso
 */
export const useAnalysesByCase = (caseId: number) => {
  return useQuery<Analysis[]>({
    queryKey: ['analyses', caseId],
    queryFn: async () => {
      // Tipando o retorno da API como "unknown[]" primeiro
      const data: unknown[] = await AnalysesAPI.listByCase(caseId);
      return data.map((item: unknown) => AnalysisSchema.parse(item));
    },
  });
};

/**
 * Obter análise específica
 */
export const useAnalysis = (analysisId: number) => {
  return useQuery<Analysis>({
    queryKey: ['analysis', analysisId],
    queryFn: async () => {
      const data = await AnalysesAPI.get(analysisId);
      return AnalysisSchema.parse(data);
    },
  });
};

/**
 * Criar nova análise
 */
export const useCreateAnalysis = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAnalysisPayload) => {
      const data = await AnalysesAPI.create(caseId, payload);
      return AnalysisSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analyses', caseId] });
    },
  });
};
