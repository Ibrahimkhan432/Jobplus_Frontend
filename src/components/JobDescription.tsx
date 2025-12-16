"use client"
import { useParams } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSingleJob } from "../../redux/jobSlice"
import axiosInstance from "@/utils/axios"
import ApplyFlowDialog from "@/components/ApplyFlowDialog"
import Navbar from "@/components/global/Navbar";
import { Alert, Box, Button, Chip, Container, Grid, Paper, Stack, Typography } from "@mui/material"
import {
  MapPinIcon,
  CalendarIcon,
  MailIcon,
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  BuildingIcon,
  FileTextIcon,
} from "lucide-react"

type Salary = {
  min: number
  max: number
  currency?: string
}

function JobDescription() {
  const params = useParams()
  const jobId = params.id
  const dispatch = useDispatch()
  const { user } = useSelector((store: any) => store.auth)
  const { singleJob } = useSelector((store: any) => store.job)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const formaRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (formaRef.current) {
      formaRef.current.scrollIntoView({ behavior: "auto", block: "start" })
    }
  }, [])

  const normalizeId = (value: any) => {
    if (!value) return null
    if (typeof value === "string") return value
    if (typeof value === "object" && value._id) return String(value._id)
    if (typeof value?.toString === "function") return value.toString()
    return null
  }

  const isApplied =
    singleJob?.applications?.some(
      (application: any) =>
        normalizeId(application?.applicant) === normalizeId(user?._id)
    ) || false;

  const refetchSingleJob = async () => {
    if (!jobId) return
    try {
      const jobRes = await axiosInstance.get(`/job/get/${jobId}`, {
        withCredentials: false,
      })
      if (jobRes.data.success) {
        dispatch(setSingleJob(jobRes.data.job))
      }
    } catch {
      // ignore
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return "Not specified"
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatSalary = (salary?: Salary | number | string) => {
    if (salary == null) return "Not specified"

    if (typeof salary === "number") {
      return `Rs ${salary.toLocaleString()}`
    }

    if (typeof salary === "string") {
      const n = Number(salary)
      return Number.isFinite(n) ? `Rs ${n.toLocaleString()}` : "Not specified"
    }

    const currency = (salary.currency || "PKR").toUpperCase()
    const prefix = currency === "PKR" ? "Rs" : currency
    const min = Number(salary.min)
    const max = Number(salary.max)

    if (!Number.isFinite(min) || !Number.isFinite(max)) return "Not specified"
    return `${prefix} ${min.toLocaleString()} - ${max.toLocaleString()}`
  }

  useEffect(() => {
    const fetchSingleJob = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const res = await axiosInstance.get(`/job/get/${jobId}`, {
          withCredentials: false,
        })
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job))
        } else {
          setLoadError(res.data?.message || "Failed to load job")
        }
      } catch (error) {
        console.log("error in get single job", error)
        setLoadError("Error loading job")
      } finally {
        setIsLoading(false)
      }
    }
    if (jobId) fetchSingleJob()
  }, [dispatch, jobId])

  if (isLoading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Loading job details...
        </Typography>
      </Box>
    )
  }

  if (loadError) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, px: 2 }}>
        <Alert severity="error">{loadError}</Alert>
        <Button onClick={() => window.location.reload()} variant="outlined">
          Retry
        </Button>
      </Box>
    )
  }

  if (!singleJob) {
    return (
      <Box sx={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Job not found
        </Typography>
      </Box>
    )
  }

  return (
    <Box ref={formaRef}>
      <Navbar />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={2.5}>
              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Box sx={{ width: 56, height: 56, borderRadius: 2, backgroundColor: "primary.50", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BriefcaseIcon size={28} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                      {singleJob?.title}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                      <MapPinIcon size={18} />
                      <Typography variant="body2" color="text.secondary">
                        {singleJob?.location}
                      </Typography>
                    </Stack>
                    {singleJob?.created_by?.email ? (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                        <MailIcon size={18} />
                        <Typography variant="body2" color="text.secondary">
                          {singleJob.created_by.email}
                        </Typography>
                      </Stack>
                    ) : null}

                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" sx={{ mt: 2 }}>
                      <Chip icon={<ClockIcon size={16} />} label={`${singleJob?.experience} years exp`} variant="outlined" />
                      <Chip icon={<UsersIcon size={16} />} label={`${singleJob?.position} positions`} variant="outlined" />
                      <Chip label={formatSalary(singleJob?.salary)} variant="outlined" />
                      <Chip icon={<BuildingIcon size={16} />} label={`${singleJob?.jobType}`} variant="outlined" />
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <FileTextIcon size={20} />
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Job Description
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                  {singleJob?.description}
                </Typography>
              </Paper>

              {singleJob?.requirement ? (
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Requirements
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
                    {singleJob?.requirement}
                  </Typography>
                </Paper>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 88 } }}>
              <Stack spacing={2.5}>
                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Apply
                  </Typography>
                  {!jobId ? (
                    <Button fullWidth disabled variant="contained" size="large">
                      Apply Now
                    </Button>
                  ) : isApplied ? (
                    <Button fullWidth disabled variant="contained" size="large" startIcon={<CheckCircleIcon size={18} />}>
                      Applied
                    </Button>
                  ) : (
                    <ApplyFlowDialog
                      jobId={jobId}
                      onApplied={refetchSingleJob}
                      trigger={
                        <Button fullWidth variant="contained" size="large">
                          Apply Now
                        </Button>
                      }
                    />
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    You will be notified when the recruiter updates your application status.
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                    Overview
                  </Typography>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <UsersIcon size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Total applicants
                      </Typography>
                      <Box sx={{ flex: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {singleJob?.applications?.length || 0}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <CalendarIcon size={18} />
                      <Typography variant="body2" color="text.secondary">
                        Posted
                      </Typography>
                      <Box sx={{ flex: 1 }} />
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {formatDate(singleJob?.createdAt)}
                      </Typography>
                    </Stack>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default JobDescription
