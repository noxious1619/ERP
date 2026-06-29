import express from 'express';
import { createNotice, getMyNotices, getTeacherNotices } from '../controllers/noticeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect);

router.post('/', restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), createNotice);

router.get('/my', restrictTo('STUDENT', 'SUPER_ADMIN', 'TEACHER', 'ADMIN'), getMyNotices);
router.get('/teacher', restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getTeacherNotices);
export default router;