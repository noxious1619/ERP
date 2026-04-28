import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import noticeRoutes from './routes/noticeRoutes.js'
import attendanceRoutes from './routes/attendanceRoute.js'
import assignmentRoutes from './routes/assignmentRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/notices", noticeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/calendar', calendarRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('ERP Backend is running... 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});