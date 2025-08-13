import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AnalysesAPI, ComparisonsAPI, QuesitosAPI } from '../../api/client';
import { Box, Button, Card, CardContent, Divider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SideBySideViewer from '../../components/analysis/SideBySideViewer';

export default function AnalysisDetail() {
  const { analysisId } = useParams();

  const { data: analysis } = useQuery({
    queryKey: ['analysis', analysisId],
    queryFn: () => AnalysesAPI.get(Number(analysisId)),
  });

  const { data: comparisons } = useQuery({
    queryKey: ['comparisons', analysisId],
    queryFn: () => ComparisonsAPI.listByAnalysis(Number(analysisId)),
  });

  const { data: quesitos } = useQuery({
    queryKey: ['quesitos', analysis?.case],
    queryFn: () => QuesitosAPI.listByCase(Number(analysis?.case)),
    enabled: !!analysis?.case,
  });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Análise #{analysisId}
      </Typography>

      <Grid container spacing={2}>
        {/* Comparações */}
        <Grid xs={12} lg={7}>
          <Typography variant="h6" gutterBottom>
            Comparações
          </Typography>
          <Grid container spacing={2}>
            {(comparisons ?? []).map((cmp: any) => (
              <Grid xs={12} key={cmp.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Similaridade: {cmp.similarity_score?.toFixed?.(3) ?? '—'}
                    </Typography>
                    <SideBySideViewer
                      leftUrl={cmp.pattern_file_url || cmp.pattern_version_detail?.file_name}
                      rightUrl={cmp.document_file_url || cmp.document_version_detail?.file_name}
                    />
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" whiteSpace="pre-wrap">
                      {cmp.automatic_result ?? 'Sem análise automática.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Quesitos */}
        <Grid xs={12} lg={5}>
          <Typography variant="h6" gutterBottom>
            Quesitos
          </Typography>
          <Grid container spacing={2}>
            {(quesitos ?? []).map((q: any) => (
              <Grid xs={12} key={q.id}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{q.text}</Typography>
                    <TextField
                      defaultValue={q.answered_text ?? ''}
                      fullWidth
                      multiline
                      minRows={2}
                      onBlur={(e) => QuesitosAPI.update(q.id, { answered_text: e.target.value })}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {q.answered_by_email ? `Respondido por: ${q.answered_by_email}` : 'Aguardando resposta'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            sx={{ mt: 2 }}
            onClick={async () => {
              if (!analysis?.case) return;
              const blob = await AnalysesAPI.exportPdf(Number(analysis.case)).then((r) => r.data);
              const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
              const a = document.createElement('a');
              a.href = url;
              a.download = `laudo_caso_${analysis.case}.pdf`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
          >
            Exportar Laudo (PDF)
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
