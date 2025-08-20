import { Card, CardContent, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CaseCardProps {
  id: number;
  title: string;
  description?: string;
}

export default function CaseCard({ id, title, description }: CaseCardProps) {
  const navigate = useNavigate();

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {description || "Sem descrição"}
        </Typography>
        <Button sx={{ mt: 1 }} onClick={() => navigate(`/cases/${id}`)}>
          Ver Detalhes
        </Button>
      </CardContent>
    </Card>
  );
}
