import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import { testConnection, syncDatabase } from './config/database';

const app: Express = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan('combined'));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection
async function initializeDatabase() {
  try {
    await testConnection();
    await syncDatabase();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Initialize database
initializeDatabase();

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      timestamp: new Date(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    },
    message: 'Server is running'
  });
});

// API info
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: 'Student Grade Management System API',
      version: '1.0.0',
      description: 'Backend API for student grade management system',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth',
        students: '/api/students',
        teachers: '/api/teachers',
        courses: '/api/courses',
        grades: '/api/grades',
        messages: '/api/messages',
        appeals: '/api/appeals'
      },
      documentation: 'See README.md for detailed API documentation'
    },
    message: 'Welcome to Student Grade Management System API'
  });
});

// Import routes
import authRoutes from './routes/authRoutes';
import studentRoutes from './routes/studentRoutes';
import courseRoutes from './routes/courseRoutes';
import gradeRoutes from './routes/gradeRoutes';
import teacherRoutes from './routes/teacherRoutes';
import messageRoutes from './routes/messageRoutes';
import appealRoutes from './routes/appealRoutes';

// API Routes
// Authentication routes
app.use('/api/auth', authRoutes);

// Students routes
app.use('/api/students', studentRoutes);

// Courses routes
app.use('/api/courses', courseRoutes);

// Grades routes
app.use('/api/grades', gradeRoutes);

// Teachers routes
app.use('/api/teachers', teacherRoutes);

// Messages routes
app.use('/api/messages', messageRoutes);

// Appeals routes
app.use('/api/appeals', appealRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'INTERNAL_SERVER_ERROR',
    message: 'Something went wrong!'
  });
});

export default app;