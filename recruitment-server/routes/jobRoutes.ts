import express from 'express';
import {
  createJob,
  getJobs,
  updateJob,
  deleteJob
} from '../controllers/jobController';
import { authorizeRoles } from '../middleware/authMiddleware'
const router = express.Router();

router.post('/', authorizeRoles('recruiter'), createJob);
router.get('/', getJobs);
router.put('/:id', authorizeRoles('recruiter'), updateJob);
router.delete('/:id', authorizeRoles('recruiter'), deleteJob);

export default router;