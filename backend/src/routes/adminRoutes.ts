import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { getAdminProfile } from "../controllers/adminController.js";

const router = Router();

router.get(
  "/me",
  protect,
  restrictTo("ADMIN", "SUPER_ADMIN"),
  getAdminProfile
);

export default router;