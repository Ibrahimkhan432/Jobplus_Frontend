import FilterCard from "@/components/FilterCard";
import Navbar from "@/components/global/Navbar";
import JobCard from "@/components/Jobcard";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import axiosInstance from "@/utils/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <div>
      <div className="sticky top-0 w-full z-50">
        <Navbar />
      </div>
      <div className="max-w-8xl mx-auto  sm:px-6 lg:px-8 mt-6 mb-10">
        <div className="flex flex-col lg:flex-row gap-6">

          <div className="hidden lg:block lg:max-w-1/4 relative">
            {/* Fixed FilterCard */}
            <div className="">
              <FilterCard
                onFilterChange={setFilters}
              />
            </div>

            <div className="lg:hidden">
              <FilterCard
                onFilterChange={setFilters}
              />
            </div>
          </div>

          <div className="flex-1">
            {filteredJobs.length <= 0 ? (
              <div className="flex flex-col items-center justify-center w-full h-60 bg-white rounded-md shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">No Jobs Found</h1>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5">
                  <div className="max-h-[calc(100vh-140px)] overflow-y-auto pr-2">
                    <div className="space-y-4">
                      {filteredJobs.slice(0, visibleCount).map((job: any) => (
                        <div key={job?._id}>
                          <JobCard
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
                        </div>
                      ))}
                      <div ref={loadMoreRef} className="h-10" />
                    </div>
                  </div>
                </div>

                <div className="hidden lg:block lg:col-span-7">
                  <div className="sticky top-24">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                      {!selectedJobId ? (
                        <div className="text-gray-500">Select a job to view details</div>
                      ) : isLoadingDetail ? (
                        <div className="text-gray-500">Loading job details...</div>
                      ) : detailError ? (
                        <div className="flex items-center justify-between gap-4">
                          <div className="text-red-600">{detailError}</div>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedJobId((id) => (id ? `${id}` : id));
                            }}
                          >
                            Retry
                          </Button>
                        </div>
                      ) : !selectedJob ? (
                        <div className="text-gray-500">Job not found</div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{selectedJob?.title}</h2>
                              <div className="flex items-center text-gray-600 mt-2">
                                <MapPinIcon className="h-4 w-4 mr-2" />
                                <span>{selectedJob?.location}</span>
                              </div>


                            </div>
                            <Button
                              variant="outline"
                              onClick={() => navigate(`/description/${selectedJobId}`)}
                            >
                              Open
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium text-white">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {selectedJob?.experience} years exp
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {selectedJob?.position} positions
                            </Badge>
                            <Badge variant="secondary" className="px-3 py-1 text-sm font-medium text-white">
                              {formatSalary(selectedJob)}
                            </Badge>
                            <Badge variant="outline" className="px-3 py-1 text-sm font-medium">
                              <BuildingIcon className="h-4 w-4 mr-1" />
                              {selectedJob?.jobType}
                            </Badge>
                          </div>

                          <div className="border-t pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <FileTextIcon className="h-5 w-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-900">Job Description</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed line-clamp-6">{selectedJob?.description}</p>
                          </div>
                           <div className=" pt-4">
                            <div className="flex items-center gap-2 mb-2">
                              <UsersIcon className="h-5 w-5 text-blue-600" />
                              <h3 className="text-lg font-semibold text-gray-900">Job Requirement</h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed line-clamp-6">{selectedJob?.requirement}</p>
                          </div>
                          <div className="border-t pt-4">
                          <h1 className="text-lg font-semibold text-gray-900">About Recruiter</h1>
                            {selectedJob?.created_by?.email ? (
                              <div className="flex items-center text-gray-600 mt-2">
                                <MailIcon className="h-4 w-4 mr-2" />
                                <span className="font-medium mr-1">Email:</span>
                                <span>{selectedJob.created_by.email}</span>
                              </div>
                            ) : null}
                          </div>
                          < div className="flex items-center justify-between pt-2">
                            {isApplied ? (
                              <Button
                                disabled
                                className="text-white bgMain-gradient cursor-not-allowed"
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-2" />
                                Applied
                              </Button>
                            ) : (
                              <ApplyFlowDialog
                                jobId={selectedJobId}
                                onApplied={refetchSelectedJob}
                                trigger={
                                  <Button className="text-white bgMain-gradient">
                                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                                    Apply
                                  </Button>
                                }
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Jobs;