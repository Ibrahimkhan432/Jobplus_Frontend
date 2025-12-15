import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
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
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <ArrowLeft className="cursor-pointer" onClick={() => navigate("/recruiter/dashboard")} />
        <h1 className="text-2xl font-bold text-gray-900">Edit Job</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required />
        <Input name="salaryMin" value={(formData as any).salaryMin} onChange={handleChange} placeholder="Minimum Salary" required />
        <Input name="salaryMax" value={(formData as any).salaryMax} onChange={handleChange} placeholder="Maximum Salary" required />
        <Input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required />
        <Input name="requirement" value={formData.requirement} onChange={handleChange} placeholder="Requirement" required />
        <Input name="position" value={formData.position} onChange={handleChange} placeholder="Position (Number)" required />
        <Input name="jobType" value={formData.jobType} onChange={handleChange} placeholder="Job Type (e.g. Full-Time)" required />
        <Input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience (Years)" required />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Job Description"
          rows={4}
          className="w-full border rounded-lg p-3"
        ></textarea>
        <Button type="submit" className="w-full text-white">Update Job</Button>
      </form>
    </div>
  );
};

export default EditJob;
