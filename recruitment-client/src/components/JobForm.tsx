import { Formik, Form, ErrorMessage } from "formik";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { createJob, updateJob } from "../features/jobs/jobSlice";
import { AppDispatch } from "../store/Store";
import { useNavigate } from "react-router-dom";

interface JobFormProps {
  initialValues: {
    _id?: string;
    title: string;
    description: string;
    tags?: string;
  };
  isEdit: boolean;
  role: string;
  onSuccess?: () => void;
}

export default function JobForm({
  initialValues,
  isEdit,
  role,
  onSuccess,
}: JobFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const validate = (values: typeof initialValues) => {
    const errors: Record<string, string> = {};
    if (!values.title) errors.title = "Title is required";
    if (!values.description) errors.description = "Description is required";
    return errors;
  };
  const navigate = useNavigate();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting, resetForm, setErrors }: any
  ) => {
    try {
      if (isEdit && values._id) {
        await dispatch(updateJob({ id: values._id, data: values })).unwrap();
      } else {
        await dispatch(createJob({ ...values })).unwrap(); // bạn có thể thêm userId từ auth
      }

      alert("Success!");
      resetForm();
      if (onSuccess) onSuccess();
      navigate("/")
    } catch (err: any) {
      console.error(err);
      alert("Error: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        {isEdit ? "Edit Job" : "Create Job"}
      </Typography>

      <Formik
        initialValues={initialValues}
        validate={validate}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, handleChange, values }) => (
          <Form>
            <Box mb={2}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                value={values.title}
                onChange={handleChange}
              />
              <ErrorMessage
                name="title"
                component="div"
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={values.description}
                onChange={handleChange}
              />
              <ErrorMessage
                name="description"
                component="div"
              />
            </Box>

            <Box mb={2}>
              <TextField
                label="Tags (comma separated)"
                name="tags"
                fullWidth
                value={values.tags || ""}
                onChange={handleChange}
              />
            </Box>

            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isEdit ? "Update Job" : "Create Job"}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  );
}
