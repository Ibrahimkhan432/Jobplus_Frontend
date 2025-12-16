"use client"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGetRecruiterJobs from "@/hooks/useGetRecruiterJobs"
import { EditIcon, UsersIcon } from "lucide-react"
import axiosInstance from "@/utils/axios"

import { Box, Button, Typography } from "@mui/material"
import { DataGrid, GridOverlay, type GridColDef } from "@mui/x-data-grid"

function PostJobTable() {
    const navigate = useNavigate()
    useGetRecruiterJobs()
    const recruiterJobs = useSelector((store: any) => store.job.allRecruiterJobs)
    const searchJobByName = useSelector((store: any) => store.job.searchJobByName)
    const [filteredJobs, setFilteredJobs] = useState(recruiterJobs)
    const [allMyJobs, setAllMyJobs] = useState([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                setLoading(true)
                const res = await axiosInstance.get(`/job/myJobs`, {
                    // withCredentials: true,
                });
                if (res.data.success) {
                    setAllMyJobs(res.data.jobs);
                    setFilteredJobs(res.data.jobs);
                }
            } catch (error) {
                console.error("Failed to fetch recruiter jobs", error);
            } finally {
                setLoading(false)
            }
        };
        fetchMyJobs();
    }, []);

    useEffect(() => {
        if (searchJobByName) {
            const filtered = allMyJobs.filter((job: any) =>
                job.title.toLowerCase().includes(searchJobByName.toLowerCase())
            );
            setFilteredJobs(filtered);
        } else {
            setFilteredJobs(allMyJobs);
        }
    }, [searchJobByName, allMyJobs]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const formatSalary = (job: any) => {
        const min = job?.salaryMin;
        const max = job?.salaryMax;
        if (min != null && max != null && min !== "" && max !== "") {
            const nMin = Number(min);
            const nMax = Number(max);
            if (Number.isFinite(nMin) && Number.isFinite(nMax)) {
                return `Rs ${nMin.toLocaleString()} - ${nMax.toLocaleString()}`;
            }
        }
        const legacy = job?.salary;
        if (legacy != null && legacy !== "") {
            const n = Number(legacy);
            return Number.isFinite(n) ? `Rs ${n.toLocaleString()}` : `Rs ${String(legacy)}`;
        }
        return "Not specified";
    }

    const rows = (filteredJobs || []).map((job: any) => ({
        id: job?._id,
        title: job?.title ?? "",
        jobType: job?.jobType ?? "",
        location: job?.location ?? "",
        salary: formatSalary(job),
        experience: job?.experience ?? "",
        position: job?.position ?? "",
        createdAt: job?.createdAt ? formatDate(job.createdAt) : "",
        updatedAt: job?.updatedAt ? formatDate(job.updatedAt) : "",
    }))

    const NoRows = () => (
        <GridOverlay>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    {searchJobByName
                        ? `No jobs found matching "${searchJobByName}"`
                        : "No jobs found"}
                </Typography>
            </Box>
        </GridOverlay>
    )

    const LoadingOverlay = () => (
        <GridOverlay>
            <Box sx={{ p: 2 }}>
                <Typography variant="body2" color="text.secondary">
                    Loading jobs...
                </Typography>
            </Box>
        </GridOverlay>
    )

    const columns: GridColDef[] = [
        { field: "title", headerName: "Title", flex: 1, minWidth: 200 },
        { field: "jobType", headerName: "Job Type", width: 140 },
        { field: "location", headerName: "Location", flex: 1, minWidth: 160 },
        { field: "salary", headerName: "Salary", flex: 1, minWidth: 160, sortable: false },
        { field: "experience", headerName: "Experience", width: 120, sortable: false },
        { field: "position", headerName: "Positions", width: 110, sortable: false },
        { field: "createdAt", headerName: "Posted", width: 130 },
        {
            field: "actions",
            headerName: "Actions",
            width: 220,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/recruiter/dashboard/${String(params.row.id)}`)}
                    >
                        <EditIcon size={16} style={{ marginRight: 6 }} />
                        Edit
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/recruiter/jobs/${String(params.row.id)}/applicants`)}
                    >
                        <UsersIcon size={16} style={{ marginRight: 6 }} />
                        Applicants
                    </Button>
                </Box>
            ),
        },
    ]

    return (
        <Box sx={{ width: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Your Posted Jobs
            </Typography>
            <Box sx={{ height: 560, width: "100%", backgroundColor: "background.paper", borderRadius: 2 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    loading={loading}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{
                        pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    }}
                    slots={{
                        noRowsOverlay: NoRows,
                        loadingOverlay: LoadingOverlay,
                    }}
                />
            </Box>
        </Box>
    )
}

export default PostJobTable
