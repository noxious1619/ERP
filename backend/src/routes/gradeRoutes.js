import express from 'express';
import { createExamTerm, createAssessmentComponents, createGradingScale, updateSchoolConfig, getGradeSheet, saveMarks, calculateResults, getStudentResults, getStudentFullSummary, } from '../controllers/gradeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(protect);
// 1. Create an Exam Term (e.g., "Term 1")
router.post('/terms', restrictTo('ADMIN', 'SUPER_ADMIN'), createExamTerm);
// 2. Create Assessment Slots (Theory/Practical) for a Subject
router.post('/components', restrictTo('ADMIN', 'SUPER_ADMIN'), createAssessmentComponents);
// 3. Define the Grading Scale (A1, B2, etc.)
router.post('/scales', restrictTo('ADMIN', 'SUPER_ADMIN'), createGradingScale);
// 4. Global Display Toggle (Percentage vs Grade vs CGPA)
router.patch('/config', restrictTo('ADMIN', 'SUPER_ADMIN'), updateSchoolConfig);
// 5. Get Grade Sheet for a Class/Subject/Term
router.get('/sheet', restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), getGradeSheet);
// 6. Save Marks for Students
router.post('/marks', restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), saveMarks);
// 7. Calculate Final Results and Assign Grades
router.post('/calculate', restrictTo('ADMIN', 'SUPER_ADMIN'), calculateResults);
// 8. Get Final Results for a Student
router.get('/results/:studentId', restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), getStudentResults);
// 9. Get Full Summary (Marks + Grades) for a Student
router.get('/summary/:studentId', restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), getStudentFullSummary);
export default router;
//# sourceMappingURL=gradeRoutes.js.map