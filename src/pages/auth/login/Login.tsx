import type React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../../components/global/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoadnig, setUser } from "./../../../../redux/authSlice";
import axiosInstance from "../../../utils/axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  console.log("input", input);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (user && user.email) {
      const from = (location.state as any)?.from;
      const fromPath = typeof from === "string" ? from : from?.pathname;
      navigate(fromPath || "/", { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setInput((input) => ({ ...input, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      dispatch(setLoadnig(true));
      const res = await axiosInstance.post(`/user/login`, input);
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        dispatch(setUser(res.data.user));
        toast.success("Login successful");
        const from = (location.state as any)?.from;
        const fromPath = typeof from === "string" ? from : from?.pathname;
        navigate(fromPath || "/");
      }
    } catch (error) {
      console.error("Error during Login:", error);
      toast.error("Login failed. Please check your credentials.");
      dispatch(setLoadnig(false));
    } finally {
      dispatch(setLoadnig(false));
    }
    console.log("login submitted:", input);
  };

  return (
    <div className="min-h-screen flex flex-col bgMain-gradient">
      <Navbar />
      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 4, bgcolor: "rgba(255,255,255,0.92)" }}>
            <Stack spacing={3}>
              <Box textAlign="center">
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  Login an Account
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="name@example.com"
                    value={input.email}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <TextField
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="••••••••"
                    value={input.password}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={Boolean(loading)}
                    fullWidth
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    {loading ? "Loading..." : "Login"}
                  </Button>

                  <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary" }}>
                    Don't have an account?{" "}
                    <Button
                      component={Link}
                      to="/signup"
                      variant="text"
                      sx={{ textTransform: "none", px: 0.5, minWidth: 0, fontWeight: 700 }}
                    >
                      Sign Up
                    </Button>
                  </Typography>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </div>
  );
}
