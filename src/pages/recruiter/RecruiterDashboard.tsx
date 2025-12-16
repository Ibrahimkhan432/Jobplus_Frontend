import Navbar from "@/components/global/Navbar"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import PostJobTable from "../../components/recruiter/PostJobTable";
import { setSearchJobByName } from "../../../redux/jobSlice";

import { Box, Button, Container, Stack, TextField, Typography } from "@mui/material";

function RecruiterDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchJobByName = useSelector((store: any) => store.job.searchJobByName);
  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
              Recruiter Dashboard
            </Typography>
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
