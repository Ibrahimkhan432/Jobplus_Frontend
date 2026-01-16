import { useDispatch, useSelector } from "react-redux";
import Navbar from "./global/Navbar";
import JobCard from "./Jobcard";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchedQuery } from "../../redux/jobSlice";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Browser() {
  useGetAllJobs();

  const navigate = useNavigate();

  const { allJobs } = useSelector((store: any) => store.job);
  const dispatch = useDispatch();

  console.log("Browser component - allJobs:", allJobs);
  useEffect(() => {
    dispatch(setSearchedQuery(""));
  }, [dispatch]);

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 mt-5  px-2">
        <h1 className="text-xl font-bold ml-4">
          Search Results {allJobs.length}
        </h1>
        <div className="grid lg:grid-cols-3 gap-4 mt-2">
          {allJobs && allJobs.length > 0 ? (
            allJobs.map((job: any) => (
              <JobCard
                key={job._id}
                job={job}
                onSelect={(id: string) => navigate(`/jobs?jobId=${id}`)}
              />
            ))
          ) : (
            <div className="col-span-3 flex flex-col items-center justify-center py-20">
              <h2 className="text-2xl font-semibold text-gray-600">
                No jobs found.
              </h2>
              <p className="text-gray-400 mt-2">
                Try adjusting your search or check back later.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default Browser;
