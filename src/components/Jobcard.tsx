import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';

function highlightText(text: string, search: string) {
  if (!search) return text;
  const regex = new RegExp(`(${search})`, 'gi');
  return text.split(regex).map((part, i) =>
    regex.test(part) ? (
      <span key={i} className="bg-yellow-200 text-black">{part}</span>
    ) : (
      part
    )
  );
}

function formatSalaryRange(job: any) {
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
    return `Rs ${String(job.salary)}`;
  }
  return "Not specified";
}

const JobCard = ({ job, searchTerm }: any) => {
  const navigate = useNavigate();

  const daysAgoFunction = (mongodbTime: any) => {
    if (!mongodbTime) return null;
    const createdAt = new Date(mongodbTime);
    const time = createdAt.getTime();
    if (Number.isNaN(time)) return null;
    return Math.floor((Date.now() - time) / (1000 * 60 * 60 * 24));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);
  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="p-6 rounded-xl shadow-lg bg-white border border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.03] m-4 sm:m-0 cursor-pointer">
      <div className="flex items-center justify-between mb-4 m-2">
        <p className="text-sm text-gray-500">
          {
            daysAgo === null
              ? ""
              : daysAgo === 0
                ? "Today"
                : daysAgo === 1
                  ? "1 day ago"
                  : `${daysAgo} days ago`
          }
        </p>
        <Button variant="outline" size="icon" className="rounded-full">
          <Bookmark className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <Avatar className="w-12 h-12">
          <AvatarImage src={job?.company?.logo || "https://via.placeholder.com/48"} />
        </Avatar>
        <div>
          <h2 className="font-semibold text-gray-800 text-base">{job?.company?.name}</h2>
          <p className="text-sm text-gray-500">{job?.location}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800 w-full">
          {highlightText(job?.title, searchTerm)}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {highlightText(job?.description, searchTerm)}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <Badge className="text-white font-medium border-primary bg-white text-primary">
          Experience: {typeof job?.experience === "number" && job.experience >= 0 ? job.experience : "0"}
        </Badge>
        <Badge className="text-white font-medium border-primary bg-white text-primary"> Position: {job?.position}</Badge>
        <Badge className="text-white font-medium border-primary bg-white text-primary">{job?.jobType}</Badge>
        <Badge className="text-white font-medium border-primary bg-white text-primary">{formatSalaryRange(job)}</Badge>
      </div>
    </div>
  );
};

export default JobCard;