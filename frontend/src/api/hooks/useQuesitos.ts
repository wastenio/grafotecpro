// src/api/hooks/useQuesito.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuesitosAPI } from '../client';
import { QuesitoSchema, type Quesito } from '../schemas';

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
    onSuccess: (_, variables) => {
      // Invalida apenas os quesitos relacionados ao case do quesito atualizado
      queryClient.invalidateQueries({ queryKey: ['quesitos', variables.id] });
    },
  });
};
