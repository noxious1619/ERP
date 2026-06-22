import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

import { 
    createTimetableEntry,
    getStudentTimetable,
    createWeeklyTimetable,
    getWeeklyTimetableBySection,
    getTeacherMySubjectTimetable,
    getTeacherMySubjectWeekly,
    getDailyTimetableBySection
} from "../controllers/timetableController.js";

const router = Router();
router.use(protect);

router.post('/', restrictTo('SUPER_ADMIN', 'ADMIN'), createTimetableEntry);
router.get('/student', getStudentTimetable);
router.post('/bulk', restrictTo('SUPER_ADMIN', 'ADMIN'), createWeeklyTimetable);
router.get('/section/:sectionId', getWeeklyTimetableBySection);
router.get('/teacher/my-subject', restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getTeacherMySubjectTimetable);
router.get('/teacher/my-subject/weekly', restrictTo('TEACHER'), getTeacherMySubjectWeekly);
router.get('/section/:sectionId/daily', getDailyTimetableBySection);

export default router;