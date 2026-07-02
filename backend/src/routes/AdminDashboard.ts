import express from 'express';
import { getAdminDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();

router.use(protect);
router.use(restrictTo('SUPER_ADMIN', 'ADMIN'));

