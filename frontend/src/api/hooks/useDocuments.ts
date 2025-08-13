import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsAPI } from '../client';
import { DocumentVersionSchema, type DocumentVersion } from '../schemas';

// Listar versões de documento
export const useDocumentVersions = (documentId: number) => {
  return useQuery<DocumentVersion[], Error>({
    queryKey: ['documents', documentId], // <<< queryKey deve ser dentro do objeto
    queryFn: async () => {
      const data = await DocumentsAPI.versions(documentId);
      return data.map(DocumentVersionSchema.parse);
    },
  });
};

// Upload de nova versão
export const useUploadDocumentVersion = (documentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ file, changelog }: { file: File; changelog?: string }) =>
      DocumentsAPI.uploadVersion(documentId, file, changelog),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents', documentId] }),
  });
};

// Download versão
export const useDownloadDocumentVersion = () => {
  return (versionId: number) => DocumentsAPI.downloadVersion(versionId);
};
