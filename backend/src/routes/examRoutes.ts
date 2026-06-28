import express from 'express';
import {
  createScheduledExam,
  getStudentUpcomingExams,
  getDatesheet,
  publishDatesheet,
} from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect);

// Admin — publish full datesheet in one shot
router.post(
  '/publish',
  restrictTo('ADMIN', 'SUPER_ADMIN'),
  publishDatesheet
);

// Admin/Teacher — single exam creation (kept for backwards compat)
router.post(
  '/',
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'),
  createScheduledExam
);

// Student — upcoming exams for their class
router.get(
  '/upcoming',
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT'),
  getStudentUpcomingExams
);

// Teacher/Admin — full class datesheet with optional subject filter
router.get(
  '/datesheet',
  restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
  getDatesheet
);

export default router;