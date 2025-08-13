import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CasesAPI, DocumentsAPI } from '../../api/client';
import { Box, Button, Card, CardContent, Grid, Typography, TextField } from '@mui/material';
import { useState } from 'react';
import CommentThread from '../../components/comments/CommentThread';
import { downloadFile } from '../../utils/download';

interface CaseData {
    id: number;
    title: string;
    description: string;
}

interface DocumentVersion {
    id: number;
    name: string;
    file_name: string;
    changelog: string;
}

export default function CaseDetail() {
    const { caseId } = useParams<{ caseId: string }>();
    const numericCaseId = Number(caseId);
    const queryClient = useQueryClient();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [changelog, setChangelog] = useState('');

    const { data: caseData } = useQuery<CaseData>({
        queryKey: ['case', numericCaseId] as const,
        queryFn: () => CasesAPI.get(numericCaseId)
    });

    const { data: documents } = useQuery<DocumentVersion[]>({
        queryKey: ['documents', numericCaseId] as const,
        queryFn: () => DocumentsAPI.versions(numericCaseId)
    });

    const uploadMutation = useMutation({
        mutationFn: async () => {
            if (!selectedFile) throw new Error('Selecione um arquivo');
            return DocumentsAPI.uploadVersion(numericCaseId, selectedFile, changelog);
        },
        onSuccess: () => {
            setSelectedFile(null);
            setChangelog('');
            // ✅ Correção definitiva
            queryClient.invalidateQueries({ queryKey: ['documents', numericCaseId] });
        }
    });

    const handleDownload = async (versionId: number, filename: string) => {
        try {
            const blob: Blob = await DocumentsAPI.downloadVersion(versionId);
            downloadFile(blob, filename);
        } catch (error) {
            console.error('Erro ao baixar o arquivo:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom>{caseData?.title ?? `Caso #${caseId}`}</Typography>
            <Typography variant="body2" color="text.secondary">{caseData?.description}</Typography>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Documentos</Typography>
                <Grid container spacing={2}>
                    {(documents ?? []).map((doc) => (
                        <Grid item xs={12} md={6} key={doc.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="subtitle1">{doc.name ?? `Documento #${doc.id}`}</Typography>
                                    <Typography variant="body2" color="text.secondary">{doc.changelog}</Typography>
                                    <Button onClick={() => handleDownload(doc.id, doc.file_name)}>Download</Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 2 }}>
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                        style={{ width: '100%', marginBottom: '8px' }}
                    />
                    <TextField
                        placeholder="Descrição da versão"
                        fullWidth
                        value={changelog}
                        onChange={(e) => setChangelog(e.target.value)}
                        sx={{ mb: 1 }}
                    />
                    <Button variant="contained" onClick={() => uploadMutation.mutate()}>Enviar nova versão</Button>
                </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
                <CommentThread caseId={numericCaseId} />
            </Box>
        </Box>
    );
}
