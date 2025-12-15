"use client"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSingleJob } from "../../redux/jobSlice"
import { toast } from "sonner"
import axiosInstance from "@/utils/axios"
import {
  MapPinIcon,
  CalendarIcon,
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
  const navigate = useNavigate()
  const location = useLocation()
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

  const applyJobHandler = async () => {
    try {
      const res = await axiosInstance.post(`/application/apply/${jobId}`, {}, {
        withCredentials: true,
      })
      if (res.data.success) {
        toast.success("Applied successfully")
        // Refetch job to update applications
        const jobRes = await axiosInstance.get(`/job/get/${jobId}`, {
          withCredentials: false,
        })
        console.log("jobRes", jobRes)
        if (jobRes.data.success) {
          dispatch(setSingleJob(jobRes.data.job))
        }
      }
    } catch (error: any) {
      console.log("error in apply job", error)
      if (error.response?.status === 401) {
        toast.error("Please login to apply for this job")
        navigate("/login", {
          state: { from: location.pathname },
        })
      } else {
        toast.error(error.response?.data?.message || "Failed to apply for job")
      }
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading job details...</div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4">
        <div className="text-red-600">{loadError}</div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    )
  }

  if (!singleJob) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Job not found</div>
      </div>
    )
  }

  return (
    <div
      ref={formaRef}
      className="min-h-screen bg-gray-50 py-4">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BriefcaseIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{singleJob?.title}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPinIcon className="h-5 w-5 mr-2" />
                    <span className="text-lg">{singleJob?.location}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium text-white">
                  <ClockIcon className="h-4 w-4 mr-1 " />
                  {singleJob?.experience} years exp
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
                  <UsersIcon className="h-4 w-4 mr-1" />
                  {singleJob?.position} positions
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium  text-white">
                  {formatSalary(singleJob?.salary)}
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium cursor-pointer">
                  <BuildingIcon className="h-4 w-4 mr-1 " />
                  {singleJob?.jobType}
                </Badge>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              <Button
                onClick={applyJobHandler}
                disabled={isApplied}
                size="lg"
                className={`px-8 py-3 text-lg font-semibold cursor-pointer text-white ${isApplied ? "bgMian-gradient hover:bg-green-600 cursor-not-allowed" : "bgMain-gradient hover:bg-blue-700"
                  }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Applied
                  </>
                ) : (
                  "Apply Now"
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Applicants</p>
                <p className="text-2xl font-bold text-gray-900">{singleJob?.applications?.length || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CalendarIcon className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Posted Date</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(singleJob?.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Job Description Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-2">
            <FileTextIcon className="h-6 w-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Job Description</h2>
          </div>

          <div className="prose max-w-none">
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">About this role</h3>
              <p className="text-gray-600 leading-relaxed text-base">{singleJob?.description}</p>
            </div>

            {singleJob?.requirement && (
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
                <p className="text-gray-600 leading-relaxed text-base">{singleJob?.requirement}</p>
              </div>
            )}
          </div>
        </div>

        {/* Apply Again Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to join our team?</h3>
          <p className="text-gray-600 mb-6">
            Take the next step in your career and apply for this exciting opportunity.
          </p>
          <Button
            onClick={applyJobHandler}
            disabled={isApplied}
            size="lg"
            className={`px-8 py-3 text-lg font-semibold text-white ${isApplied ? "bgMain-gradient hover:bg-green-600 cursor-not-allowed" : "bgMain-gradient hover:bg-blue-700"
              }`}
          >
            {isApplied ? (
              <>
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Application Submitted
              </>
            ) : (
              "Apply for this Position"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobDescription
