import { useQuery } from '@tanstack/react-query';
import { CasesAPI } from '../../api/client';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function CasesList() {
  const [search, setSearch] = useState('');
  const { data } = useQuery({ queryKey: ['cases', search], queryFn: () => CasesAPI.list({ search }) });

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Casos</Typography>
      <Box sx={{ display:'flex', gap:2, mb:2 }}>
        <TextField placeholder="Buscar..." value={search} onChange={(e)=>setSearch(e.target.value)} />
        <Button component={Link} to="/analyses">Ver análises</Button>
      </Box>
      <Grid container spacing={2}>
        {(data ?? []).map((c:any)=>(
          <Grid item xs={12} md={6} lg={4} key={c.id}>
            <Card component={Link} to={`/cases/${c.id}`} sx={{ textDecoration:'none' }}>
              <CardContent>
                <Typography variant="h6">{c.title ?? `Caso #${c.id}`}</Typography>
                <Typography variant="body2" color="text.secondary">{c.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
