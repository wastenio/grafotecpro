import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../store/authStore';

export default function Topbar() {
  const logout = useAuthStore(s => s.logout);
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Perícia Grafotécnica</Typography>
        <IconButton color="inherit" onClick={logout}><LogoutIcon/></IconButton>
      </Toolbar>
    </AppBar>
  );
}
