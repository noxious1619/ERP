import express from 'express';
import { createScheduledExam, getStudentUpcomingExams, getDatesheet } from '../controllers/examController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(protect);
router.post('/', restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), createScheduledExam);
router.get('/upcoming', restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER', 'STUDENT'), getStudentUpcomingExams);
router.get("/datesheet", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getDatesheet);
export default router;
//# sourceMappingURL=examRoutes.js.map