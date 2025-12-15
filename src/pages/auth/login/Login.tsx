import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "../../../components/global/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoadnig, setUser } from "./../../../../redux/authSlice";
import { Loader } from "lucide-react";
import axiosInstance from "../../../utils/axios";

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
      const redirectTo = (location.state as any)?.from;
      navigate(redirectTo || "/", { replace: true });
    }
  }, [user, navigate, location.state]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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
        const redirectTo = (location.state as any)?.from;
        navigate(redirectTo || "/");
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
      <div className="flex-1 flex items-center justify-center mx-auto w-full">
        <div className="container max-w-lg mx-auto p-4">
          <Card className="border-gray-200 shadow-2xl rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                Login an Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    className="border-1 border-gray-400"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={input.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2 relative">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    className="border-1 border-gray-400"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={input.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {loading ? (
                  <Button className="w-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer">
                    <span className="mr-2">Loading...</span>
                    <Loader />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white cursor-pointer"
                  >
                    Login
                  </Button>
                )}

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link
                      to="/signup"
                      className="text-blue-600 hover:underline"
                    >
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
