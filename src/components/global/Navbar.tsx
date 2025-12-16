"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { User, LogOut, Menu as MenuIcon, Bell } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../../redux/authSlice"
import axiosInstance from "@/utils/axios";
import {
  markAllReadLocal,
  markNotificationReadLocal,
  setNotificationLoading,
  setNotifications,
  setUnreadCount,
} from "../../../redux/notificationSlice";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

type NavbarVariant = "default" | "landing";

export default function Navbar({ variant = "default" }: { variant?: NavbarVariant }) {
  const { user } = useSelector((store: any) => store.auth);
  const { notifications, unreadCount } = useSelector((store: any) => store.notification);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pollRef = useRef<number | null>(null);

  const isRecruiter = useMemo(() => user?.role === "recruiter", [user?.role]);
  const isLanding = variant === "landing";

  const fetchNotifications = async () => {
    if (!user?._id) return;
    try {
      dispatch(setNotificationLoading(true));
      const res = await axiosInstance.get("/notification/get", { withCredentials: true });
      if (res.data?.success) {
        dispatch(setNotifications(res.data.notifications || []));
        dispatch(setUnreadCount(res.data.unreadCount ?? 0));
      }
    } catch {
      // ignore
    } finally {
      dispatch(setNotificationLoading(false));
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    // initial fetch
    fetchNotifications();
    // poll every 30s
    pollRef.current = window.setInterval(fetchNotifications, 30000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [user?._id]);

  const handleLogout = async () => {

    try {
      const res = await axiosInstance.get(`/user/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.removeItem("token")
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        boxShadow: "none",
        backgroundColor: "transparent",
        color: isLanding ? "#fff" : "text.primary",
        backdropFilter: "none",
        borderBottom: "none",
      }}
    >
      <Container maxWidth={false} sx={{ pt: 1.25, pb: 1.25, px: 0 }}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 1320,
            marginLeft: { xs: 2, sm: 6, md: 9 },
            marginRight: { xs: 3, sm: 6, md: 9 },
            paddingLeft: { xs: 2, sm: 3, md: 4 },
            paddingRight: { xs: 2, sm: 3, md: 4 },
            paddingTop: { xs: 0.1, sm: 0.2 },
            paddingBottom: { xs: 0.1, sm: 0.2 },
            borderRadius: 999,
            backgroundColor: isLanding ? "rgba(11,16,47,0.30)" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
            border: isLanding ? "1px solid rgba(255,255,255,0.16)" : "1px solid rgba(0,0,0,0.06)",
            boxShadow: isLanding ? "0 14px 40px rgba(0,0,0,0.32)" : "0 14px 40px rgba(15,23,42,0.12)",
          }}
        >
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                sx={{ textTransform: "none", p: 0, minWidth: 0 }}
              >
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>
                    Job Plus
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.75, color: isLanding ? "rgba(255,255,255,0.85)" : undefined }}>
                    Find Your Dream Career
                  </Typography>
                </Box>
              </Button>
            </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, flex: 1, justifyContent: "center" }}>
            {isRecruiter ? (
              <>
                <Button
                  component={RouterLink}
                  to="/recruiter/dashboard"
                  color="inherit"
                  sx={{ textTransform: "none" }}
                >
                  My Companies
                </Button>
                <Button
                  component={RouterLink}
                  to="/recruiter/dashboard"
                  color="inherit"
                  sx={{ textTransform: "none" }}
                >
                  My Jobs
                </Button>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/" color="inherit" sx={{ textTransform: "none" }}>
                  Home
                </Button>
                <Button component={RouterLink} to="/jobs" color="inherit" sx={{ textTransform: "none" }}>
                  Jobs
                </Button>
                <Button component={RouterLink} to="/browser" color="inherit" sx={{ textTransform: "none" }}>
                  Browser
                </Button>
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}>
            {user ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={(e) => {
                    setNotificationAnchor(e.currentTarget);
                    fetchNotifications();
                  }}
                >
                  <Badge color="error" badgeContent={unreadCount} overlap="circular">
                    <Bell size={20} />
                  </Badge>
                </IconButton>

                <IconButton
                  onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                  sx={{
                    p: 0.5,
                    border: isLanding ? "2px solid rgba(255,255,255,0.35)" : "2px solid rgba(0,0,0,0.12)",
                  }}
                >
                  <Avatar
                    src={user.profile || "/placeholder.svg"}
                    alt={user.fullName}
                    sx={{ width: 32, height: 32 }}
                  >
                    {user.fullName?.[0] ?? "U"}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
                <Button component={RouterLink} to="/login" color="inherit" sx={{ textTransform: "none" }}>
                  Login
                </Button>
                <Button component={RouterLink} to="/signup" color="inherit" sx={{ textTransform: "none" }}>
                  Join Now
                </Button>
              </Box>
            )}

            <IconButton
              sx={{ display: { xs: "inline-flex", md: "none" } }}
              onClick={() => setIsOpen(true)}
            >
              <MenuIcon size={22} />
            </IconButton>
          </Box>
        </Toolbar>
        </Box>
      </Container>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={() => setUserMenuAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            setUserMenuAnchor(null);
            navigate("/profile");
          }}
        >
          <User size={16} style={{ marginRight: 8 }} />
          Profile
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setUserMenuAnchor(null);
            await handleLogout();
          }}
        >
          <LogOut size={16} style={{ marginRight: 8 }} />
          Logout
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={() => setNotificationAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{ sx: { width: 360, maxWidth: "90vw" } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          <Button
            size="small"
            onClick={async () => {
              try {
                await axiosInstance.post("/notification/read-all", {}, { withCredentials: true });
                dispatch(markAllReadLocal());
              } catch {
                // ignore
              }
            }}
          >
            Mark all read
          </Button>
        </Box>
        <Divider />

        {(!notifications || notifications.length === 0) ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              No notifications yet.
            </Typography>
          </Box>
        ) : (
          notifications.slice(0, 10).map((n: any) => (
            <MenuItem
              key={n._id}
              onClick={async () => {
                try {
                  await axiosInstance.post(`/notification/${n._id}/read`, {}, { withCredentials: true });
                  dispatch(markNotificationReadLocal(n._id));
                } catch {
                  // ignore
                }
              }}
              sx={{
                whiteSpace: "normal",
                alignItems: "flex-start",
                gap: 1,
                backgroundColor: n.isRead ? "transparent" : "rgba(10,102,194,0.06)",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {n.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {n.message}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>

      <Drawer anchor="right" open={isOpen} onClose={() => setIsOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
          </Box>
          <Divider />
          <List>
            {isRecruiter ? (
              <>
                <ListItemButton component={RouterLink} to="/recruiter/dashboard" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="My Companies" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/recruiter/dashboard" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="My Jobs" />
                </ListItemButton>
              </>
            ) : (
              <>
                <ListItemButton component={RouterLink} to="/" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="Home" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/jobs" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="Jobs" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/browser" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="Browser" />
                </ListItemButton>
              </>
            )}
          </List>

          {!user ? (
            <>
              <Divider />
              <List>
                <ListItemButton component={RouterLink} to="/login" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="Login" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/signup" onClick={() => setIsOpen(false)}>
                  <ListItemText primary="Join Now" />
                </ListItemButton>
              </List>
            </>
          ) : null}
        </Box>
      </Drawer>
    </AppBar>
  );
}