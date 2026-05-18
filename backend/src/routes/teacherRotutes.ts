import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from '../middleware/roleMiddleware.js';
import { registerTeacher } from "../controllers/teacherController.js";

const router = Router();
router.use(protect);


// In a real app, you'd protect this with an Admin middleware
router.post(
    "/onboard",
    restrictTo("SUPER_ADMIN", "ADMIN"), 
    registerTeacher);

export default router;