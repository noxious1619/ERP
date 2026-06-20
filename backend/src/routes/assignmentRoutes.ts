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

} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.use(protect);

router.post(
  '/', 
  restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
  upload.single('file'), 
  createAssignment
);

// GET feed for the logged-in student
router.get(
  '/my-feed', 
  getStudentAssignments
);

// Students can submit homework
router.post(
  '/submit', 
  restrictTo('STUDENT', 'TEACHER'), 
  upload.single('file'), 
  submitAssignment
);

// Teacher routes
router.get('/:id/submissions', 
  restrictTo('TEACHER', 'ADMIN'), 
  getAssignmentSubmissions
);

router.patch('/submissions/:submissionId/grade', 
  restrictTo('TEACHER', 'ADMIN'), 
  gradeSubmission
);

// Get list of assignments for students
router.get('/list', 
  restrictTo('TEACHER', 'ADMIN'), 
  getAssignmentList
);

// Get details of a specific assignment
router.get('/:id', 
  restrictTo('TEACHER', 'ADMIN'), 
  getAssignmentDetails
);

// Get summary of a specific assignment
router.get('/:id/summary', 
  restrictTo('TEACHER', 'ADMIN'), 
  getAssignmentSummary
);

export default router;