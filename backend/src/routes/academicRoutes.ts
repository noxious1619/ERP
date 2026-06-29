import express from 'express';
import {
  createAcademicYear,
  getAcademicYears,
  createClass,
  createSection,
  createSubject,
} from '../controllers/academicController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/years')
  .get(getAcademicYears)
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createAcademicYear);

router
  .route('/classes')
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createClass);

router
  .route('/sections')
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createSection);

router
  .route('/subjects')
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createSubject);

export default router;