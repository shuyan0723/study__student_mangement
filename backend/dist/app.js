"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
require("dotenv/config");
const database_1 = require("./config/database");
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Logging
app.use((0, morgan_1.default)('combined'));
// Body parser
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
// Database connection
async function initializeDatabase() {
    try {
        await (0, database_1.testConnection)();
        await (0, database_1.syncDatabase)();
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        process.exit(1);
    }
}
// Initialize database
initializeDatabase();
// Health check
app.get('/api/health', (_req, res) => {
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
app.get('/api', (_req, res) => {
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
                appeals: '/api/appeals',
                aiAnalysis: '/api/ai-analysis'
            },
            documentation: 'See README.md for detailed API documentation'
        },
        message: 'Welcome to Student Grade Management System API'
    });
});
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/courseRoutes"));
const gradeRoutes_1 = __importDefault(require("./routes/gradeRoutes"));
const teacherRoutes_1 = __importDefault(require("./routes/teacherRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const appealRoutes_1 = __importDefault(require("./routes/appealRoutes"));
const aiAnalysisRoutes_1 = __importDefault(require("./routes/aiAnalysisRoutes"));
// API Routes
// Authentication routes
app.use('/api/auth', authRoutes_1.default);
// Students routes
app.use('/api/students', studentRoutes_1.default);
// Courses routes
app.use('/api/courses', courseRoutes_1.default);
// Grades routes
app.use('/api/grades', gradeRoutes_1.default);
// Teachers routes
app.use('/api/teachers', teacherRoutes_1.default);
// Messages routes
app.use('/api/messages', messageRoutes_1.default);
// Appeals routes
app.use('/api/appeals', appealRoutes_1.default);
// AI Analysis routes
app.use('/api/ai-analysis', aiAnalysisRoutes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'NOT_FOUND',
        message: `Route ${req.method} ${req.path} not found`
    });
});
// Error handling middleware
app.use((err, _req, res, _next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong!'
    });
});
exports.default = app;
