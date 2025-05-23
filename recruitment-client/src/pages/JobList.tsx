import { Typography, Stack, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { getJobs, deleteJob } from "../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import NotificationJobLog from "../components/NotificationJobLog";
import "../styles/jobList.css";

export default function JobList({ role }: { role: string }) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const jobs = useSelector((state: RootState) => state.jobs.items);
  const loading = useSelector((state: RootState) => state.jobs.loading);

  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username") || "";

  const getUserShortName = (name: String) => {
    if (!name) return "Profile";
    const parts = name.trim().split(" ");
    const first = parts[parts.length - 1];
    const lastInitial = parts.length > 1 ? parts[0][0].toUpperCase() : "";
    return `${first} ${lastInitial}.`;
  };

  const shortName = getUserShortName(username);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    dispatch(getJobs({}));
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this job? This action cannot be undone."
      )
    ) {
      await dispatch(deleteJob(id));
    }
  };

  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const toggleJobSelection = (id: string) => {
    setSelectedJobs((prev) =>
      prev.includes(id) ? prev.filter((jid) => jid !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete ${selectedJobs.length} jobs? This action cannot be undone.`
      )
    ) {
      for (const id of selectedJobs) {
        await dispatch(deleteJob(id));
      }
      setSelectedJobs([]);
    }
  };

  const handleEdit = (jobId: string) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleCreate = () => {
    navigate("/jobs/create");
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedJobs = filteredJobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div className="container" style={{ position: "relative" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Job List</Typography>
        <div className="header-right">
          <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-user">
              Settings
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              {token ? (
                <>
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    {shortName}
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                </>
              ) : (
                <>
                  <Dropdown.Item onClick={() => navigate("/login")}>
                    Login
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/register")}>
                    Register
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>

            <NotificationJobLog />
        </div>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        className="search-create-container"
      >
        <TextField
          label="Search jobs"
          variant="outlined"
          size="medium"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(0);
          }}
          className="search-input"
        />
        {role === "recruiter" && (
          <div>
            <button onClick={handleCreate} className="create-button">
              Create Job
            </button>

            <button
              onClick={handleDeleteSelected}
              className="delete-button"
              style={{ marginBottom: "16px" }}
            >
              Delete Selected ({selectedJobs.length})
            </button>
          </div>
        )}
      </Stack>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div className="table-wrapper">
          <table className="table-container">
            <thead>
              <tr className="table-header">
                {role === "recruiter" && <th className="th-table"></th>}
                <th className="th-table">Title</th>
                <th className="th-table">Description</th>
                <th className="th-table">Tags</th>
                {role === "recruiter" && <th className="th-table">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr key={job._id} className="table-row">
                  {role === "recruiter" && (
                    <td className="td-table">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job._id)}
                        onChange={() => toggleJobSelection(job._id)}
                      />
                    </td>
                  )}
                  <td className="td-table">
                    <span
                      className="job-link"
                      onClick={() => navigate(`/jobs/${job._id}`)}
                    >
                      {job.title}
                    </span>
                  </td>
                  <td className="td-table">{job.description}</td>
                  <td className="td-table">{job.tags?.join(", ")}</td>
                  {role === "recruiter" && (
                    <td className="td-table">
                      <div className="actions-stack">
                        <button
                          className="action-btn update-btn"
                          onClick={() => handleEdit(job._id)}
                        >
                          Update
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination-container">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              disabled={page === 0}
              className="pagination-btn"
            >
              Prev
            </button>

            {Array.from({
              length: Math.ceil(filteredJobs.length / rowsPerPage),
            }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`pagination-btn ${i === page ? "active" : ""}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredJobs.length / rowsPerPage) - 1
                  )
                )
              }
              disabled={
                page >= Math.ceil(filteredJobs.length / rowsPerPage) - 1
              }
              className="pagination-btn"
            >
              Next
            </button>

            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="pagination-select"
            >
              {[5, 10, 25].map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
