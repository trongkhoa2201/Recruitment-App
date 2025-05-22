import express from 'express';
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob,
  applyJob,
  getApplicants, 
  deleteJobsBulk
} from '../controllers/jobController';
import { authorizeRoles } from '../middleware/authMiddleware'
const router = express.Router();

router.post('/', authorizeRoles('recruiter'), createJob);
router.get('/', getJobs);
router.put('/:id', authorizeRoles('recruiter'), updateJob);
router.delete('/:id', authorizeRoles('recruiter'), deleteJob);
router.post('/delete-bulk', authorizeRoles('recruiter'), deleteJobsBulk);
router.post("/:id/apply", authorizeRoles('user'), applyJob); 
router.get("/:id/applicants", authorizeRoles('recruiter'), getApplicants);

export default router;