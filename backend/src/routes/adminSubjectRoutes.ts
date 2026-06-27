import express from 'express';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  bulkDeleteSubjects,
  getClasses,
  getSectionsByClass,
  getTeachers,
  getSubjectById
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('SUPER_ADMIN', 'ADMIN'));

router.route('/')
  .get(getAllSubjects)
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createSubject);

router.get('/classes', getClasses);
router.get('/classes/:classId/sections', getSectionsByClass);
router.get('/teachers', getTeachers);

router.post('/bulk-delete', restrictTo('SUPER_ADMIN', 'ADMIN'), bulkDeleteSubjects);

router.route('/:id')
  .get(getSubjectById)
  .patch(restrictTo('SUPER_ADMIN', 'ADMIN'), updateSubject);

export default router;
