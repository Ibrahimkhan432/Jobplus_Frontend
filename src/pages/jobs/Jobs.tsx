import FilterCard from "@/components/FilterCard";
import Navbar from "@/components/global/Navbar";
import JobCard from "@/components/Jobcard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import axiosInstance from "@/utils/axios";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  BuildingIcon,
  CheckCircleIcon,
  ClockIcon,
  FileTextIcon,
  MailIcon,
  MapPinIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ApplyFlowDialog from "@/components/ApplyFlowDialog";

function Jobs() {
  const { allJobs } = useSelector((store: any) => store.job);
  const { user } = useSelector((store: any) => store.auth);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const [visibleCount, setVisibleCount] = useState(12);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Fetch all jobs when component mounts
  useGetAllJobs();

  const filteredJobs = useMemo(() => {
    return allJobs?.filter((job: any) => {
      // If no filters, show all jobs
      if (!filters || Object.keys(filters).length === 0) return true;

      // Check each filter type
      const locationMatch = filters.Location
        ? job.location?.toLowerCase() === filters.Location.toLowerCase()
        : true;
      const industryMatch = filters.Industry
        ? job.industry?.toLowerCase() === filters.Industry.toLowerCase()
        : true;
      const salaryMatch = filters.Salary
        ? job.salary?.toLowerCase().includes(filters.Salary.toLowerCase())
        : true;
      const titleMatch = filters.title
        ? job.title?.toLowerCase().includes(filters.title.toLowerCase())
        : true;

      return locationMatch && industryMatch && salaryMatch && titleMatch;
    }) || [];
  }, [allJobs, filters]);

  useEffect(() => {
    const fromQuery = searchParams.get("jobId");
    if (fromQuery) {
      setSelectedJobId(fromQuery);
      return;
    }
    if (!selectedJobId && filteredJobs.length > 0) {
      setSelectedJobId(filteredJobs[0]?._id);
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("jobId", filteredJobs[0]?._id);
        return next;
      }, { replace: true });
    }
  }, [filteredJobs, searchParams, selectedJobId, setSearchParams]);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisibleCount((c) => Math.min(c + 12, filteredJobs.length));
        }
      },
      { root: null, threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [filteredJobs.length]);

  useEffect(() => {
    const fetchSelectedJob = async () => {
      if (!selectedJobId) {
        setSelectedJob(null);
        return;
      }
      setIsLoadingDetail(true);
      setDetailError(null);
      try {
        const res = await axiosInstance.get(`/job/get/${selectedJobId}`, {
          withCredentials: false,
        });
        if (res.data.success) {
          setSelectedJob(res.data.job);
        } else {
          setSelectedJob(null);
          setDetailError(res.data?.message || "Failed to load job");
        }
      } catch (e: any) {
        setSelectedJob(null);
        setDetailError(e?.response?.data?.message || "Error loading job");
      } finally {
        setIsLoadingDetail(false);
      }
    };
    fetchSelectedJob();
  }, [selectedJobId]);

  const normalizeId = (value: any) => {
    if (!value) return null;
    if (typeof value === "string") return value;
    if (typeof value === "object" && value._id) return String(value._id);
    if (typeof value?.toString === "function") return value.toString();
    return null;
  };

  const isApplied =
    selectedJob?.applications?.some(
      (application: any) =>
        normalizeId(application?.applicant) === normalizeId(user?._id)
    ) || false;

  const formatSalary = (job?: any) => {
    if (!job) return "Not specified";
    const min = job?.salaryMin;
    const max = job?.salaryMax;
    if (min != null && max != null && min !== "" && max !== "") {
      const nMin = Number(min);
      const nMax = Number(max);
      if (Number.isFinite(nMin) && Number.isFinite(nMax)) {
        return `Rs ${nMin.toLocaleString()} - ${nMax.toLocaleString()}`;
      }
    }
    if (job?.salary != null && job.salary !== "") {
      const n = Number(job.salary);
      return Number.isFinite(n) ? `Rs ${n.toLocaleString()}` : `Rs ${String(job.salary)}`;
    }
    return "Not specified";
  };

  const refetchSelectedJob = async () => {
    if (!selectedJobId) return;
    try {
      const jobRes = await axiosInstance.get(`/job/get/${selectedJobId}`, {
        withCredentials: false,
      });
      if (jobRes.data.success) {
        setSelectedJob(jobRes.data.job);
      }
    } catch {
      // ignore
    }
  };

  return (
    <Box>
      <Navbar />
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 3 }} sx={{ display: { xs: "none", lg: "block" } }}>
            <Box
              sx={{
                position: { lg: "sticky" },
                top: { lg: 88 },
                height: { lg: "calc(100vh - 112px)" },
                overflowY: { lg: "auto" },
                pr: { lg: 1 },
              }}
            >
              <FilterCard onFilterChange={setFilters} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 9 }}>
            {filteredJobs.length <= 0 ? (
              <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  No Jobs Found
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Box
                    sx={{
                      position: { lg: "sticky" },
                      top: { lg: 88 },
                      height: { lg: "calc(100vh - 112px)" },
                      overflowY: { lg: "auto" },
                      pr: { lg: 1 },
                    }}
                  >
                    <Stack spacing={2}>
                      {filteredJobs.slice(0, visibleCount).map((job: any) => (
                        <JobCard
                          key={job?._id}
                          job={job}
                          searchTerm={filters.searchTerm || ""}
                          selected={selectedJobId === job?._id}
                          onSelect={(id: string) => {
                            setSelectedJobId(id);
                            setSearchParams((prev) => {
                              const next = new URLSearchParams(prev);
                              next.set("jobId", id);
                              return next;
                            }, { replace: true });
                          }}
                        />
                      ))}
                      <Box ref={loadMoreRef} sx={{ height: 24 }} />
                    </Stack>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, lg: 7 }} sx={{ display: { xs: "none", lg: "block" } }}>
                  <Box sx={{ position: "sticky", top: 88 }}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      {!selectedJobId ? (
                        <Typography variant="body2" color="text.secondary">
                          Select a job to view details
                        </Typography>
                      ) : isLoadingDetail ? (
                        <Typography variant="body2" color="text.secondary">
                          Loading job details...
                        </Typography>
                      ) : detailError ? (
                        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                          <Alert severity="error" sx={{ flex: 1 }}>
                            {detailError}
                          </Alert>
                          <Button
                            variant="outlined"
                            onClick={() => {
                              setSelectedJobId((id) => (id ? `${id}` : id));
                            }}
                          >
                            Retry
                          </Button>
                        </Stack>
                      ) : !selectedJob ? (
                        <Typography variant="body2" color="text.secondary">
                          Job not found
                        </Typography>
                      ) : (
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {selectedJob?.title}
                              </Typography>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <MapPinIcon size={16} />
                                <Typography variant="body2" color="text.secondary">
                                  {selectedJob?.location}
                                </Typography>
                              </Stack>
                            </Box>
                            <Button variant="outlined" onClick={() => navigate(`/description/${selectedJobId}`)}>
                              Open
                            </Button>
                          </Stack>

                          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                            <Chip icon={<ClockIcon size={16} />} label={`${selectedJob?.experience} years exp`} variant="outlined" />
                            <Chip icon={<UsersIcon size={16} />} label={`${selectedJob?.position} positions`} variant="outlined" />
                            <Chip label={formatSalary(selectedJob)} variant="outlined" />
                            <Chip icon={<BuildingIcon size={16} />} label={`${selectedJob?.jobType}`} variant="outlined" />
                          </Stack>

                          <Divider />

                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              <FileTextIcon size={18} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                Job Description
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {selectedJob?.description}
                            </Typography>
                          </Box>

                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              <UsersIcon size={18} />
                              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                                Job Requirement
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {selectedJob?.requirement}
                            </Typography>
                          </Box>

                          <Divider />

                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                              About Recruiter
                            </Typography>
                            {selectedJob?.created_by?.email ? (
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                <MailIcon size={16} />
                                <Typography variant="body2" color="text.secondary">
                                  {selectedJob.created_by.email}
                                </Typography>
                              </Stack>
                            ) : null}
                          </Box>

                          <Box sx={{ pt: 1 }}>
                            {isApplied ? (
                              <Button variant="contained" disabled startIcon={<CheckCircleIcon size={18} />}>
                                Applied
                              </Button>
                            ) : (
                              <ApplyFlowDialog
                                jobId={selectedJobId}
                                onApplied={refetchSelectedJob}
                                trigger={
                                  <Button variant="contained" startIcon={<CheckCircleIcon size={18} />}>
                                    Apply
                                  </Button>
                                }
                              />
                            )}
                          </Box>
                        </Stack>
                      )}
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default Jobs;