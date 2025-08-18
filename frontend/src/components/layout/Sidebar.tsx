// src/layouts/Sidebar.tsx
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiFolder, FiFileText, FiMessageSquare, FiLogOut } from "react-icons/fi";

const drawerWidth = 240;

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { to: "/cases", label: "Casos", icon: <FiFolder /> },
    { to: "/analyses", label: "Análises", icon: <FiFileText /> },
    { to: "/comments", label: "Comentários", icon: <FiMessageSquare /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold" noWrap>
          Painel
        </Typography>
      </Toolbar>
      <Divider />

      {/* Menu de navegação */}
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={pathname.startsWith(item.to)}
            sx={{
              borderRadius: 2,
              mx: 1,
              my: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "primary.contrastText",
                "& .MuiListItemIcon-root": {
                  color: "primary.contrastText",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider />

      {/* Botão de Logout */}
      <List>
        <ListItemButton
          onClick={() => navigate("/logout")}
          sx={{
            borderRadius: 2,
            mx: 1,
            my: 0.5,
            "&:hover": {
              bgcolor: "error.light",
              color: "error.contrastText",
              "& .MuiListItemIcon-root": {
                color: "error.contrastText",
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <FiLogOut />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Drawer>
  );
}
