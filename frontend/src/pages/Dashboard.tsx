import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Box,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import SearchIcon from "@mui/icons-material/Search";
import HelpIcon from "@mui/icons-material/Help";
import CompareIcon from "@mui/icons-material/CompareArrows";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Casos",
    description: "Visualizar e gerenciar todos os casos.",
    icon: <FolderIcon fontSize="large" color="primary" />,
    to: "/cases",
  },
  {
    title: "Análises",
    description: "Visualizar e criar análises dentro dos casos.",
    icon: <SearchIcon fontSize="large" color="primary" />,
    to: "/analyses",
  },
  {
    title: "Quesitos",
    description: "Responder ou acompanhar quesitos dos peritos.",
    icon: <HelpIcon fontSize="large" color="primary" />,
    to: "/quesitos",
  },
  {
    title: "Comparações",
    description: "Acessar comparações de documentos lado a lado.",
    icon: <CompareIcon fontSize="large" color="primary" />,
    to: "/comparisons",
  },
];

export default function Dashboard() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Bem-vindo ao sistema! Acesse rapidamente os módulos:
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {modules.map((mod) => (
          <Grid item xs={12} sm={6} md={3} key={mod.title}>
            <Card elevation={3} sx={{ borderRadius: 2 }}>
              <CardActionArea component={Link} to={mod.to}>
                <CardContent sx={{ textAlign: "center" }}>
                  {mod.icon}
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {mod.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mod.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
