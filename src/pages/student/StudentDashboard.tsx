import Navbar from "@/components/global/Navbar";
import AppliedJobTable from "@/components/AppliedJobTable";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function StudentDashboard() {
  useGetAppliedJobs();
  useGetAllJobs();

  const navigate = useNavigate();
  const allAppliedJobs = useSelector((store: any) => store.job.allAppliedJobs);
  const allJobs = useSelector((store: any) => store.job.allJobs);

  const stats = useMemo(() => {
    const apps = Array.isArray(allAppliedJobs) ? allAppliedJobs : [];
    const totalApplications = apps.length;
    const pending = apps.filter((a: any) => String(a?.status || "").toLowerCase() === "pending").length;
    const accepted = apps.filter((a: any) => String(a?.status || "").toLowerCase() === "accepted").length;
    const rejected = apps.filter((a: any) => String(a?.status || "").toLowerCase() === "rejected").length;
    return { totalApplications, pending, accepted, rejected };
  }, [allAppliedJobs]);

  const suggestedJobs = useMemo(() => {
    const jobs = Array.isArray(allJobs) ? allJobs : [];
    return jobs.slice(0, 6);
  }, [allJobs]);

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
              Student Dashboard
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your applications and discover jobs.
            </Typography>
          </Box>
          <Button variant="contained" onClick={() => navigate("/jobs")} sx={{ height: 40, whiteSpace: "nowrap" }}>
            Browse Jobs
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            mb: 3,
          }}
        >
          {[
            { label: "Total applications", value: stats.totalApplications },
            { label: "Pending", value: stats.pending },
            { label: "Accepted", value: stats.accepted },
            { label: "Rejected", value: stats.rejected },
          ].map((item) => (
            <Card key={item.label} variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Stack spacing={1} sx={{ mb: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Recent Applications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Your latest job applications and current status.
          </Typography>
        </Stack>
        <AppliedJobTable />

        <Divider sx={{ my: 3 }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ sm: "center" }} sx={{ mb: 1.5 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Suggested Jobs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Based on what’s trending right now.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={() => navigate("/jobs")} sx={{ height: 40, whiteSpace: "nowrap" }}>
            See all jobs
          </Button>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
          }}
        >
          {suggestedJobs.map((job: any) => (
            <Card
              key={job?._id}
              variant="outlined"
              sx={{
                borderRadius: 3,
                cursor: "pointer",
                "&:hover": { borderColor: "primary.main" },
              }}
              onClick={() => navigate(`/description/${job?._id}`)}
            >
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  {job?.title || "Untitled job"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {job?.company?.name || "Organization"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {job?.location || ""}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
