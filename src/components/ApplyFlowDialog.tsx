import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import axiosInstance from "@/utils/axios";
import { setUser } from "../../redux/authSlice";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Props = {
  jobId: string;
  trigger: ReactNode;
  onApplied?: () => void | Promise<void>;
};

type ApplyFormState = {
  applicantName: string;
  expectedSalary: string;
  location: string;
  resumeFile: File | null;
};

type AuthMode = "login" | "signup";

type LoginState = {
  email: string;
  password: string;
};

type SignupState = {
  fullName: string;
  email: string;
  password: string;
};

export default function ApplyFlowDialog({ jobId, trigger, onApplied }: Props) {
  const dispatch = useDispatch();
  const { user } = useSelector((store: any) => store.auth);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [applyForm, setApplyForm] = useState<ApplyFormState>({
    applicantName: "",
    expectedSalary: "",
    location: "",
    resumeFile: null,
  });

  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginForm, setLoginForm] = useState<LoginState>({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState<SignupState>({
    fullName: "",
    email: "",
    password: "",
  });

  const isLoggedIn = useMemo(() => Boolean(user?._id), [user]);

  useEffect(() => {
    if (!isApplyOpen) return;
    setApplyForm((prev) => ({
      ...prev,
      applicantName: prev.applicantName || user?.fullName || "",
    }));
  }, [isApplyOpen, user?.fullName]);

  const submitApplication = async () => {
    if (!jobId) return;

    const fd = new FormData();
    fd.append("applicantName", applyForm.applicantName);
    fd.append("expectedSalary", applyForm.expectedSalary);
    fd.append("location", applyForm.location);
    if (applyForm.resumeFile) {
      fd.append("file", applyForm.resumeFile);
    }

    const res = await axiosInstance.post(`/application/apply/${jobId}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });

    if (res.data.success) {
      toast.success(res.data.message || "Applied successfully");
      if (typeof onApplied === "function") {
        await onApplied();
      }
      setIsAuthOpen(false);
      setIsApplyOpen(false);
    } else {
      toast.error(res.data.message || "Failed to apply");
    }
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!applyForm.applicantName || !applyForm.location) {
      toast.error("Please fill all required fields");
      return;
    }

    if (isLoggedIn) {
      try {
        setIsSubmitting(true);
        await submitApplication();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to apply");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Not logged in: continue to auth modal
    setIsApplyOpen(false);
    setIsAuthOpen(true);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await axiosInstance.post(`/user/login`, loginForm, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success("Login successful");
        setIsAuthOpen(false);
        await submitApplication();
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const payload = {
        fullName: signupForm.fullName,
        email: signupForm.email,
        password: signupForm.password,
        role: "student",
      };

      const res = await axiosInstance.post(`/user/register`, payload, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Account created");
        setIsAuthOpen(false);
        await submitApplication();
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <span onClick={() => setIsApplyOpen(true)} className="inline-block">
        {trigger}
      </span>

      <Dialog open={isApplyOpen} onClose={() => setIsApplyOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Apply for this job</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Fill in your details. If you are not logged in, you will be asked to login/signup next.
          </DialogContentText>

          <Box component="form" onSubmit={handleApplySubmit}>
            <Stack spacing={2}>
              <TextField
                id="applicantName"
                label="Username"
                value={applyForm.applicantName}
                onChange={(e) => setApplyForm((p) => ({ ...p, applicantName: e.target.value }))}
                required
                fullWidth
              />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  Upload Resume
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                  <Button component="label" variant="outlined">
                    Choose file
                    <input
                      hidden
                      type="file"
                      onChange={(e) =>
                        setApplyForm((p) => ({ ...p, resumeFile: e.target.files?.[0] || null }))
                      }
                    />
                  </Button>
                  <Typography variant="body2" color="text.secondary">
                    {applyForm.resumeFile?.name || "No file selected"}
                  </Typography>
                </Stack>
              </Box>

              <TextField
                id="expectedSalary"
                label="Expected Salary"
                type="number"
                value={applyForm.expectedSalary}
                onChange={(e) => setApplyForm((p) => ({ ...p, expectedSalary: e.target.value }))}
                fullWidth
              />

              <TextField
                id="location"
                label="Location"
                value={applyForm.location}
                onChange={(e) => setApplyForm((p) => ({ ...p, location: e.target.value }))}
                required
                fullWidth
              />

              <DialogActions sx={{ px: 0 }}>
                <Button onClick={() => setIsApplyOpen(false)} variant="text" disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                >
                  {isLoggedIn ? "Submit Application" : "Continue"}
                </Button>
              </DialogActions>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthOpen} onClose={() => setIsAuthOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{authMode === "login" ? "Login" : "Create an account"}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            {authMode === "login"
              ? "Login to submit your application."
              : "Create an account to submit your application."}
          </DialogContentText>

          {authMode === "login" ? (
            <Box component="form" onSubmit={handleLogin}>
              <Stack spacing={2}>
                <TextField
                  id="loginEmail"
                  type="email"
                  label="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  id="loginPassword"
                  type="password"
                  label="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  fullWidth
                />

                <DialogActions sx={{ px: 0 }}>
                  <Button onClick={() => setIsAuthOpen(false)} variant="text" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    Login & Apply
                  </Button>
                </DialogActions>

                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => setAuthMode("signup")}
                    sx={{ textTransform: "none", px: 0.5, minWidth: 0, fontWeight: 700 }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Stack>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleSignup}>
              <Stack spacing={2}>
                <TextField
                  id="signupName"
                  label="Name"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((p) => ({ ...p, fullName: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  id="signupEmail"
                  type="email"
                  label="Email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  fullWidth
                />
                <TextField
                  id="signupPassword"
                  type="password"
                  label="Password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  fullWidth
                />

                <DialogActions sx={{ px: 0 }}>
                  <Button onClick={() => setIsAuthOpen(false)} variant="text" disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
                  >
                    Sign up & Apply
                  </Button>
                </DialogActions>

                <Typography variant="body2" color="text.secondary">
                  Already have an account?{" "}
                  <Button
                    type="button"
                    variant="text"
                    onClick={() => setAuthMode("login")}
                    sx={{ textTransform: "none", px: 0.5, minWidth: 0, fontWeight: 700 }}
                  >
                    Login
                  </Button>
                </Typography>
              </Stack>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
