import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import {
  registerTeacher,
  updateTeacher,
  getMyProfile,
  assignTeacherToSectionSubject,
  getTeacherTeachingAssignments,
  getAllTeachers,
  getTeacherById,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = Router();
router.use(protect);

// Admin only
router.get(   "/",         restrictTo("SUPER_ADMIN", "ADMIN"), getAllTeachers);
router.post(  "/onboard",  restrictTo("SUPER_ADMIN", "ADMIN"), registerTeacher);
router.get(   "/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), getTeacherById);
router.patch( "/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), updateTeacher);
router.delete("/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), deleteTeacher);

// Teacher's own profile — must come before /:id
router.get("/me", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getMyProfile);

// Teaching assignments
router.post("/assign-subject-section", restrictTo("SUPER_ADMIN", "ADMIN"), assignTeacherToSectionSubject);
router.get("/:id/teaching-assignments", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getTeacherTeachingAssignments);

export default router;