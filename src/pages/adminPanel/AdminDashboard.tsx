import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axios";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

type AdminStats = {
  totalUsers: number;
  totalRecruiters: number;
  totalStudents: number;
  verifiedRecruiters: number;
  totalJobs: number;
  totalApplications: number;
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/admin/stats");
        if (res.data?.success) {
          setStats(res.data.stats);
          return;
        }
        setError("Failed to load dashboard stats.");
      } catch (e) {
        setError("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <Box>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Overview
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quick platform health snapshot.
        </Typography>
      </Stack>

      {loading ? (
        <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
          }}
        >
          {[
            { label: "Total users", value: stats?.totalUsers ?? 0 },
            { label: "Recruiters", value: stats?.totalRecruiters ?? 0 },
            { label: "Students", value: stats?.totalStudents ?? 0 },
            { label: "Verified recruiters", value: stats?.verifiedRecruiters ?? 0 },
            { label: "Jobs", value: stats?.totalJobs ?? 0 },
            { label: "Applications", value: stats?.totalApplications ?? 0 },
          ].map((item) => (
            <Box key={item.label}>
              <Card variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    {item.value}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
