// src/layouts/Topbar.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Tooltip,
  Box,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";

export default function Topbar() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user); // se já tiver user no store
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "primary.main",
        color: "primary.contrastText",
      }}
    >
      <Toolbar>
        {/* Botão de menu para mobile (caso Sidebar seja colapsável futuramente) */}
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Título / Branding */}
        <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Perícia Grafotécnica
        </Typography>

        {/* Avatar do usuário com menu */}
        <Box>
          <Tooltip title="Conta">
            <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 2 }}>
              <Avatar
                sx={{
                  bgcolor: "secondary.main",
                  width: 36,
                  height: 36,
                  fontSize: 14,
                }}
              >
                {user?.name?.[0] || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Menu do usuário */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { mt: 1.5, minWidth: 180 },
          }}
        >
          <Typography variant="body2" sx={{ px: 2, py: 1 }}>
            {user?.name || "Usuário"}
          </Typography>
          <Divider />
          <MenuItem onClick={logout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Sair
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
