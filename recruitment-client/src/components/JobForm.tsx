import { Formik, Form, Field, ErrorMessage } from "formik"
import { createJob, updateJob } from "../api/jobAPI";

export default function JobForm({ initialValues, isEdit }: any) {
  const validate = (values: any) => {
    const errors: Record<string, string> = {};
    if (!values.title) {
      errors.title = "Title is required";
    }
    if (!values.description) {
      errors.description = "Description is required";
    }
    return errors;
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting, resetForm, setErrors }: any
  ) => {
    try {
      if (isEdit) {
        await updateJob(values._id, values);
      } else {
        await createJob({ ...values, userId: "SOME_ID" }); // giả định user đã login
      }
      alert("Success!");
      resetForm();
    } catch (err: any) {
      alert("Error: " + err.response?.data?.message || err.message);
      // Nếu server trả lỗi validation, bạn có thể set lỗi cụ thể cho từng field như:
      // setErrors({ title: "Error from server" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <label>Title</label>
          <Field name="title" className="form-control" />
          <ErrorMessage name="title" component="div" className="text-danger" />

          <label>Description</label>
          <Field name="description" className="form-control" />
          <ErrorMessage
            name="description"
            component="div"
            className="text-danger"
          />

          <label>Tags (comma separated)</label>
          <Field name="tags" className="form-control" />

          <button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={isSubmitting}
          >
            {isEdit ? "Update" : "Create"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
