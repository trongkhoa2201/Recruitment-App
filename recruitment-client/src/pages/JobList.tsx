import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { getJobs } from "../features/jobs/jobSlice";
import { Table, Form, Spinner } from "react-bootstrap";

function JobsList() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.jobs);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getJobs({ search }));
  }, [dispatch, search]);

  return (
    <div>
      <h2>Job Listings</h2>

      <Form.Control
        type="text"
        placeholder="Search by title or description"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-3"
      />

      {loading ? (
        <Spinner animation="border" />
      ) : error ? (
        <div className="text-danger">Error: {error}</div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Tags</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((job: any) => (
              <tr key={job._id}>
                <td>{job.title}</td>
                <td>{job.description}</td>
                <td>{job.tags?.join(", ")}</td>
                <td>{new Date(job.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default JobsList;