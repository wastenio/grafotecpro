// src/api/hooks/useComments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentsAPI } from '../client';
import { CommentSchema, type Comment } from '../schemas';

// Listar comentários de um caso específico
export const useComments = (caseId: number) => {
  return useQuery<Comment[]>({
    queryKey: ['comments', caseId],
    queryFn: async () => {
      const data = await CommentsAPI.list(caseId); // lista apenas do caseId
      return data.map((item: unknown) => CommentSchema.parse(item));
    },
  });
};

// Criar comentário
export const useCreateComment = (caseId: number, onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { content: string }) => {
      // Envia um único objeto contendo content e caseId
      const data = await CommentsAPI.create({ ...payload, caseId });
      return CommentSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', caseId] });
      if (onSuccessCallback) onSuccessCallback();
    },
  });
};




// Atualizar comentário
export const useUpdateComment = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: { content: string };
    }) => {
      const data = await CommentsAPI.update(id, payload);
      return CommentSchema.parse(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', caseId] });
    },
  });
};

// Remover comentário
export const useDeleteComment = (caseId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await CommentsAPI.remove(id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', caseId] });
    },
  });
};
