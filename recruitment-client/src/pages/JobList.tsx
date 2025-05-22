import {
  Box,
  Button,
  Typography,
  Stack,
  TablePagination,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { getJobs, deleteJob } from "../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
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
    await dispatch(deleteJob(id));
    setOpenDialog(false);
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
  const [openDialog, setOpenDialog] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedJobs = filteredJobs.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenDialog = (id: string) => {
    setJobToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setJobToDelete(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Job List</Typography>
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
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        sx={{ maxWidth: "100%" }}
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
          sx={{
            width: { xs: "100%", sm: 400 },
          }}
        />
        {role === "recruiter" && (
          <Button
            variant="contained"
            onClick={handleCreate}
            sx={{
              height: "fit-content",
              px: 3,
            }}
          >
            Create Job
          </Button>
        )}
      </Stack>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <div className="table-wrapper">
          <table className="table-container">
            <thead>
              <tr className="table-header">
                <th className="th-table">Title</th>
                <th className="th-table">Description</th>
                <th className="th-table">Tags</th>
                {role === "recruiter" && <th className="th-table">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedJobs.map((job) => (
                <tr key={job._id} className="table-row">
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
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(job._id)}
                        >
                          Update
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleOpenDialog(job._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this job? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => jobToDelete && handleDelete(jobToDelete)}
            color="error"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
