import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ComparisonsAPI } from '../../api/client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import SideBySideViewer from '../../components/analysis/SideBySideViewer';

export default function ComparisonDetail() {
  const { comparisonId } = useParams();
  const { data } = useQuery({ queryKey:['comparison', comparisonId], queryFn: () => ComparisonsAPI.detailResult(Number(comparisonId)) });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Comparação #{comparisonId}</Typography>
      <Typography variant="body2" color="text.secondary">Similaridade: {data?.similarity_score?.toFixed?.(3) ?? '—'}</Typography>

      <SideBySideViewer leftUrl={data?.pattern_file_url} rightUrl={data?.document_file_url} height={300} />

      <Card sx={{ mt:2 }}>
        <CardContent>
          <Typography variant="subtitle1">Resultado Automático</Typography>
          <Typography variant="body2" whiteSpace="pre-wrap">{data?.automatic_result ?? 'Sem resultado automático'}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
