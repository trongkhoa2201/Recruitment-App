import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import JobForm from "./JobForm";

function JobEditWrapper() {
  const { id } = useParams(); // Get the job ID from the URL
  const job = useSelector((state: RootState) =>
    state.jobs.items.find((j) => j._id === id)
  );

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <JobForm
      role="recruiter"
      initialValues={{
        _id: job._id,
        title: job.title,
        description: job.description,
        tags: job.tags?.join(", ") || "", 
      }}
      isEdit={true}
    />
  );
}

export default JobEditWrapper;
