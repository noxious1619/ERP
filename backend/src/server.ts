import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import academicRoutes from './routes/academicRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Essential for reading the JSON we send from Postman

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/academic', academicRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('ERP Backend is running... 🚀');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});