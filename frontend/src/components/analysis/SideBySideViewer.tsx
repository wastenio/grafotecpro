import { Box, Paper } from '@mui/material';
import { useState } from 'react';

type Props = { leftUrl?: string | null; rightUrl?: string | null; height?: number; };
export default function SideBySideViewer({ leftUrl, rightUrl, height = 260 }: Props) {
  const [zoom, setZoom] = useState(1);

  const Img = ({ src }:{src?:string|null}) => (
    <Box sx={{ overflow:'auto', border:'1px solid', borderColor:'divider', height }}>
      {src ? <img src={src} style={{ transform:`scale(${zoom})`, transformOrigin:'top left', display:'block' }} /> : 'Sem imagem'}
    </Box>
  );

  return (
    <Paper sx={{ p:1 }}>
      <Box sx={{ display:'flex', gap:1, mb:1 }}>
        <input type="range" min={0.5} max={3} step={0.1} value={zoom} onChange={(e)=>setZoom(Number(e.target.value))}/>
      </Box>
      <Box sx={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1 }}>
        <Img src={leftUrl ?? undefined} />
        <Img src={rightUrl ?? undefined} />
      </Box>
    </Paper>
  );
}
