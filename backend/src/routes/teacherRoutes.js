import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { restrictTo } from "../middleware/roleMiddleware.js";
import { registerTeacher, updateTeacher, getMyProfile, } from "../controllers/teacherController.js";
const router = Router();
router.use(protect);
// Admin only
router.post("/onboard", restrictTo("SUPER_ADMIN", "ADMIN"), registerTeacher);
router.patch("/:id", restrictTo("SUPER_ADMIN", "ADMIN"), updateTeacher);
// Teacher's own profile
router.get("/me", restrictTo("TEACHER", "ADMIN", "SUPER_ADMIN"), getMyProfile);
export default router;
//# sourceMappingURL=teacherRoutes.js.map