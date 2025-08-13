import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CommentsAPI } from '../client';
import { CommentSchema } from '../schemas';
import type { Comment } from '../schemas';

// Listar comentários
export const useComments = () => {
  return useQuery<Comment[]>({
    queryKey: ['comments'],
    queryFn: async () => {
      const data = await CommentsAPI.list();
      return data.map(CommentSchema.parse);
    },
  });
};

// Criar comentário
export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: any) => {
      const data = await CommentsAPI.create(payload);
      return CommentSchema.parse(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};

// Atualizar comentário
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const data = await CommentsAPI.update(id, payload);
      return CommentSchema.parse(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};

// Remover comentário
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await CommentsAPI.remove(id);
      return id; // retorna o ID removido, se precisar
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments'] }),
  });
};
