import express from 'express';
import {
  createAssignment,
  getStudentAssignments,
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission,
  getAssignmentList,
  getAssignmentDetails,
  getAssignmentSummary,
  updateAssignment,
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    upload.single('file'),
    createAssignment
  );

router
  .route('/my-feed')
  .get(getStudentAssignments);

router
  .route('/submit')
  .post(
    restrictTo('STUDENT', 'TEACHER'),
    upload.single('file'),
    submitAssignment
  );

router
  .route('/list')
  .get(
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'),
    getAssignmentList
  );

router
  .route('/:id')
  .get(
    restrictTo('TEACHER', 'ADMIN'),
    getAssignmentDetails
  )
  .patch(
    restrictTo('TEACHER', 'ADMIN'),
    upload.single('file'),
    updateAssignment
  );

router
  .route('/:id/submissions')
  .get(
    restrictTo('TEACHER', 'ADMIN'),
    getAssignmentSubmissions
  );

router
  .route('/:id/summary')
  .get(
    restrictTo('TEACHER', 'ADMIN'),
    getAssignmentSummary
  );

router
  .route('/submissions/:submissionId/grade')
  .patch(
    restrictTo('TEACHER', 'ADMIN'),
    gradeSubmission
  );

export default router;