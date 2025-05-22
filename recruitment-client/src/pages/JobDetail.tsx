import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../store/Store";
import { Button, Box, Typography } from "@mui/material";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Lấy job từ store theo id
  const job = useSelector((state: RootState) =>
    state.jobs.items.find((job) => job._id === id)
  );

  if (!job) {
    return <Typography variant="h6">Job not found</Typography>;
  }

  const handleApply = async () => {
    try {
      // TODO: gọi action applyJob hoặc API để apply job
      // await dispatch(applyJob(id)).unwrap();

      alert("Applied successfully!");
      // navigate hoặc làm gì khác nếu cần
    } catch (error: any) {
      alert("Apply failed: " + (error.message || "Unknown error"));
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

      <Button variant="contained" color="primary" onClick={handleApply}>
        Apply
      </Button>
    </Box>
  );
}
