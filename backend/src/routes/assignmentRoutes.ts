import express from 'express';
import { 
  createAssignment, 
  getStudentAssignments, 
  submitAssignment,
  getAssignmentSubmissions,
  gradeSubmission  
} from '../controllers/assignmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';


const router = express.Router();

router.use(protect);

router.post(
  '/', 
  restrictTo('TEACHER', 'ADMIN'), 
  upload.single('file'), 
  createAssignment
);

// GET feed for the logged-in student
router.get(
  '/my-feed', 
  restrictTo('STUDENT'), 
  getStudentAssignments
);

// Students can submit homework
router.post(
  '/submit', 
  restrictTo('STUDENT'), 
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

export default router;