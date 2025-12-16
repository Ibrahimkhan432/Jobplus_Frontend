import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import axiosInstance from "@/utils/axios";
import { setUser } from "../../redux/authSlice";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
      <Dialog open={isApplyOpen} onOpenChange={setIsApplyOpen}>
        <span
          onClick={() => setIsApplyOpen(true)}
          className="inline-block"
        >
          {trigger}
        </span>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply for this job</DialogTitle>
            <DialogDescription>
              Fill in your details. If you are not logged in, you will be asked to login/signup next.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApplySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="applicantName">Username</Label>
              <Input
                id="applicantName"
                value={applyForm.applicantName}
                onChange={(e) => setApplyForm((p) => ({ ...p, applicantName: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resume">Upload Resume</Label>
              <Input
                id="resume"
                type="file"
                onChange={(e) => setApplyForm((p) => ({ ...p, resumeFile: e.target.files?.[0] || null }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedSalary">Expected Salary</Label>
              <Input
                id="expectedSalary"
                type="number"
                value={applyForm.expectedSalary}
                onChange={(e) => setApplyForm((p) => ({ ...p, expectedSalary: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={applyForm.location}
                onChange={(e) => setApplyForm((p) => ({ ...p, location: e.target.value }))}
                required
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="bgMain-gradient text-white">
                {isLoggedIn ? "Submit Application" : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAuthOpen} onOpenChange={setIsAuthOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{authMode === "login" ? "Login" : "Create an account"}</DialogTitle>
            <DialogDescription>
              {authMode === "login"
                ? "Login to submit your application."
                : "Create an account to submit your application."}
            </DialogDescription>
          </DialogHeader>

          {authMode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loginEmail">Email</Label>
                <Input
                  id="loginEmail"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginPassword">Password</Label>
                <Input
                  id="loginPassword"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="bgMain-gradient text-white">
                  Login & Apply
                </Button>
              </DialogFooter>

              <div className="text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("signup")}
                >
                  Sign up
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signupName">Name</Label>
                <Input
                  id="signupName"
                  value={signupForm.fullName}
                  onChange={(e) => setSignupForm((p) => ({ ...p, fullName: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <Input
                  id="signupEmail"
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <Input
                  id="signupPassword"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
                  required
                />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={isSubmitting} className="bgMain-gradient text-white">
                  Sign up & Apply
                </Button>
              </DialogFooter>

              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => setAuthMode("login")}
                >
                  Login
                </button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
