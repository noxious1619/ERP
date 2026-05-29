import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from '../middleware/roleMiddleware.js';
import { createParentAccount ,upsertParentForStudent} from "../controllers/parentController.js";

const router = Router();
router.use(protect);

// In a real app, you'd protect this with an Admin middleware
router.post(
    "/onboard",
    restrictTo("SUPER_ADMIN", "ADMIN"), 
    createParentAccount);

router.patch(
  "/:studentId",
  restrictTo("SUPER_ADMIN", "ADMIN"),
  upsertParentForStudent
);

export default router;