import Navbar from "@/components/global/Navbar"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import PostJobTable from "../../components/recruiter/PostJobTable";
import { setSearchJobByName } from "../../../redux/jobSlice";

import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";

function RecruiterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobByName = useSelector((store: any) => store.job.searchJobByName);
  const recruiterJobs = useSelector((store: any) => store.job.allRecruiterJobs);

  const jobs = Array.isArray(recruiterJobs) ? recruiterJobs : [];
  const totalJobs = jobs.length;
  const totalPositions = jobs.reduce((acc: number, j: any) => {
    const v = Number(j?.position);
    return acc + (Number.isFinite(v) ? v : 0);
  }, 0);
  const recentJobs = jobs.filter((j: any) => {
    if (!j?.createdAt) return false;
    const d = new Date(j.createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  }).length;
  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={0.5} sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900 }}>
            Recruiter Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your job postings and applicants.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            mb: 3,
          }}
        >
          {[
            { label: "Total jobs", value: totalJobs },
            { label: "Positions posted", value: totalPositions },
            { label: "Jobs posted (7d)", value: recentJobs },
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

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              value={searchJobByName}
              onChange={(e) => dispatch(setSearchJobByName(e.target.value))}
              placeholder="Search job by title"
              size="small"
            />
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate("/recruiter/dashboard/create")}
            sx={{ height: 40, whiteSpace: "nowrap" }}
          >
            Add New Job
          </Button>
        </Stack>

        <PostJobTable />
      </Container>
    </Box>
  )
}

export default RecruiterDashboard
