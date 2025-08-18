// src/layouts/AppLayout.tsx
import { Box, Toolbar, Container } from "@mui/material";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo principal */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <Topbar />

        {/* Área de conteúdo */}
        <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
          <Toolbar />
          <Container
            maxWidth="xl"
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 1,
              p: { xs: 2, md: 3 },
              minHeight: "calc(100vh - 128px)", // ocupa altura total menos topbar+toolbar
            }}
          >
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
}
