import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from '../middleware/roleMiddleware.js';
import { registerStaff } from "../controllers/staffController.js";

const router = Router();

// In a real app, you'd protect this with an Admin middleware
router.post(
    "/onboard",
    protect,
    restrictTo("SUPER_ADMIN", "ADMIN"), 
    registerStaff);

export default router;