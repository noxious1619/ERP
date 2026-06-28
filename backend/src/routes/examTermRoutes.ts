import express from 'express';
import {
  createExamTerm,
  getExamTerms,
  updateExamTerm,
} from '../controllers/examTermController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';

const router = express.Router();
router.use(protect);
router.use(restrictTo('ADMIN', 'SUPER_ADMIN'));

router.get('/',   restrictTo('ADMIN', 'SUPER_ADMIN'),    getExamTerms);
router.post('/',   restrictTo('ADMIN', 'SUPER_ADMIN'),   createExamTerm);
router.patch('/:id', restrictTo('ADMIN', 'SUPER_ADMIN'), updateExamTerm);

export default router;