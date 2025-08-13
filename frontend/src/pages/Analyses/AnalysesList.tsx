import { useQuery } from '@tanstack/react-query';
import { AnalysesAPI } from '../../api/client';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function AnalysesList() {
  const [search, setSearch] = useState('');
  const [caseIdFilter, setCaseIdFilter] = useState('');
  const { data } = useQuery({ queryKey: ['analyses', search, caseIdFilter], queryFn: () => AnalysesAPI.list({ search, case: caseIdFilter }) });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Análises</Typography>

      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <TextField placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} />
        <TextField placeholder="ID do Caso..." value={caseIdFilter} onChange={e=>setCaseIdFilter(e.target.value)} />
        <Button component={Link} to="/cases">Ver Casos</Button>
      </Box>

      <Grid container spacing={2}>
        {(data ?? []).map((analysis:any) => (
          <Grid item xs={12} md={6} lg={4} key={analysis.id}>
            <Card component={Link} to={`/analyses/${analysis.id}`} sx={{ textDecoration:'none' }}>
              <CardContent>
                <Typography variant="subtitle1">Análise #{analysis.id}</Typography>
                <Typography variant="body2">Caso: {analysis.case}</Typography>
                <Typography variant="body2">{analysis.summary ?? 'Sem resumo'}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
