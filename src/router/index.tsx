import Home from "../pages/main/Home";
import Login from "../pages/auth/login/Login";
import Signup from "@/pages/auth/signup/Signup";
import Jobs from "@/pages/jobs/Jobs";
import Browser from "@/components/Browser";
import Profile from "@/pages/profile/Profile";
import JobDescription from "@/components/JobDescription";
import ProtectedRoute from "@/router/ProtectedRoute";
import { createBrowserRouter, Outlet, useLocation } from "react-router-dom";
import RecruiterDashboard from "@/pages/recruiter/RecruiterDashboard";
import CreateJob from "@/pages/recruiter/CreateJob";
import JobApplicants from "@/pages/recruiter/JobApplicants";
import EditJob from "@/pages/recruiter/EditJob";
import { useEffect } from "react";

function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
}

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: "signup", element: <Signup /> },
      { path: "login", element: <Login /> },
      { path: "jobs", element: <Jobs /> },
      { path: "description/:id", element: <JobDescription /> },
      { path: "browser", element: <Browser /> },
      { path: "profile", element: <Profile /> },

      {
        path: "recruiter",
        element: (
          <ProtectedRoute allowedRoles={["recruiter"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "dashboard", element: <RecruiterDashboard /> },
          { path: "dashboard/create", element: <CreateJob /> },
          { path: "dashboard/:id", element: <EditJob /> },
          { path: "jobs/:id/applicants", element: <JobApplicants /> },
        ],
      },
    ],
  },
])

export default router;