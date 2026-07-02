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
  deleteMultipleTeachers,
} from "../controllers/teacherController.js";

const router = Router();
router.use(protect);

// Admin only
router.get(   "/",         restrictTo("SUPER_ADMIN", "ADMIN"), getAllTeachers);
router.post(  "/onboard",  restrictTo("SUPER_ADMIN", "ADMIN"), registerTeacher);
router.patch( "/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), updateTeacher);
router.delete(
  "/bulk-delete",
  restrictTo("SUPER_ADMIN", "ADMIN"),
  deleteMultipleTeachers
);
router.delete("/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), deleteTeacher);

// ── Must come BEFORE /:id ──
router.get("/me", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getMyProfile);
router.get("/:id/teaching-assignments", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getTeacherTeachingAssignments);

// ── After /me ──
router.get("/:id", restrictTo("SUPER_ADMIN", "ADMIN"), getTeacherById);

// Teaching assignments (admin only)
router.post("/assign-subject-section", restrictTo("SUPER_ADMIN", "ADMIN"), assignTeacherToSectionSubject);

export default router;