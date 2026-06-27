import express from 'express';
import { 
  createAcademicYear, 
  getAcademicYears, 
  createClass, 
  createSection, 
  createSubject, 
  getSubjects,
  createTimetableEntry,
  getStudentTimetable,
  createWeeklyTimetable,
  getWeeklyTimetableBySection,
  getTeacherMySubjectTimetable,
  getTeacherMySubjectWeekly,
  getDailyTimetableBySection,
  getClassesByYear,
  getSectionsByClass,
   updateSection,
  deleteSection,
  deleteClass
} from '../controllers/academicController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); 

router.route('/years')
  .get(restrictTo('SUPER_ADMIN', 'ADMIN'), getAcademicYears)
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createAcademicYear);

router.post('/classes', restrictTo('SUPER_ADMIN', 'ADMIN'), createClass);
router.get('/classes',restrictTo('SUPER_ADMIN', 'ADMIN'), getClassesByYear);
router.delete('/classes/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteClass)
router.get('/sections', restrictTo('SUPER_ADMIN', 'ADMIN'), getSectionsByClass);
router.post('/sections', restrictTo('SUPER_ADMIN', 'ADMIN'), createSection);
router
  .route("/subjects")
  .get(
    restrictTo("SUPER_ADMIN", "ADMIN"),
    getSubjects
  )
  .post(
    restrictTo("SUPER_ADMIN", "ADMIN"),
    createSubject
  );
router.post('/timetable', restrictTo('SUPER_ADMIN', 'ADMIN'), createTimetableEntry);
router.get('/timetable/student', getStudentTimetable);
router.post('/timetable/bulk', restrictTo('SUPER_ADMIN', 'ADMIN'), createWeeklyTimetable);
router.get('/timetable/section/:sectionId', getWeeklyTimetableBySection);
router.get('/timetable/teacher/my-subject', restrictTo('TEACHER', 'SUPER_ADMIN', 'ADMIN'), getTeacherMySubjectTimetable);
router.get('/timetable/teacher/my-subject/weekly', restrictTo('TEACHER'), getTeacherMySubjectWeekly);
router.get('/timetable/section/:sectionId/daily', getDailyTimetableBySection);
router.patch('/sections/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), updateSection)
router.delete('/sections/:id', restrictTo('SUPER_ADMIN', 'ADMIN'), deleteSection)

export default router;