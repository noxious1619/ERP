import express from 'express';
import { markBulkAttendance, getSectionAttendance } from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';


const router = express.Router();
router.use(protect);


router.post('/bulk', restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), markBulkAttendance);
router.get('/section', restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), getSectionAttendance);

export default router;