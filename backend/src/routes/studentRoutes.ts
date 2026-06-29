import { Router } from "express";
import { admitStudent, bulkAdmitStudents, getAllStudents, getStudentProfile, updateStudent, bulkDeleteStudents } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from '../middleware/roleMiddleware.js'; 
import { upload } from "../middleware/uploadMiddleware.js";
const router = Router();
router.use(protect);
// 1. ADMIT: 
router.post(
  "/admit", 
  restrictTo("SUPER_ADMIN", "ADMIN"), 
  admitStudent
);
// 2. SEARCH: 
router.get(
  "/", 
  restrictTo("SUPER_ADMIN", "ADMIN", "TEACHER"), 
  getAllStudents
);
// 3. PROFILE: 
router.get(
  "/me", 
  restrictTo("STUDENT", "TEACHER","ADMIN", "SUPER_ADMIN"), 
  getStudentProfile
);
router.post(
  "/bulk-admit", 
  restrictTo("ADMIN", "SUPER_ADMIN"), 
  upload.single("file"), 
  bulkAdmitStudents
);

router.patch(
  "/:id",
  restrictTo("SUPER_ADMIN", "ADMIN"),
  updateStudent
);

router.post(
  "/bulk-delete",
  restrictTo("SUPER_ADMIN", "ADMIN"),
  bulkDeleteStudents
);

export default router;