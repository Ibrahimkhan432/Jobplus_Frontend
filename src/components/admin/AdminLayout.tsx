import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import WorkIcon from "@mui/icons-material/Work";
import ReportIcon from "@mui/icons-material/Report";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MenuIcon from "@mui/icons-material/Menu";
import { useMemo, useState, type ReactNode } from "react";

const drawerWidth = 260;

type AdminNavItem = {
  label: string;
  to: string;
  icon: ReactNode;
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: AdminNavItem[] = useMemo(
    () => [
      { label: "Overview", to: "/admin", icon: <DashboardIcon /> },
      { label: "Users", to: "/admin/users", icon: <GroupIcon /> },
      { label: "Jobs", to: "/admin/jobs", icon: <WorkIcon /> },
      { label: "Reports", to: "/admin/reports", icon: <ReportIcon /> },
      { label: "Categories", to: "/admin/categories", icon: <CategoryIcon /> },
      { label: "Settings", to: "/admin/settings", icon: <SettingsIcon /> },
    ],
    []
  );

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ px: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800 }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            end={item.to === "/admin"}
            onClick={() => setMobileOpen(false)}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              "&.active": {
                bgcolor: "rgba(25, 118, 210, 0.12)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flex: 1 }} />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <ListItemButton
          onClick={() => navigate("/")}
          sx={{ borderRadius: 2, bgcolor: "rgba(0,0,0,0.03)" }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary="Back to site" />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7f9fc" }}>
      <CssBaseline />
      <AppBar position="fixed" elevation={0} sx={{ bgcolor: "#fff", color: "text.primary", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen((v) => !v)}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Jobplus Admin
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
