import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import {
  registerStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router = Router();
router.use(protect);

router.get("/",           restrictTo("SUPER_ADMIN", "ADMIN"), getAllStaff);
router.post("/onboard",   restrictTo("SUPER_ADMIN", "ADMIN"), registerStaff);
router.get("/:id",        restrictTo("SUPER_ADMIN", "ADMIN"), getStaffById);
router.patch("/:id",      restrictTo("SUPER_ADMIN", "ADMIN"), updateStaff);
router.delete("/:id",     restrictTo("SUPER_ADMIN", "ADMIN"), deleteStaff);

export default router;