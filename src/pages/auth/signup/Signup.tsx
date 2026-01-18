import { useEffect, useState } from "react";
import Navbar from "../../../components/global/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoadnig, setUser } from "./../../../../redux/authSlice";
import axiosInstance from "@/utils/axios";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/validators/auth.schema";

import {
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store: any) => store.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  useEffect(() => {
    if (user?.email) {
      const redirectTo = (location.state as any)?.from;
      navigate(redirectTo || "/", { replace: true });
    }
  }, [user, navigate, location.state]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      dispatch(setLoadnig(true));

      const res = await axiosInstance.post("/user/register", data, {
        withCredentials: true,
      });

      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
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
              <Box textAlign="center">
                <Typography variant="h4" fontWeight={800}>
                  Create an Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Join Job Plus to find your dream job
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                  <TextField
                    label="Full Name"
                    {...register("fullName")}
                    error={!!errors.fullName}
                    helperText={errors.fullName?.message}
                    fullWidth
                  />

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

                  <TextField
                    label="Phone Number"
                    {...register("phoneNumber")}
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber?.message}
                    fullWidth
                  />

                  <FormControl error={!!errors.role}>
                    <FormLabel>I am a</FormLabel>
                    <RadioGroup row {...register("role")}>
                      <FormControlLabel
                        value="student"
                        control={<Radio />}
                        label="Student"
                      />
                      <FormControlLabel
                        value="recruiter"
                        control={<Radio />}
                        label="Recruiter"
                      />
                    </RadioGroup>
                    {errors.role && (
                      <Typography color="error" variant="caption">
                        {errors.role.message}
                      </Typography>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    fullWidth
                    endIcon={
                      loading ? (
                        <CircularProgress size={18} color="inherit" />
                      ) : undefined
                    }
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>

                  <Typography variant="body2" align="center">
                    Already have an account?{" "}
                    <Button component={Link} to="/login" variant="text">
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
