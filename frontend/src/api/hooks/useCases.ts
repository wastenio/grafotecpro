// src/api/hooks/useCases.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CasesAPI } from '../client';
import { CaseSchema, type Case } from '../schemas';
import { z } from 'zod';

// Payload esperado para criar caso
interface CreateCasePayload {
  title: string;
  description?: string;
}

/**
 * Hook para obter um único caso pelo ID
 */
export const useCase = (caseId: number) => {
  return useQuery<Case>({
    queryKey: ['cases', caseId],
    queryFn: async () => {
      const data = await CasesAPI.get(caseId);
      return CaseSchema.parse(data); // validação com Zod
    },
  });
};

/**
 * Hook para listar todos os casos
 */
export const useCases = () => {
  return useQuery<Case[]>({
    queryKey: ['cases'],
    queryFn: async () => {
      const data = await CasesAPI.list();
      return z.array(CaseSchema).parse(data); // validação com Zod
    },
  });
};

/**
 * Hook para criar um novo caso
 */
export const useCreateCase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCasePayload) => {
      const data = await CasesAPI.create(payload);
      return CaseSchema.parse(data); // validação Zod
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });
};
