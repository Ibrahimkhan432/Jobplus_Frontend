import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Navbar from "@/components/global/Navbar";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axios";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

import {
    Alert,
    Box,
    Button,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";

const CreateJob = () => {
    const navigate = useNavigate();
    const { user } = useSelector((store: any) => store.auth);
    useGetAllCompanies()
    const { companies } = useSelector((store: any) => store.company);
    
    // Check if user is a recruiter (no verification needed)
    const isRecruiter = user?.role === "recruiter";

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
    
    const [companyOption, setCompanyOption] = useState<'existing' | 'new'>('existing');
    const [newCompanyName, setNewCompanyName] = useState('');

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
        
        // Validate that a company is selected or created
        if (companyOption === 'existing' && !formData.company) {
            toast.error("Please select a company");
            return;
        }
        
        if (companyOption === 'new' && !newCompanyName.trim()) {
            toast.error("Please enter a company name");
            return;
        }
        
        // If creating a new company, create it first
        let companyId = formData.company;
        if (companyOption === 'new' && newCompanyName.trim()) {
            try {
                const res = await axiosInstance.post(
                    `/company/register`,
                    { companyName: newCompanyName },
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                        withCredentials: true,
                    }
                );
                
                if (res.data.success) {
                    companyId = res.data.company._id;
                    toast.success("Company created successfully");
                }
            } catch (error: any) {
                console.error("Error creating company:", error);
                toast.error(error.response?.data?.message || "Failed to create company");
                return;
            }
        }

        try {
            const jobData = {
                ...formData,
                company: companyId
            };
            
            const res = await axiosInstance.post(
                `/job/post`,
                jobData,
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

                                <FormControl fullWidth required>
                                    <FormLabel component="legend">Company/Organization</FormLabel>
                                    <RadioGroup
                                        row
                                        value={companyOption}
                                        onChange={(e) => setCompanyOption(e.target.value as 'existing' | 'new')}
                                    >
                                        <FormControlLabel value="existing" control={<Radio />} label="Select Existing Company" />
                                        <FormControlLabel value="new" control={<Radio />} label="Add New Company" />
                                    </RadioGroup>
                                </FormControl>
                                
                                {companyOption === 'existing' ? (
                                    companies && companies.length > 0 ? (
                                        <FormControl fullWidth required>
                                            <InputLabel id="company-label">Select Company</InputLabel>
                                            <Select
                                                labelId="company-label"
                                                label="Select Company"
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
                                        <Typography>No companies found. Please add a new company.</Typography>
                                    )
                                ) : (
                                    <TextField
                                        label="New Company Name"
                                        value={newCompanyName}
                                        onChange={(e) => setNewCompanyName(e.target.value)}
                                        required
                                        fullWidth
                                    />
                                )}
                                                                

                            </Stack>

                            <Button 
                                type="submit" 
                                variant="contained" 
                                size="large"
                                disabled={!isRecruiter}
                            >
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