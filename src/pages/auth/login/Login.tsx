import { useEffect, useState } from "react";
import Navbar from "../../../components/global/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoadnig, setUser } from "./../../../../redux/authSlice";
import axiosInstance from "../../../utils/axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/validators/auth.schema";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store: any) => store.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user?.email) {
      const from = (location.state as any)?.from;
      const fromPath = typeof from === "string" ? from : from?.pathname;
      navigate(fromPath || "/", { replace: true });
    }
  }, [user, navigate, location.state]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      dispatch(setLoadnig(true));

      const res = await axiosInstance.post("/user/login", data, {
        withCredentials: true,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success("Login successful");

        const from = (location.state as any)?.from;
        const fromPath = typeof from === "string" ? from : from?.pathname;
        navigate(fromPath || "/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoadnig(false));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Paper elevation={8} sx={{ p: 4, borderRadius: 4 }}>
            <Stack spacing={3}>
              <Typography variant="h4" fontWeight={800} textAlign="center">
                Login to your account
              </Typography>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />

                  <TextField
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff size={20} />
                            ) : (
                              <Eye size={20} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    fullWidth
                    endIcon={
                      loading ? <CircularProgress size={18} /> : undefined
                    }
                  >
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <Typography variant="body2" textAlign="center">
                    Don&apos;t have an account?{" "}
                    <Button component={Link} to="/signup" variant="text">
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
