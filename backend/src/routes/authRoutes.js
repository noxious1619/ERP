import express from 'express';
import { login } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js'; // Import the new middleware
import { loginLimiter } from '../middleware/rateLimiter.js';
import { register } from '../controllers/authController.js';
const router = express.Router();
// PUBLIC ROUTE
router.post('/register', register);
router.post('/login', loginLimiter, login);
// PROTECTED ROUTES
router.use(protect);
router.get('/me', (req, res) => {
    res.json({ message: "Authenticated!", user: req.user });
});
router.get('/admin-dashboard', restrictTo('SUPER_ADMIN'), (req, res) => {
    res.json({ message: "Welcome to the Secret Admin Dashboard! 🔐" });
});
export default router;
//# sourceMappingURL=authRoutes.js.map