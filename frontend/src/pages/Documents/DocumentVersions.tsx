import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DocumentsAPI } from '../../api/client';
import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface DocumentVersion {
  id: number;
  file_name: string;
  changelog: string;
}

export default function DocumentVersions() {
  const { documentId } = useParams<{ documentId: string }>();
  const numericDocumentId = Number(documentId);
  const queryClient = useQueryClient();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changelog, setChangelog] = useState('');

  const { data: versions } = useQuery<DocumentVersion[]>({
    queryKey: ['docVersions', numericDocumentId] as const,
    queryFn: () => DocumentsAPI.versions(numericDocumentId),
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile) throw new Error('Selecione um arquivo');
      return DocumentsAPI.uploadVersion(numericDocumentId, selectedFile, changelog);
    },
    onSuccess: () => {
      setSelectedFile(null);
      setChangelog('');
      queryClient.invalidateQueries({ queryKey: ['docVersions', numericDocumentId] });
    }
  });

  const download = async (versionId: number, filename: string) => {
    try {
      const blob: Blob = await DocumentsAPI.downloadVersion(versionId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar o arquivo:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(e.target.files?.[0] ?? null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Versões do Documento #{documentId}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        <input type="file" onChange={handleFileChange} />
        <TextField
          placeholder="Descrição da versão"
          value={changelog}
          onChange={(e) => setChangelog(e.target.value)}
        />
        <Button variant="contained" onClick={() => uploadMutation.mutate()}>
          Enviar nova versão
        </Button>
      </Box>

      {versions?.map((v) => (
        <Card key={v.id} sx={{ mb: 1 }}>
          <CardContent>
            <Typography variant="subtitle1">{v.file_name}</Typography>
            <Typography variant="body2" color="text.secondary">{v.changelog}</Typography>
            <Button onClick={() => download(v.id, v.file_name)}>Download</Button>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
