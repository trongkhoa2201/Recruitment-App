import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import JobForm from "./JobForm"; // Adjust the path to where JobForm is located

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
        tags: job.tags?.join(", ") || "", // Convert tags array to comma-separated string for the form
      }}
      isEdit={true}
    />
  );
}

export default JobEditWrapper;
