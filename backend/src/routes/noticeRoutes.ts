import express from 'express';
import { createNotice, getMyNotices } from '../controllers/noticeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js'; // Import the new middleware

const router = express.Router();

// 📢 ADMINS ONLY: Create a new notice
router.post('/', protect, restrictTo('ADMIN', 'SUPER_ADMIN',"TEACHER"), createNotice);

// 👤 ALL USERS: Get notices specifically targeted to them
router.get('/my', protect, getMyNotices);

export default router;