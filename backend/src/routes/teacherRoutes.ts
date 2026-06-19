import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import {
  registerTeacher,
  updateTeacher,
  getMyProfile,
  assignTeacherToSectionSubject,
  getTeacherTeachingAssignments 
} from "../controllers/teacherController.js";

const router = Router();
router.use(protect);

// Admin only
router.post("/onboard", restrictTo("SUPER_ADMIN", "ADMIN"), registerTeacher);
router.patch("/:id",    restrictTo("SUPER_ADMIN", "ADMIN"), updateTeacher);

// Teacher's own profile
router.get("/me", restrictTo("TEACHER","ADMIN","SUPER_ADMIN"), getMyProfile);

// Teacher's teaching assignments
router.post("/assign-subject-section", restrictTo("SUPER_ADMIN", "ADMIN"), assignTeacherToSectionSubject);
router.get("/:id/teaching-assignments", restrictTo("TEACHER","ADMIN","SUPER_ADMIN"), getTeacherTeachingAssignments);

export default router;