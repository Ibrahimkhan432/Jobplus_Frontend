import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import JobCard from "./Jobcard";

function LatestJobs() {
  const navigate = useNavigate();
  const { allJobs } = useSelector((store: any) => store.job);
  console.log("allJobs in LatestJobs:", allJobs);

  return (
    <section className="px-4 sm:px-6 lg:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Featured Jobs
            </h2>
            <p className="text-sm sm:text-base text-blue-600 mt-2">
              Explore our latest job opportunities
            </p>
          </div>
          <div>
            <Link to="/jobs">
              <Button className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-500 cursor-pointer border border-blue-200 shadow-sm">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allJobs?.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
                No Jobs Found
              </h1>
              <p className="text-sm text-gray-500">
                Try checking back later or explore other categories.
              </p>
            </div>
          ) : (
            allJobs?.slice(0, 6).map((job: any) => (
              <JobCard
                key={job._id}
                job={job}
                onSelect={(id: string) => navigate(`/jobs?jobId=${id}`)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default LatestJobs;
