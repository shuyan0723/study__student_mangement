import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import type { WebRTCCall, CallStatus, MediaConstraints } from '../types/webrtc';

interface WebRTCState {
  // Socket connection
  socket: Socket | null;
  isConnected: boolean;

  // Current call
  currentCall: WebRTCCall | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  pendingOffer: RTCSessionDescriptionInit | null;

  // Media state
  isAudioMuted: boolean;
  isVideoMuted: boolean;
  isTeacherMuted: boolean; // For students

  // Peer connection
  peerConnection: RTCPeerConnection | null;

  // Actions
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;
  initiateCall: (targetUserId: string, targetUserName: string, targetUserRole: 'student' | 'teacher') => Promise<void>;
  answerCall: (callId: string) => Promise<void>;
  rejectCall: (callId: string, reason?: string) => void;
  hangup: (reason?: string) => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  muteStudentAudio: (studentId: string) => void;

  // Internal actions
  setCurrentCall: (call: WebRTCCall | null) => void;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  clearCurrentCall: () => void;
}

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ]
};

export const useWebRTCStore = create<WebRTCState>((set, get) => ({
  socket: null,
  isConnected: false,
  currentCall: null,
  localStream: null,
  remoteStream: null,
  pendingOffer: null,
  isAudioMuted: false,
  isVideoMuted: false,
  isTeacherMuted: false,
  peerConnection: null,

  initializeSocket: (token: string) => {
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Socket connected');
      set({ isConnected: true });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      set({ isConnected: false });
    });

    // Incoming call
    socket.on('incoming-call', async (data) => {
      const { callId, callerId, callerRole, offer } = data;

      set({
        currentCall: {
          callId,
          remoteUserId: callerId,
          remoteUserName: callerId,
          remoteUserRole: callerRole,
          status: 'ringing',
          startTime: new Date(),
          isIncoming: true
        },
        pendingOffer: offer
      });
    });

    // Call accepted
    socket.on('call-accepted', () => {
      const { currentCall } = get();
      if (currentCall) {
        set({
          currentCall: { ...currentCall, status: 'connecting' as CallStatus }
        });
      }
    });

    // Call rejected
    socket.on('call-rejected', (data: { callId: string; reason?: string }) => {
      const { callId } = data;
      const { currentCall } = get();

      if (currentCall && currentCall.callId === callId) {
        set({
          currentCall: { ...currentCall, status: 'ended' as CallStatus, endTime: new Date() }
        });

        // Clean up after showing rejection message
        setTimeout(() => get().clearCurrentCall(), 3000);
      }
    });

    // WebRTC offer (for callee)
    socket.on('webrtc-offer', async (data) => {
      const { offer } = data;
      const { peerConnection, currentCall } = get();

      if (!peerConnection || !currentCall) return;

      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        const socket = get().socket;
        if (socket) {
          socket.emit('call-answer', {
            targetUserId: currentCall.remoteUserId,
            answer
          });
        }
      } catch (error) {
        console.error('Error handling offer:', error);
      }
    });

    // WebRTC answer (for caller)
    socket.on('webrtc-answer', async (data) => {
      const { answer } = data;
      const { peerConnection } = get();

      if (peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
          set((state) => ({
            currentCall: state.currentCall ? { ...state.currentCall, status: 'connected' as CallStatus } : null
          }));
        } catch (error) {
          console.error('Error handling answer:', error);
        }
      }
    });

    // ICE candidate
    socket.on('ice-candidate', async (data) => {
      const { candidate } = data;
      const { peerConnection } = get();

      if (peerConnection) {
        try {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    // Call ended
    socket.on('call-ended', (data) => {
      const { callId } = data;
      const { currentCall } = get();

      if (currentCall && currentCall.callId === callId) {
        set({
          currentCall: { ...currentCall, status: 'ended' as CallStatus, endTime: new Date() }
        });
        get().clearCurrentCall();
      }
    });

    // User muted audio
    socket.on('user-muted-audio', (data) => {
      // Update UI to show remote user muted status
      console.log('Remote user muted audio:', data.muted);
    });

    // User muted video
    socket.on('user-muted-video', (data) => {
      // Update UI to show remote user video off
      console.log('Remote user muted video:', data.muted);
    });

    // Teacher muted student
    socket.on('teacher-muted-you', () => {
      set({ isTeacherMuted: true });
    });

    // Call error
    socket.on('call-error', (data) => {
      console.error('Call error:', data.message);
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },

  initiateCall: async (targetUserId: string, targetUserName: string, targetUserRole: 'student' | 'teacher') => {
    const { socket } = get();
    if (!socket) throw new Error('Socket not connected');

    try {
      // Get local media stream
      const constraints: MediaConstraints = {
        audio: true,
        video: { width: 1280, height: 720 }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream });

      // Create peer connection
      const peerConnection = new RTCPeerConnection(ICE_SERVERS);

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('ice-candidate', {
            targetUserId,
            candidate: event.candidate
          });
        }
      };

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        if (peerConnection.connectionState === 'failed') {
          get().hangup('network_error');
        }
      };

      set({ peerConnection });

      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Emit call offer
      socket.emit('call-offer', {
        targetUserId,
        offer
      });

      set({
        currentCall: {
          callId: '', // Will be set by server response
          remoteUserId: targetUserId,
          remoteUserName: targetUserName,
          remoteUserRole: targetUserRole,
          status: 'initiating',
          startTime: new Date(),
          isIncoming: false
        }
      });
    } catch (error: any) {
      console.error('Error initiating call:', error);
      throw error;
    }
  },

  answerCall: async (callId: string) => {
    const { socket, currentCall, pendingOffer } = get();
    if (!socket || !currentCall) throw new Error('Cannot answer call');

    try {
      // Get local media stream
      const constraints: MediaConstraints = {
        audio: true,
        video: { width: 1280, height: 720 }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      set({ localStream: stream });

      // Create peer connection
      const peerConnection = new RTCPeerConnection(ICE_SERVERS);

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        set({ remoteStream: event.streams[0] });
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate && socket && currentCall) {
          socket.emit('ice-candidate', {
            targetUserId: currentCall.remoteUserId,
            candidate: event.candidate
          });
        }
      };

      set({ peerConnection, currentCall: { ...currentCall, status: 'connecting' as CallStatus } });

      // Accept call
      socket.emit('call-accepted', { callId });

      // If we have a pending offer, handle it
      if (pendingOffer && peerConnection) {
        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(pendingOffer));

          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          socket.emit('call-answer', {
            targetUserId: currentCall.remoteUserId,
            answer
          });

          set({ pendingOffer: null });
        } catch (error) {
          console.error('Error handling offer:', error);
        }
      }
    } catch (error: any) {
      console.error('Error answering call:', error);
      throw error;
    }
  },

  rejectCall: (callId: string, reason?: string) => {
    const { socket } = get();
    if (socket) {
      socket.emit('call-rejected', { callId, reason });
      get().clearCurrentCall();
    }
  },

  hangup: (reason?: string) => {
    const { socket, currentCall, localStream, peerConnection } = get();

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Close peer connection
    if (peerConnection) {
      peerConnection.close();
    }

    // Notify server
    if (socket && currentCall) {
      socket.emit('call-ended', { callId: currentCall.callId, reason });
    }

    get().clearCurrentCall();
  },

  toggleAudio: () => {
    const { localStream, socket, currentCall, isTeacherMuted } = get();
    if (localStream && !isTeacherMuted) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        const newMutedState = !audioTrack.enabled;
        set({ isAudioMuted: newMutedState });

        // Notify remote user
        if (socket && currentCall) {
          socket.emit('mute-audio', { callId: currentCall.callId, muted: newMutedState });
        }
      }
    }
  },

  toggleVideo: () => {
    const { localStream, socket, currentCall } = get();
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        const newMutedState = !videoTrack.enabled;
        set({ isVideoMuted: newMutedState });

        // Notify remote user
        if (socket && currentCall) {
          socket.emit('mute-video', { callId: currentCall.callId, muted: newMutedState });
        }
      }
    }
  },

  muteStudentAudio: (studentId: string) => {
    const { socket, currentCall } = get();
    if (socket && currentCall) {
      socket.emit('mute-student', { callId: currentCall.callId, studentId });
    }
  },

  setCurrentCall: (call: WebRTCCall | null) => set({ currentCall: call }),
  setLocalStream: (stream: MediaStream | null) => set({ localStream: stream }),
  setRemoteStream: (stream: MediaStream | null) => set({ remoteStream: stream }),
  clearCurrentCall: () => set({
    currentCall: null,
    localStream: null,
    remoteStream: null,
    peerConnection: null,
    isAudioMuted: false,
    isVideoMuted: false,
    isTeacherMuted: false,
    pendingOffer: null
  })
}));
