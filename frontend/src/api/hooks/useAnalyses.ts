import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AnalysesAPI } from '../client';
import { AnalysisSchema, type Analysis } from '../schemas';

// Listar análises de um caso
export const useAnalysesByCase = (caseId: number) => {
  return useQuery<Analysis[]>({
    queryKey: ['analyses', caseId],
    queryFn: async () => {
      const data = await AnalysesAPI.listByCase(caseId);
      return data.map(AnalysisSchema.parse);
    },
  });
};

// Obter análise específica
export const useAnalysis = (analysisId: number) => {
  return useQuery<Analysis>({
    queryKey: ['analysis', analysisId],
    queryFn: async () => {
      const data = await AnalysesAPI.get(analysisId);
      return AnalysisSchema.parse(data);
    },
  });
};

// Criar nova análise
export const useCreateAnalysis = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await AnalysesAPI.create(caseId, payload);
      return AnalysisSchema.parse(data);
    },
    onSuccess: () => {
      // Ajuste para React Query v4
      queryClient.invalidateQueries({ queryKey: ['analyses', caseId] });
    },
  });
};
