import express from 'express';
import { createNotice, getMyNotices, getTeacherNotices } from '../controllers/noticeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();
// ADMINS Create a notice
router.post('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN'), createNotice);
// STUDENTS: Get notices for student
router.get('/my', protect, restrictTo('STUDENT', 'SUPER_ADMIN', 'TEACHER', 'ADMIN'), getMyNotices);
// TEACHERS: Get notices for teacher
router.get('/teacher', protect, restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getTeacherNotices);
export default router;