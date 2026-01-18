"use client";

import React, { useEffect, useRef, useState } from "react";
import { User, LogOut, Menu as MenuIcon, Bell } from "lucide-react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setUser } from "../../../redux/authSlice";
import axiosInstance from "@/utils/axios";
import ProfileCompletionBanner from "./ProfileCompletionBanner";
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

export default function Navbar({
  variant = "default",
}: {
  variant?: NavbarVariant;
}) {
  const { user } = useSelector((store: any) => store.auth);
  const { notifications, unreadCount } = useSelector(
    (store: any) => store.notification
  );
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
  const [notificationAnchor, setNotificationAnchor] =
    useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pollRef = useRef<number | null>(null);

  const isLanding = variant === "landing";

  const fetchNotifications = async () => {
    if (!user?._id) return;
    try {
      dispatch(setNotificationLoading(true));
      const res = await axiosInstance.get("/notification/get", {
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setNotifications(res.data.notifications || []));
        dispatch(setUnreadCount(res.data.unreadCount ?? 0));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setNotificationLoading(false));
    }
  };

  useEffect(() => {
    if (!user?._id) return;
    fetchNotifications();
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
        localStorage.removeItem("token");
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <>
      <ProfileCompletionBanner />
      <AppBar
        position="sticky"
        sx={{
          boxShadow: "none",
          backgroundColor: "transparent",
          color: isLanding ? "#fff" : "text.primary",
          backdropFilter: "none",
          borderBottom: "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            px: { xs: 2, sm: 4, md: 6 },
          }}
        >
          <Box
            sx={{
              marginTop: 2,
              width: "100%",
              maxWidth: 1320,
              borderRadius: 999,
              backgroundColor: isLanding
                ? "rgba(255, 255, 255, 0.75)"
                : "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(12px)",
              border: "2px solid #1976d2",
              boxShadow: "0 14px 40px rgba(15,23,42,0.12)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Toolbar
              disableGutters
              sx={{
                minHeight: 64,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: { xs: 1, sm: 2, md: 3 },
              }}
            >
``              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1 }}
              >
                <Button
                  component={RouterLink}
                  to="/"
                  color="primary"
                  sx={{ textTransform: "none", p: 0, minWidth: 0 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 900, lineHeight: 1 }}
                    >
                      Job Plus
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        opacity: 0.75,
                        color: isLanding
                          ? "rgba(13, 16, 161, 0.85)"
                          : undefined,
                      }}
                    >
                      Find Your Dream Career
                    </Typography>
                  </Box>
                </Button>
              </Box>

              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 2,
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <React.Fragment>
                  {user?.role === "recruiter" ? (
                    <React.Fragment>
                      <Button
                        component={RouterLink}
                        to="/recruiter/dashboard"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Dashboard
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/recruiter/dashboard"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Posted Jobs
                      </Button>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <Button
                        component={RouterLink}
                        to="/"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Home
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/jobs"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Jobs
                      </Button>
                      <Button
                        component={RouterLink}
                        to="/browser"
                        color="primary"
                        sx={{ textTransform: "none" }}
                      >
                        Browser
                      </Button>
                    </React.Fragment>
                  )}
                </React.Fragment>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  flex: 1,
                  justifyContent: "flex-end",
                }}
              >
                {user ? (
                  <>
                    <IconButton
                      color="inherit"
                      onClick={(e) => {
                        setNotificationAnchor(e.currentTarget);
                        fetchNotifications();
                      }}
                    >
                      <Badge
                        color="error"
                        badgeContent={unreadCount}
                        overlap="circular"
                      >
                        <Bell size={20} />
                      </Badge>
                    </IconButton>

                    <IconButton
                      onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                      sx={{
                        p: 0.5,
                        border: "2px solid rgba(25, 118, 210, 0.3)", // Blue tint border
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
                  <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
                    <Button
                      component={RouterLink}
                      to="/login"
                      color="primary"
                      sx={{
                        textTransform: "none",
                        border: "1px solid rgba(25, 118, 210, 0.5)",
                        px: 2,
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={RouterLink}
                      to="/signup"
                      color="primary"
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        px: 2,
                      }}
                    >
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
        </Box>

        {/* User Menu */}
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
          PaperProps={{
            sx: {
              width: 360,
              maxWidth: "90vw",
              border: "1px solid #1976d2",
            },
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Notifications
            </Typography>
            <Button
              size="small"
              onClick={async () => {
                try {
                  await axiosInstance.post(
                    "/notification/read-all",
                    {},
                    { withCredentials: true }
                  );
                  dispatch(markAllReadLocal());
                } catch {}
              }}
            >
              Mark all read
            </Button>
          </Box>
          <Divider />

          {!notifications || notifications.length === 0 ? (
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
                    await axiosInstance.post(
                      `/notification/${n._id}/read`,
                      {},
                      { withCredentials: true }
                    );
                    dispatch(markNotificationReadLocal(n._id));
                  } catch {}
                }}
                sx={{
                  whiteSpace: "normal",
                  alignItems: "flex-start",
                  gap: 1,
                  backgroundColor: n.isRead
                    ? "transparent"
                    : "rgba(25, 118, 210, 0.08)", // Blue tint for unread
                  "&:hover": {
                    backgroundColor: "rgba(25, 118, 210, 0.12)", // Blue tint on hover
                  },
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
        <Drawer
          anchor="right"
          open={isOpen}
          onClose={() => setIsOpen(false)}
          PaperProps={{
            sx: {
              borderLeft: "2px solid #1976d2",
            },
          }}
        >
          <Box sx={{ width: 260 }} role="presentation">
            <Box sx={{ p: 2 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, color: "#1976d2" }}
              >
                Menu
              </Typography>
            </Box>
            <Divider />
            <List>
              {user?.role === "recruiter" ? (
                <React.Fragment>
                  <ListItemButton
                    component={RouterLink}
                    to="/recruiter/dashboard"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/recruiter/dashboard"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Posted Jobs" />
                  </ListItemButton>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <ListItemButton
                    component={RouterLink}
                    to="/"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Home" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/jobs"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Jobs" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/browser"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Browser" />
                  </ListItemButton>
                </React.Fragment>
              )}
            </List>

            {!user ? (
              <React.Fragment>
                <Divider />
                <List>
                  <ListItemButton
                    component={RouterLink}
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                      },
                    }}
                  >
                    <ListItemText primary="Login" />
                  </ListItemButton>
                  <ListItemButton
                    component={RouterLink}
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    sx={{
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.2)",
                      },
                    }}
                  >
                    <ListItemText
                      primary="Join Now"
                      primaryTypographyProps={{
                        sx: { color: "#1976d2", fontWeight: 600 },
                      }}
                    />
                  </ListItemButton>
                </List>
              </React.Fragment>
            ) : null}
          </Box>
        </Drawer>
      </AppBar>
    </>
  );
}
