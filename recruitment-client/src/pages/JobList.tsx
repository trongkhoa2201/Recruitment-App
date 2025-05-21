import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { getJobs } from "../features/jobs/jobSlice";
import { Table, Form, Spinner } from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import "../styles/jobList.css";

function JobsList() {

  const navigate = useNavigate();
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

  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.jobs);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getJobs({ search }));
  }, [dispatch, search]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div>
      <header>
        <div className="container-fluid">
          <div className="row">
            <div className="title col-sm-4">
              <h2>Job Listings</h2>
            </div>
            <div className="DropdownContainer col-sm-8">
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
                      <Dropdown.Item onClick={handleLogout}>
                        Logout
                      </Dropdown.Item>
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
            </div>
          </div>
        </div>
      </header>

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
