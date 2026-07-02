import express from 'express';
import { 
  addHoliday, 
  getHolidays, 
  // updateHoliday, 
  // deleteHoliday,
  initializeYearHolidays 
} from '../controllers/holidayController.js';
import { protect } from '../middleware/authMiddleware.js'; // Adjust paths as per your project
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/', getHolidays);

router.post(
  '/initialize-defaults', 
  restrictTo('ADMIN', 'SUPER_ADMIN'), 
  initializeYearHolidays
);

router.post(
  '/add-manual', 
  restrictTo('ADMIN', 'SUPER_ADMIN'), 
  addHoliday
);

// router.patch(
//   '/update/:id', 
//   restrictTo('ADMIN', 'SUPER_ADMIN'), 
//   updateHoliday
// );

// router.delete(
//   '/delete/:id', 
//   restrictTo('ADMIN', 'SUPER_ADMIN'), 
//   deleteHoliday
// );

export default router;