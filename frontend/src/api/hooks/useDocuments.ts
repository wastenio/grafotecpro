import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsAPI } from '../client';
import { DocumentVersionSchema, type DocumentVersion } from '../schemas';

// Listar versões de documento
export const useDocumentVersions = (documentId: number) => {
  return useQuery<DocumentVersion[], Error>({
    queryKey: ['documents', documentId],
    queryFn: async () => {
      const data = await DocumentsAPI.versions(documentId);
      return data.map((item: unknown) => DocumentVersionSchema.parse(item));
    },
  });
};

// Upload de nova versão
export const useUploadDocumentVersion = (documentId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, changelog }: { file: File; changelog?: string }) => {
      const data = await DocumentsAPI.uploadVersion(documentId, file, changelog);
      return DocumentVersionSchema.parse(data);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents', documentId] }),
  });
};

// Download versão
export const useDownloadDocumentVersion = () => {
  return (versionId: number) => DocumentsAPI.downloadVersion(versionId);
};
