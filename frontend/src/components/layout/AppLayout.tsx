import { Box, Toolbar, Container } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <Topbar/>
      <Sidebar/>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar/>
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
