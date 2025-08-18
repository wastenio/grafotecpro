import { Drawer, List, ListItemButton, ListItemText, Toolbar, Divider } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{ width: 240, [`& .MuiDrawer-paper`]: { width: 240 } }}
    >
      <Toolbar />
      <List>
        {[ 
          { to: '/cases', label: 'Casos' },
          { to: '/analyses', label: 'Análises' },
          { to: '/comments', label: 'Comentários' },
        ].map(item => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={pathname.startsWith(item.to)}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}

        {/* Divider antes do Logout */}
        <Divider sx={{ my: 1 }} />

        {/* Botão de Logout */}
        <ListItemButton onClick={() => navigate("/logout")}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
