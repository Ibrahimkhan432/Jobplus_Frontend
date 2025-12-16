import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/global/Navbar";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axios";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

import {
    Box,
    Button,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

const CreateJob = () => {
    const navigate = useNavigate();
    useGetAllCompanies()
    const { companies } = useSelector((store: any) => store.company);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        salaryMin: "",
        salaryMax: "",
        location: "",
        requirement: "",
        position: "",
        jobType: "",
        company: "",
        experience: ""
    });

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCompanyChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axiosInstance.post(
                `/job/post`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/recruiter/dashboard");
            }
        } catch (error: any) {
            console.error("Error creating job:", error);
            toast.error(error.response?.data?.message || "Failed to create job");
        }
    };

    return (
        <Box>
            <Navbar />
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <IconButton onClick={() => navigate("/recruiter/dashboard")}>
                            <ArrowLeft />
                        </IconButton>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Create New Job
                        </Typography>
                    </Stack>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2.5}>
                            <TextField
                                label="Job Title"
                                name="title"
                                value={formData.title}
                                onChange={handleTextChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Description"
                                name="description"
                                value={formData.description}
                                onChange={handleTextChange}
                                required
                                fullWidth
                                multiline
                                rows={4}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    label="Minimum Salary"
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salaryMin}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Maximum Salary"
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salaryMax}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                />
                            </Stack>

                            <TextField
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleTextChange}
                                required
                                fullWidth
                            />

                            <TextField
                                label="Requirements"
                                name="requirement"
                                value={formData.requirement}
                                onChange={handleTextChange}
                                required
                                fullWidth
                                multiline
                                rows={3}
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    label="Number of Positions"
                                    name="position"
                                    type="number"
                                    value={formData.position}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                />
                                <TextField
                                    label="Experience (years)"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    label="Job Type"
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleTextChange}
                                    required
                                    fullWidth
                                />

                                {companies && companies.length > 0 ? (
                                    <FormControl fullWidth required>
                                        <InputLabel id="company-label">Company</InputLabel>
                                        <Select
                                            labelId="company-label"
                                            label="Company"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleCompanyChange}
                                        >
                                            <MenuItem value="">
                                                <em>Select Company</em>
                                            </MenuItem>
                                            {companies.map((company: any) => (
                                                <MenuItem key={company._id} value={company._id}>
                                                    {company.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                ) : (
                                    <TextField
                                        label="Company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleTextChange}
                                        required
                                        fullWidth
                                    />
                                )}
                            </Stack>

                            <Button type="submit" variant="contained" size="large">
                                Create Job
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default CreateJob; 