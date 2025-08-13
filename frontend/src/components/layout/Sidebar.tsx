import { Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { pathname } = useLocation();
  return (
    <Drawer variant="permanent" sx={{ width: 240, [`& .MuiDrawer-paper`]: { width: 240 } }}>
      <Toolbar/>
      <List>
        {[
          { to: '/cases', label: 'Casos' },
          { to: '/analyses', label: 'Análises' },
          { to: '/comments', label: 'Comentários' },
        ].map(item => (
          <ListItemButton key={item.to} component={Link} to={item.to} selected={pathname.startsWith(item.to)}>
            <ListItemText primary={item.label}/>
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
