import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { Box, Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    salaryMin: "",
    salaryMax: "",
    location: "",
    requirement: "",
    position: "",
    jobType: "",
    experience: "",
  });

  useEffect(() => {
    axiosInstance.get(`/job/get/${id}`).then(({ data }) => {
      if (data.success) {
        const job = data.job || {};
        setFormData((prev) => ({
          ...prev,
          ...job,
          salaryMin: job.salaryMin ?? prev.salaryMin,
          salaryMax: job.salaryMax ?? prev.salaryMax,
        }));
      }
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/job/get/${id}`, formData);
      if (res.data.success) {
        toast.success("Job Updated Successfully!");
        navigate("/recruiter/dashboard");
      }
    } catch (error) {
      console.log("error while updating job",error)
      toast.error("Job update failed!");
    }
  };

  return (
    <Box>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <IconButton onClick={() => navigate("/recruiter/dashboard")}>
              <ArrowLeft />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Edit Job
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField label="Job Title" name="title" value={formData.title} onChange={handleChange} required fullWidth />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Minimum Salary" name="salaryMin" type="number" value={(formData as any).salaryMin} onChange={handleChange} required fullWidth />
                <TextField label="Maximum Salary" name="salaryMax" type="number" value={(formData as any).salaryMax} onChange={handleChange} required fullWidth />
              </Stack>
              <TextField label="Location" name="location" value={formData.location} onChange={handleChange} required fullWidth />
              <TextField label="Requirements" name="requirement" value={formData.requirement} onChange={handleChange} required fullWidth />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Positions" name="position" type="number" value={formData.position} onChange={handleChange} required fullWidth />
                <TextField label="Experience (Years)" name="experience" type="number" value={formData.experience} onChange={handleChange} required fullWidth />
              </Stack>
              <TextField label="Job Type" name="jobType" value={formData.jobType} onChange={handleChange} required fullWidth />
              <TextField label="Job Description" name="description" value={formData.description} onChange={handleChange} required fullWidth multiline rows={4} />
              <Button type="submit" variant="contained" size="large">
                Update Job
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditJob;
