import express from 'express';
import { login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js'; // Import the new middleware
import { loginLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/login',loginLimiter, login);
router.get('/me', protect, (req: any, res) => {
  res.json({ message: "Authenticated!", user: req.user });
});

router.get('/admin-dashboard', 
  protect, 
  restrictTo('SUPER_ADMIN'), 
  (req: any, res) => {
    res.json({ message: "Welcome to the Secret Admin Dashboard! 🔐" });
  }
);

export default router;