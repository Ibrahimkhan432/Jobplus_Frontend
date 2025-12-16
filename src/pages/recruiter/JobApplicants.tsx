import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/global/Navbar";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "../../../redux/applicationSlice";
import axiosInstance from "@/utils/axios";
import ApplicantsTable from "@/components/recruiter/ApplicantsTable";

import { Box, Container, IconButton, Stack, Typography } from "@mui/material";

const JobApplicants = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const applicants = useSelector((state: any) => state.application.applicants);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/application/${params.id}/applicants`, {
          withCredentials: true,
        });
        // console.log("response to fetchAll APplicants", res);

        dispatch(setAllApplicants(res.data.job));
        setJobTitle(res.data.job.title || "");
      } catch (error) {
        console.error("Error fetching applicants:", error);
        toast.error("Failed to fetch applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, []);

  if (loading) {
    return (
      <Box>
        <Navbar />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Loading...
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate("/recruiter/dashboard")}>
            <ArrowLeft />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Applicants for {jobTitle}{" "}
            <Typography component="span" variant="h6" sx={{ color: "primary.main", fontWeight: 700 }}>
              ( {applicants?.applications?.length ?? 0} )
            </Typography>
          </Typography>
        </Stack>

        <ApplicantsTable />
      </Container>
    </Box>
  );
};

export default JobApplicants;