import express from 'express';
import { 
  addHoliday, 
  getHolidays, 
  updateHoliday, 
  deleteHoliday,
  initializeYearHolidays 
} from '../controllers/holidayController.js';
import { protect } from '../middleware/authMiddleware.js'; // Adjust paths as per your project
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();

/**
 * All calendar routes require a logged-in user.
 * Role-based filtering happens inside getHolidays.
 */
router.use(protect);

// 1. View Calendar (Accessible by Students, Teachers, Admin)
// Query params expected: ?academicYearId=...
router.get('/', getHolidays);

// 2. Administrative Controls (Restrict to Admin/Super Admin)
router.post(
  '/initialize-defaults', 
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), 
  initializeYearHolidays
);

router.post(
  '/add-manual', 
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), 
  addHoliday
);

router.patch(
  '/update/:id', 
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), 
  updateHoliday
);

router.delete(
  '/delete/:id', 
  restrictTo('ADMIN', 'SUPER_ADMIN', 'TEACHER'), 
  deleteHoliday
);

export default router;