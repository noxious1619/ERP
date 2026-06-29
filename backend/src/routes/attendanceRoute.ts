import express from 'express';
import { markBulkAttendance, 
    getSectionAttendance,
    updateStudentYearlyAttendance,
    getStudentAttendancePercentage,
    getStudentMonthlyTrends,
    getStudentWeeklyTrends,
    getStudentHeatmapGrid,
    getDailyAttendance,
    saveDailyAttendance,
    getAdminAttendanceSummary

} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';


const router = express.Router();
router.use(protect);


router.post('/bulk', 
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    markBulkAttendance
);
router.get('/section', 
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getSectionAttendance
);
router.put('/student/yearly', 
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    updateStudentYearlyAttendance
);

router.get('/daily',
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getDailyAttendance
);

router.post('/daily',
    restrictTo('TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    saveDailyAttendance
);

router.get('/admin-summary',
    restrictTo('ADMIN', 'SUPER_ADMIN'),
    getAdminAttendanceSummary
);

router.get('/attendanceData/student/:studentId/totalPercetage', 
    restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getStudentAttendancePercentage
);

router.get('/attendanceData/student/:studentId/monthly-trends',
    restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getStudentMonthlyTrends
);

router.get('/attendanceData/student/:studentId/weekly-trends',
    restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getStudentWeeklyTrends
);

router.get('/attendanceData/student/:studentId/heatmap',
    restrictTo('STUDENT', 'TEACHER', 'ADMIN', 'SUPER_ADMIN'), 
    getStudentHeatmapGrid
);

export default router;