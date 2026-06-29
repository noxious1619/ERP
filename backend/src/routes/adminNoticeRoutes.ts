import express from 'express';
import {
  getAdminNotices,
  deleteNotice,
  updateNotice,
  getClassesWithSections,
} from '../controllers/adminNoticeController.js';
import { createNotice } from '../controllers/noticeController.js';
import { getAdminDashboardStats } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

router.use(protect);
router.use(restrictTo('SUPER_ADMIN', 'ADMIN'));

// GET  /api/admin/notices              → list all notices (with optional ?category=)
// POST /api/admin/notices              → create a new notice (reuses existing createNotice)
router.route('/notices')
  .get(getAdminNotices)
  .post(createNotice);

// GET  /api/admin/notices/classes      → classes + sections for modal dropdowns
router.get('/notices/classes', getClassesWithSections);

// GET  /api/admin/dashboard/stats      → get admin dashboard stats
router.get('/dashboard/stats', getAdminDashboardStats);

// PATCH  /api/admin/notices/:id        → update a notice
// DELETE /api/admin/notices/:id        → delete a notice
router.route('/notices/:id')
  .patch(updateNotice)
  .delete(deleteNotice);

export default router;
