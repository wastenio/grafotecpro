// src/api/hooks/useQuesito.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuesitosAPI } from '../client';
import { QuesitoSchema, type Quesito } from '../schemas';

// Payload esperado para criar um novo quesito
interface CreateQuesitoPayload {
  case_id: number;
  question: string;
}

// Payload esperado para atualizar/responder quesito
interface UpdateQuesitoPayload {
  answer?: string;
}

/**
 * Listar quesitos de um caso
 */
export const useQuesitosByCase = (caseId: number) => {
  return useQuery<Quesito[]>({
    queryKey: ['quesitos', caseId],
    queryFn: async () => {
      const data = await QuesitosAPI.listByCase(caseId);
      return data.map((item: unknown) => QuesitoSchema.parse(item));
    },
  });
};

/**
 * Criar novo quesito
 */
export const useCreateQuesito = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateQuesitoPayload) => {
      // Aqui passamos o caseId como primeiro argumento
      const data = await QuesitosAPI.create(caseId, payload);
      return QuesitoSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quesitos', caseId] });
    },
  });
};


/**
 * Atualizar/responder quesito
 */
export const useUpdateQuesito = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateQuesitoPayload;
    }) => {
      const data = await QuesitosAPI.update(id, payload);
      return QuesitoSchema.parse(data);
    },
    onSuccess: (updatedQuesito) => {
      // Invalida a query de quesitos do case do quesito atualizado
      queryClient.invalidateQueries({ queryKey: ['quesitos', updatedQuesito.case_id] });
    },
  });
};
