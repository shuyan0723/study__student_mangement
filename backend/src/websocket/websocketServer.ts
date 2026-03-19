import { Server as SocketIOServer, Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';
import { verifyAccessToken } from '../utils/jwt';
import User from '../models/User';
import CallHistory from '../models/CallHistory';
import Course from '../models/Course';
import Grade from '../models/Grade';
import { Op } from 'sequelize';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: 'student' | 'teacher' | 'admin';
}

interface CallOfferData {
  targetUserId: string;
  offer: RTCSessionDescriptionInit;
}

interface CallAnswerData {
  targetUserId: string;
  answer: RTCSessionDescriptionInit;
}

interface IceCandidateData {
  targetUserId: string;
  candidate: RTCIceCandidateInit;
}

// Store active call sessions
const activeCalls = new Map<string, string>(); // callId -> callerId
const userSockets = new Map<string, string>(); // userId -> socketId

export class WebSocketServer {
  private io: SocketIOServer;
  private onlineUsers = new Set<string>();

  constructor(httpServer: any) {
    this.io = new SocketIOServer(httpServer, {
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

  private setupMiddleware() {
    // Authentication middleware
    this.io.use(async (socket: AuthenticatedSocket, next: (err?: ExtendedError) => void) => {
      try {
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

        if (!token) {
          return next(new Error('Authentication error: No token provided'));
        }

        const decoded = verifyAccessToken(token);

        if (!decoded) {
          return next(new Error('Authentication error: Invalid token'));
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) {
          return next(new Error('Authentication error: User not found'));
        }

        socket.userId = user.id;
        socket.userRole = user.role as 'student' | 'teacher' | 'admin';

        // Track user socket
        userSockets.set(user.id, socket.id);
        this.onlineUsers.add(user.id);

        next();
      } catch (error) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers() {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId} (${socket.userRole})`);

      // Join user's personal room
      socket.join(`user_${socket.userId}`);

      // Notify others of online status
      socket.broadcast.emit('user-online', { userId: socket.userId });

      // Handle call initiation
      socket.on('call-offer', async (data: CallOfferData) => {
        await this.handleCallOffer(socket, data);
      });

      // Handle call answer
      socket.on('call-answer', async (data: CallAnswerData) => {
        await this.handleCallAnswer(socket, data);
      });

      // Handle ICE candidates
      socket.on('ice-candidate', async (data: IceCandidateData) => {
        await this.handleIceCandidate(socket, data);
      });

      // Handle call acceptance
      socket.on('call-accepted', async (data: { callId: string }) => {
        await this.handleCallAccepted(socket, data);
      });

      // Handle call rejection
      socket.on('call-rejected', async (data: { callId: string; reason?: string }) => {
        await this.handleCallRejected(socket, data);
      });

      // Handle hangup
      socket.on('call-ended', async (data: { callId: string; reason?: string }) => {
        await this.handleCallEnded(socket, data);
      });

      // Handle mute/unmute
      socket.on('mute-audio', (data: { callId: string; muted: boolean }) => {
        this.handleMuteAudio(socket, data);
      });

      socket.on('mute-video', (data: { callId: string; muted: boolean }) => {
        this.handleMuteVideo(socket, data);
      });

      // Handle teacher muting student
      socket.on('mute-student', async (data: { callId: string; studentId: string }) => {
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
      socket.on('get-online-users', (callback: (users: string[]) => void) => {
        callback(Array.from(this.onlineUsers));
      });
    });
  }

  private async verifyTeacherStudentBinding(teacherId: string, studentId: string): Promise<boolean> {
    try {
      // Check if teacher has a course that the student is enrolled in
      const teacherCourses = await Course.findAll({
        where: { teacher_id: teacherId },
        attributes: ['id']
      });

      const courseIds = teacherCourses.map((c) => c.id);

      const enrollment = await Grade.findOne({
        where: {
          student_id: studentId,
          course_id: { [Op.in]: courseIds }
        }
      });

      return !!enrollment;
    } catch (error) {
      console.error('Error verifying binding:', error);
      return false;
    }
  }

  private async handleCallOffer(socket: AuthenticatedSocket, data: CallOfferData) {
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
    } else if (isStudent) {
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
    const call = await CallHistory.create({
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

  private async handleCallAccepted(socket: AuthenticatedSocket, data: { callId: string }) {
    const { callId } = data;

    // Update call status
    await CallHistory.update(
      { call_status: 'connected' },
      { where: { id: callId } }
    );

    // Notify caller that call was accepted
    const call = await CallHistory.findByPk(callId);
    if (call) {
      this.io.to(`user_${call.caller_id}`).emit('call-accepted', { callId });
    }
  }

  private async handleCallRejected(socket: AuthenticatedSocket, data: { callId: string; reason?: string }) {
    const { callId, reason } = data;

    // Update call status
    await CallHistory.update(
      {
        call_status: 'rejected',
        end_reason: 'rejected',
        end_time: new Date()
      },
      { where: { id: callId } }
    );

    // Notify caller that call was rejected
    const call = await CallHistory.findByPk(callId);
    if (call) {
      this.io.to(`user_${call.caller_id}`).emit('call-rejected', { callId, reason });
    }

    activeCalls.delete(callId);
  }

  private async handleCallAnswer(socket: AuthenticatedSocket, data: CallAnswerData) {
    const { targetUserId, answer } = data;

    // Forward answer to target user
    this.io.to(`user_${targetUserId}`).emit('webrtc-answer', {
      answer,
      callerId: socket.userId
    });
  }

  private async handleIceCandidate(socket: AuthenticatedSocket, data: IceCandidateData) {
    const { targetUserId, candidate } = data;

    // Forward ICE candidate to target user
    this.io.to(`user_${targetUserId}`).emit('ice-candidate', {
      candidate,
      senderId: socket.userId
    });
  }

  private async handleCallEnded(socket: AuthenticatedSocket, data: { callId: string; reason?: string }) {
    const { callId, reason } = data;

    // Update call history
    const call = await CallHistory.findByPk(callId);
    if (call) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - new Date(call.start_time).getTime()) / 1000);

      await CallHistory.update(
        {
          call_status: 'ended',
          end_time: endTime,
          duration,
          end_reason: (reason || 'user_hangup') as any
        },
        { where: { id: callId } }
      );

      // Notify both parties
      const otherUserId = socket.userId === call.caller_id ? call.callee_id : call.caller_id;
      this.io.to(`user_${otherUserId}`).emit('call-ended', { callId, reason });
    }

    activeCalls.delete(callId);
  }

  private handleMuteAudio(socket: AuthenticatedSocket, data: { callId: string; muted: boolean }) {
    const { callId, muted } = data;
    socket.to(`call_${callId}`).emit('user-muted-audio', { userId: socket.userId, muted });
  }

  private handleMuteVideo(socket: AuthenticatedSocket, data: { callId: string; muted: boolean }) {
    const { callId, muted } = data;
    socket.to(`call_${callId}`).emit('user-muted-video', { userId: socket.userId, muted });
  }

  private async handleMuteStudent(socket: AuthenticatedSocket, data: { callId: string; studentId: string }) {
    // Only teachers can mute students
    if (socket.userRole !== 'teacher') {
      socket.emit('error', { message: 'Only teachers can mute students' });
      return;
    }

    const { callId, studentId } = data;
    this.io.to(`user_${studentId}`).emit('teacher-muted-you', { callId });
  }

  public getIO() {
    return this.io;
  }
}

export default WebSocketServer;
