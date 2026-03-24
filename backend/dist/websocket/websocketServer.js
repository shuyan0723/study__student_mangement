"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketServer = void 0;
const socket_io_1 = require("socket.io");
const jwt_1 = require("../utils/jwt");
const User_1 = __importDefault(require("../models/User"));
const CallHistory_1 = __importDefault(require("../models/CallHistory"));
const Course_1 = __importDefault(require("../models/Course"));
const Grade_1 = __importDefault(require("../models/Grade"));
const sequelize_1 = require("sequelize");
// Store active call sessions
const activeCalls = new Map(); // callId -> callerId
const userSockets = new Map(); // userId -> socketId
class WebSocketServer {
    constructor(httpServer) {
        this.onlineUsers = new Set();
        this.io = new socket_io_1.Server(httpServer, {
            cors: {
                origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
                credentials: true,
                methods: ['GET', 'POST']
            },
            transports: ['websocket', 'polling']
        });
        this.setupMiddleware();
        this.setupEventHandlers();
    }
    setupMiddleware() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Authentication error: No token provided'));
                }
                const decoded = (0, jwt_1.verifyAccessToken)(token);
                if (!decoded) {
                    return next(new Error('Authentication error: Invalid token'));
                }
                const user = await User_1.default.findByPk(decoded.userId);
                if (!user) {
                    return next(new Error('Authentication error: User not found'));
                }
                socket.userId = user.id;
                socket.userRole = user.role;
                // Track user socket
                userSockets.set(user.id, socket.id);
                this.onlineUsers.add(user.id);
                next();
            }
            catch (error) {
                next(new Error('Authentication error: Invalid token'));
            }
        });
    }
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`User connected: ${socket.userId} (${socket.userRole})`);
            // Join user's personal room
            socket.join(`user_${socket.userId}`);
            // Notify others of online status
            socket.broadcast.emit('user-online', { userId: socket.userId });
            // Handle call initiation
            socket.on('call-offer', async (data) => {
                await this.handleCallOffer(socket, data);
            });
            // Handle call answer
            socket.on('call-answer', async (data) => {
                await this.handleCallAnswer(socket, data);
            });
            // Handle ICE candidates
            socket.on('ice-candidate', async (data) => {
                await this.handleIceCandidate(socket, data);
            });
            // Handle call acceptance
            socket.on('call-accepted', async (data) => {
                await this.handleCallAccepted(socket, data);
            });
            // Handle call rejection
            socket.on('call-rejected', async (data) => {
                await this.handleCallRejected(socket, data);
            });
            // Handle hangup
            socket.on('call-ended', async (data) => {
                await this.handleCallEnded(socket, data);
            });
            // Handle mute/unmute
            socket.on('mute-audio', (data) => {
                this.handleMuteAudio(socket, data);
            });
            socket.on('mute-video', (data) => {
                this.handleMuteVideo(socket, data);
            });
            // Handle teacher muting student
            socket.on('mute-student', async (data) => {
                await this.handleMuteStudent(socket, data);
            });
            // Handle disconnect
            socket.on('disconnect', () => {
                console.log(`User disconnected: ${socket.userId}`);
                this.onlineUsers.delete(socket.userId || '');
                userSockets.delete(socket.userId || '');
                socket.broadcast.emit('user-offline', { userId: socket.userId });
            });
            // Handle getting online status
            socket.on('get-online-users', (callback) => {
                callback(Array.from(this.onlineUsers));
            });
        });
    }
    async verifyTeacherStudentBinding(teacherId, studentId) {
        try {
            // Check if teacher has a course that the student is enrolled in
            const teacherCourses = await Course_1.default.findAll({
                where: { teacher_id: teacherId },
                attributes: ['id']
            });
            const courseIds = teacherCourses.map((c) => c.id);
            const enrollment = await Grade_1.default.findOne({
                where: {
                    student_id: studentId,
                    course_id: { [sequelize_1.Op.in]: courseIds }
                }
            });
            return !!enrollment;
        }
        catch (error) {
            console.error('Error verifying binding:', error);
            return false;
        }
    }
    async handleCallOffer(socket, data) {
        const { targetUserId, offer } = data;
        const callerId = socket.userId;
        if (!callerId || !targetUserId) {
            socket.emit('call-error', { message: 'Invalid call request' });
            return;
        }
        // Verify teacher-student binding
        const isTeacher = socket.userRole === 'teacher';
        const isStudent = socket.userRole === 'student';
        let isValidBinding = false;
        if (isTeacher) {
            isValidBinding = await this.verifyTeacherStudentBinding(callerId, targetUserId);
        }
        else if (isStudent) {
            isValidBinding = await this.verifyTeacherStudentBinding(targetUserId, callerId);
        }
        if (!isValidBinding) {
            socket.emit('call-error', { message: 'You can only call bound teachers/students' });
            return;
        }
        // Check if target user is online
        const targetSocketId = userSockets.get(targetUserId);
        if (!targetSocketId) {
            socket.emit('call-error', { message: 'User is not online' });
            return;
        }
        // Create call history record
        const call = await CallHistory_1.default.create({
            caller_id: callerId,
            callee_id: targetUserId,
            call_status: 'initiated',
            start_time: new Date()
        });
        activeCalls.set(call.id, callerId);
        // Send call offer to target user
        this.io.to(`user_${targetUserId}`).emit('incoming-call', {
            callId: call.id,
            callerId,
            callerRole: socket.userRole,
            offer
        });
    }
    async handleCallAccepted(socket, data) {
        const { callId } = data;
        // Update call status
        await CallHistory_1.default.update({ call_status: 'connected' }, { where: { id: callId } });
        // Notify caller that call was accepted
        const call = await CallHistory_1.default.findByPk(callId);
        if (call) {
            this.io.to(`user_${call.caller_id}`).emit('call-accepted', { callId });
        }
    }
    async handleCallRejected(socket, data) {
        const { callId, reason } = data;
        // Update call status
        await CallHistory_1.default.update({
            call_status: 'rejected',
            end_reason: 'rejected',
            end_time: new Date()
        }, { where: { id: callId } });
        // Notify caller that call was rejected
        const call = await CallHistory_1.default.findByPk(callId);
        if (call) {
            this.io.to(`user_${call.caller_id}`).emit('call-rejected', { callId, reason });
        }
        activeCalls.delete(callId);
    }
    async handleCallAnswer(socket, data) {
        const { targetUserId, answer } = data;
        // Forward answer to target user
        this.io.to(`user_${targetUserId}`).emit('webrtc-answer', {
            answer,
            callerId: socket.userId
        });
    }
    async handleIceCandidate(socket, data) {
        const { targetUserId, candidate } = data;
        // Forward ICE candidate to target user
        this.io.to(`user_${targetUserId}`).emit('ice-candidate', {
            candidate,
            senderId: socket.userId
        });
    }
    async handleCallEnded(socket, data) {
        const { callId, reason } = data;
        // Update call history
        const call = await CallHistory_1.default.findByPk(callId);
        if (call) {
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - new Date(call.start_time).getTime()) / 1000);
            await CallHistory_1.default.update({
                call_status: 'ended',
                end_time: endTime,
                duration,
                end_reason: (reason || 'user_hangup')
            }, { where: { id: callId } });
            // Notify both parties
            const otherUserId = socket.userId === call.caller_id ? call.callee_id : call.caller_id;
            this.io.to(`user_${otherUserId}`).emit('call-ended', { callId, reason });
        }
        activeCalls.delete(callId);
    }
    handleMuteAudio(socket, data) {
        const { callId, muted } = data;
        socket.to(`call_${callId}`).emit('user-muted-audio', { userId: socket.userId, muted });
    }
    handleMuteVideo(socket, data) {
        const { callId, muted } = data;
        socket.to(`call_${callId}`).emit('user-muted-video', { userId: socket.userId, muted });
    }
    async handleMuteStudent(socket, data) {
        // Only teachers can mute students
        if (socket.userRole !== 'teacher') {
            socket.emit('error', { message: 'Only teachers can mute students' });
            return;
        }
        const { callId, studentId } = data;
        this.io.to(`user_${studentId}`).emit('teacher-muted-you', { callId });
    }
    getIO() {
        return this.io;
    }
}
exports.WebSocketServer = WebSocketServer;
exports.default = WebSocketServer;
