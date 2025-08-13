import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { CommentsAPI } from '../../api/client';

export default function CommentThread({ caseId, analysisId }:{ caseId?: number; analysisId?: number; }) {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState('');

  const reload = async () => {
    const data = await CommentsAPI.list({ case: caseId, analysis: analysisId, root_only: true });
    setItems(data);
  };

  const send = async (parent?: number) => {
    await CommentsAPI.create({ case: caseId, analysis: analysisId, parent, text });
    setText('');
    reload();
  };

  return (
    <Box>
      <Typography variant="h6">Comentários</Typography>
      <Card sx={{ mb:2 }}>
        <CardContent>
          <TextField placeholder="Escreva um comentário..." value={text} onChange={(e)=>setText(e.target.value)} multiline minRows={2}/>
          <Button sx={{ mt:1 }} onClick={()=>send()}>Enviar</Button>
        </CardContent>
      </Card>

      {items.map((c)=>(
        <Card key={c.id} sx={{ mb:1 }}>
          <CardContent>
            <Typography variant="subtitle2">{c.author_name ?? c.author_email}</Typography>
            <Typography variant="body2" whiteSpace="pre-wrap">{c.text}</Typography>
            <Button size="small" onClick={()=>{ setText(`@${c.author_email} `); }}>Responder</Button>
            {(c.replies ?? []).map((r:any)=>(
              <Box key={r.id} sx={{ ml:2, mt:1, p:1, borderLeft:'2px solid #ddd' }}>
                <Typography variant="subtitle2">{r.author_name ?? r.author_email}</Typography>
                <Typography variant="body2">{r.text}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
