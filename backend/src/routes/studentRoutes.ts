import { Router } from "express";
import { admitStudent, bulkAdmitStudents, getAllStudents, getStudentProfile } from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from '../middleware/roleMiddleware.js'; 
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

// 1. ADMIT: 
router.post(
  "/admit", 
  protect, 
  restrictTo("SUPER_ADMIN", "ADMIN"), 
  admitStudent
);

// 2. SEARCH: 
router.get(
  "/", 
  protect, 
  restrictTo("SUPER_ADMIN", "ADMIN", "TEACHER"), 
  getAllStudents
);

// 3. PROFILE: 
router.get(
  "/me", 
  protect, 
  getStudentProfile
);

router.post(
  "/bulk-admit", 
  protect, 
  restrictTo("ADMIN", "SUPER_ADMIN"), 
  upload.single("file"), 
  bulkAdmitStudents
);


export default router;