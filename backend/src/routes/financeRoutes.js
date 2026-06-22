import express from 'express';
import { updateFeeStructure, getFeeStructure, generateMonthlyFees, updatePaymentStatus, getDefaulters, getMyFeeHistory } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(protect);
// Routes for Fee Structure Management
router.get('/structure', restrictTo('SUPER_ADMIN', 'ADMIN'), getFeeStructure);
// Only Admins can update the fee structure
router.post('/structure', restrictTo('SUPER_ADMIN', 'ADMIN'), updateFeeStructure);
// Route for generating monthly fees in bulk
router.post('/generate-monthly-fees', restrictTo('SUPER_ADMIN', 'ADMIN'), generateMonthlyFees);
// Route for updating payment status
router.patch('/update-payment-status/:recordId', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'FINANCE'), updatePaymentStatus);
// Route for fetching defaulters
router.get('/defaulters', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'FINANCE'), getDefaulters);
// Route for students to view their fee payment history
router.get('/my-fee-history/:studentId', restrictTo('SUPER_ADMIN', 'ADMIN', 'TEACHER', 'FINANCE', 'STUDENT'), getMyFeeHistory);
export default router;
//# sourceMappingURL=financeRoutes.js.map