import express from 'express';
import { createAcademicYear, getAcademicYears , createClass, createSection, createSubject, createTimetableEntry } from '../controllers/academicController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect); // All academic routes need a login

router.route('/years')
  .get(getAcademicYears)
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createAcademicYear);

router.post('/classes', restrictTo('SUPER_ADMIN', 'ADMIN'), createClass);
router.post('/sections', restrictTo('SUPER_ADMIN', 'ADMIN'), createSection);
router.post('/subjects', restrictTo('SUPER_ADMIN', 'ADMIN'), createSubject);
router.post('/timetable', restrictTo('SUPER_ADMIN', 'ADMIN'), createTimetableEntry);



export default router;