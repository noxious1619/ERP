import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js'
import attendanceRoutes from './routes/attendanceRoute.js'
import assignmentRoutes from './routes/assignmentRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import parentRoutes from './routes/parentRoutes.js';
import examRoutes from './routes/examRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminNoticeRoutes from './routes/adminNoticeRoutes.js';
import adminSubjectRoutes from './routes/adminSubjectRoutes.js';
import examTermRoutes from './routes/examTermRoutes.js';
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/timetable', timetableRoutes);
app.use("/api/students", studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/parents', parentRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin', adminNoticeRoutes);
app.use('/api/admin/subjects', adminSubjectRoutes);
app.use('/api/exam-terms', examTermRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Health Check
app.get("/", (_, res) => {
  res.status(200).json({
    success: true,
    message: "ERP Backend is running",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 ERP Backend started on port ${PORT}`);
}); // live reload trigger