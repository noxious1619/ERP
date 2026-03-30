import express from 'express';
import { markBulkAttendance, getSectionAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';


const router = express.Router();

router.post('/bulk', protect, restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), markBulkAttendance);
router.get('/section', protect, restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), getSectionAttendance);

export default router;