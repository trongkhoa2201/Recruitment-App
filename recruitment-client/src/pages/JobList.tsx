import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/Store";
import { getJobs, deleteJob } from "../features/jobs/jobSlice";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";

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
    if (window.confirm("Are you sure you want to delete this job?")) {
      await dispatch(deleteJob(id));
    }
  };

  const handleEdit = (jobId: string) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  const handleCreate = () => {
    navigate("/jobs/create");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="h4">Job List</Typography>
        {role === "recruiter" && (
          <Button variant="contained" onClick={handleCreate}>
            Create Job
          </Button>
        )}
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

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Title</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Tags</strong>
                </TableCell>
                {role === "recruiter" && (
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job._id}>
                  <TableCell
                    sx={{
                      cursor: "pointer",
                      color: "primary.main",
                      textDecoration: "underline",
                    }}
                    onClick={() => navigate(`/jobs/edit/${job._id}`)}
                  >
                    {job.title}
                  </TableCell>
                  <TableCell>{job.description}</TableCell>
                  <TableCell>{job.tags?.join(", ")}</TableCell>
                  {role === "recruiter" && (
                    <TableCell>
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
                          onClick={() => handleDelete(job._id)}
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
