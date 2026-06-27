import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";

import { 
    createTimetableEntry,
    createWeeklyTimetable,
    getWeeklyTimetableBySection,
    getDailyTeacherTimetable,
    getWeeklyTeacherTimetable,
    getDailyTimetableBySection
} from "../controllers/timetableController.js";

const router = Router();
router.use(protect);

// Timetable creation routes
router.post('/', restrictTo('SUPER_ADMIN', 'ADMIN'), createTimetableEntry);
router.post('/bulk', restrictTo('SUPER_ADMIN', 'ADMIN'), createWeeklyTimetable);

//Student Timetable retrieval routes
router.get('/section/:sectionId/daily',restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN', 'STUDENT'), getDailyTimetableBySection);
router.get('/section/:sectionId/weekly',restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN', 'STUDENT'), getWeeklyTimetableBySection);

// Teacher-specific timetable routes
router.get('/teacher/:teacherId/daily', restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getDailyTeacherTimetable); 
router.get('/teacher/:teacherId/weekly', restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getWeeklyTeacherTimetable); 

export default router;