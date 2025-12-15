import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/global/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSelector } from "react-redux";
import axiosInstance from "@/utils/axios";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        <div>
            <div className="bgMain-gradient">
                <Navbar />
            </div>
            <div className="max-w-2xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <ArrowLeft className="cursor-pointer" onClick={() => navigate("/recruiter/dashboard")} />
                        <h1 className="text-2xl font-bold text-gray-900">Create New Job</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Job Title</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salaryMin">Minimum Salary</Label>
                                <Input
                                    id="salaryMin"
                                    name="salaryMin"
                                    type="number"
                                    value={formData.salaryMin}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="salaryMax">Maximum Salary</Label>
                                <Input
                                    id="salaryMax"
                                    name="salaryMax"
                                    type="number"
                                    value={formData.salaryMax}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="requirement">Requirements</Label>
                            <Textarea
                                id="requirement"
                                name="requirement"
                                value={formData.requirement}
                                onChange={handleInputChange}
                                required
                                className="w-full"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="position">Number of Positions</Label>
                                <Input
                                    id="position"
                                    name="position"
                                    type="number"
                                    value={formData.position}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience (years)</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={formData.experience}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="jobType">Job Type</Label>
                                <Input
                                    id="jobType"
                                    name="jobType"
                                    value={formData.jobType}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border rounded-md"
                                >

                                </Input>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                {companies && companies.length > 0 ? (
                                    <select
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full p-2 border rounded-md"
                                    >
                                        <option value="">Select Company</option>
                                        {companies.map((company: any) => (
                                            <option key={company._id} value={company._id}>
                                                {company.name}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <Input
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Enter company name"
                                        className="w-full"
                                    />
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-primary text-white cursor-pointer">
                            Create Job
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateJob; 