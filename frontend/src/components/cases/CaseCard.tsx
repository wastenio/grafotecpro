// src/components/cases/CaseCard.tsx
import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CaseCardProps {
  id: number;
  title: string;
  description?: string;
  status: string;
  created_at: string;
}

export default function CaseCard({ id, title, description, status, created_at }: CaseCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description || "Sem descrição"}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
          Status: {status} | Criado em: {new Date(created_at).toLocaleString()}
        </Typography>
        <Button sx={{ mt: 1 }} onClick={() => navigate(`/cases/${id}`)}>
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
