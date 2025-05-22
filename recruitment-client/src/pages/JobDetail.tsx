import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import {
  Button,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const job = useSelector((state: RootState) =>
    state.jobs.items.find((job) => job._id === id)
  );

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/jobs/${id}/applicants`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setApplicants(res.data);
      } catch (error) {
        console.error("Error fetching applicants", error);
      }
    };

    if (currentUser?.role === "recruiter") {
      fetchApplicants();
    }
  }, [currentUser, id]);

  if (!job) {
    return <Typography variant="h6">Job not found</Typography>;
  }

  const handleApply = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/jobs/${id}/apply`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(res.data.message || "Applied successfully!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(
        "Apply failed: " + (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body1" mb={2}>
        {job.description}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Tags: {job.tags?.join(", ")}
      </Typography>

      {currentUser?.role === "user" && (
        <Button variant="contained" color="primary" onClick={handleApply}>
          Apply
        </Button>
      )}

      {currentUser?.role === "recruiter" && (
        <>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" gutterBottom>
            Applicants:
          </Typography>
          {applicants.length === 0 ? (
            <Typography>No applicants yet.</Typography>
          ) : (
            <List>
              {applicants.map((app) => (
                <ListItem key={app._id}>
                  <ListItemText
                    primary={app.userId?.name}
                    secondary={`Email: ${
                      app.userId?.email
                    } - Applied at: ${new Date(
                      app.timestamp
                    ).toLocaleString()}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </>
      )}
    </Box>
  );
}
