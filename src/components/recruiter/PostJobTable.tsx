"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGetRecruiterJobs from "@/hooks/useGetRecruiterJobs"
import {

    EditIcon,
    UsersIcon,
    MapPinIcon,
    DollarSignIcon,
    ClockIcon,
    User,
} from "lucide-react"
import axiosInstance from "@/utils/axios"

function PostJobTable() {
    const navigate = useNavigate()
    useGetRecruiterJobs()
    const recruiterJobs = useSelector((store: any) => store.job.allRecruiterJobs)
    const searchJobByName = useSelector((store: any) => store.job.searchJobByName)
    const [filteredJobs, setFilteredJobs] = useState(recruiterJobs)
    const [allMyJobs, setAllMyJobs] = useState([]);

    useEffect(() => {
        const fetchMyJobs = async () => {
            try {
                const res = await axiosInstance.get(`/job/myJobs`, {
                    // withCredentials: true,
                });
                if (res.data.success) {
                    setAllMyJobs(res.data.jobs);
                    setFilteredJobs(res.data.jobs);
                }
            } catch (error) {
                console.error("Failed to fetch recruiter jobs", error);
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

    if (!filteredJobs || filteredJobs.length === 0) {
        return (
            <div className="text-center py-8">
                <div className="text-gray-500 text-lg">No jobs found</div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Posted Jobs</h2>

            {filteredJobs.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-500">
                        No jobs found matching "<span className="font-semibold">{searchJobByName}</span>"
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredJobs.map((job: any) => (
                        <div
                            key={job._id}
                            className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{job.title}</h3>
                                            <div className="flex items-center gap-4 mb-3">
                                                <Badge variant="secondary" className="text-xs">
                                                    {job.jobType || "Full-time"}
                                                </Badge>
                                                <div className="flex items-center text-gray-600 text-sm">
                                                    <MapPinIcon className="h-4 w-4 mr-1" />
                                                    {job.location}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Posted</p>
                                            <p className="text-sm font-medium text-gray-700">{formatDate(job.createdAt)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center text-gray-600 text-sm">
                                            <DollarSignIcon className="h-4 w-4 mr-2 text-green-600" />
                                            <span className="font-medium">Salary:</span>
                                            <span className="ml-1">{formatSalary(job)}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm">
                                            <ClockIcon className="h-4 w-4 mr-2 text-blue-600" />
                                            <span className="font-medium">Experience:</span>
                                            <span className="ml-1">{job.experience} years</span>
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm">
                                            <User className="h-4 w-4 mr-2 text-purple-600" />
                                            <span className="font-medium">Positions:</span>
                                            <span className="ml-1">{job.position}</span>
                                        </div>
                                    </div>
                                    {job.requirement && (
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                <span className="font-medium">Requirements:</span> {job.requirement}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500">Last updated: {formatDate(job.updatedAt)}</div>

                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/recruiter/dashboard/${job._id}`)}
                                        className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer"
                                    >
                                        <EditIcon className="h-4 w-4 mr-1" />
                                        Edit
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate(`/recruiter/jobs/${job._id}/applicants`)}
                                        className="text-purple-600 border-purple-200 hover:bg-purple-50 cursor-pointer"
                                    >
                                        <UsersIcon className="h-4 w-4 mr-1" />
                                        Applicants
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default PostJobTable
