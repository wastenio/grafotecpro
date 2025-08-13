import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QuesitosAPI } from '../client';
import { QuesitoSchema, type Quesito } from '../schemas';

// Listar quesitos de um caso
export const useQuesitosByCase = (caseId: number) => {
  return useQuery<Quesito[]>({
    queryKey: ['quesitos', caseId],
    queryFn: async () => {
      const data = await QuesitosAPI.listByCase(caseId);
      return data.map(QuesitoSchema.parse);
    },
  });
};

// Atualizar/responder quesito
export const useUpdateQuesito = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const data = await QuesitosAPI.update(id, payload);
      return QuesitoSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quesitos'] });
    },
  });
};
