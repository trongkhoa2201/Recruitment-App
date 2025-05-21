import express from 'express';
import {
  createJob,
  getJobs,
} from '../controllers/jobController';
import { authorizeRoles } from '../middleware/authMiddleware'
const router = express.Router();

router.post('/', authorizeRoles('recruiter'), createJob);
router.get('/', getJobs);

export default router;