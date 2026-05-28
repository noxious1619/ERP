import express from 'express';
import {
  createScheduledExam,
  getStudentUpcomingExams
} from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(protect);
router.post(
  '/',
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'),
  createScheduledExam
);
router.get(
  '/upcoming',
  restrictTo('STUDENT'),
  getStudentUpcomingExams
);
export default router;