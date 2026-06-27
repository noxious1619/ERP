import express from 'express';
import {
  getAllSubjects,
  createSubject,
  updateSubject,
  bulkDeleteSubjects,
  getClasses,
  getSectionsByClass,
  getTeachers,
  getSubjectById
} from '../controllers/subjectController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const router = express.Router();

// Dev protection fallback middleware (similar to notices)
const devProtect = async (req: any, res: any, next: any) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decoded;
        return next();
      } catch (err) {
        // Ignore token errors in dev, proceed to fallback
      }
    }

    if (process.env.NODE_ENV !== 'production') {
      const fallbackUser = await prisma.user.findFirst({
        where: {
          role: {
            in: ['SUPER_ADMIN', 'ADMIN']
          }
        }
      });

      if (fallbackUser) {
        req.user = {
          id: fallbackUser.id,
          role: fallbackUser.role,
          email: fallbackUser.email
        };
        return next();
      }
    }
  } catch (error) {
    console.error("Error in devProtect for subjects:", error);
  }

  return protect(req, res, next);
};

// Apply devProtect to all admin subject routes
router.use(devProtect);

router.route('/')
  .get(getAllSubjects)
  .post(restrictTo('SUPER_ADMIN', 'ADMIN'), createSubject);

router.get('/classes', getClasses);
router.get('/classes/:classId/sections', getSectionsByClass);
router.get('/teachers', getTeachers);

router.post('/bulk-delete', restrictTo('SUPER_ADMIN', 'ADMIN'), bulkDeleteSubjects);

router.route('/:id')
  .get(getSubjectById)
  .patch(restrictTo('SUPER_ADMIN', 'ADMIN'), updateSubject);

export default router;
