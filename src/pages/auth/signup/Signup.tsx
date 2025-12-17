import type React from "react";
import { useEffect, useState } from "react";
import Navbar from "../../../components/global/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoadnig, setUser } from "./../../../../redux/authSlice";
import axiosInstance from "@/utils/axios";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export default function Signup() {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    // confirmPassword: "",
    phoneNumber: "",
    role: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store: any) => store.auth);

  useEffect(() => {
    if (user && (user as any).email) {
      const redirectTo = (location.state as any)?.from;
      navigate(redirectTo || "/", { replace: true });
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

    const payload = {
      fullName: input.fullName,
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      role: input.role,
    };

    try {
      dispatch(setLoadnig(true));
      const res = await axiosInstance.post(`/user/register`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token)
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        const redirectTo = (location.state as any)?.from;
        navigate(redirectTo || "/");
        dispatch(setLoadnig(false));
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Error during signup" + error);
      dispatch(setLoadnig(false));
    }
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
                  Create an Account
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
                  Join Job Plus to find your dream job
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    id="name"
                    name="fullName"
                    label="Full Name"
                    placeholder="Full name"
                    value={input.fullName}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

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

                  <TextField
                    id="phoneNumber"
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="+92123456789"
                    value={input.phoneNumber}
                    onChange={handleChange}
                    required
                    fullWidth
                  />

                  <FormControl>
                    <FormLabel id="role-label">I am a</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="role-label"
                      name="role"
                      value={input.role}
                      onChange={handleChange}
                    >
                      <FormControlLabel value="student" control={<Radio />} label="Student" />
                      <FormControlLabel value="recruiter" control={<Radio />} label="Recruiter" />
                    </RadioGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={Boolean(loading)}
                    fullWidth
                    endIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    {loading ? "Loading..." : "Create Account"}
                  </Button>

                  <Typography variant="body2" textAlign="center" sx={{ color: "text.secondary" }}>
                    Already have an account?{" "}
                    <Button
                      component={Link}
                      to="/login"
                      variant="text"
                      sx={{ textTransform: "none", px: 0.5, minWidth: 0, fontWeight: 700 }}
                    >
                      Sign in
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
