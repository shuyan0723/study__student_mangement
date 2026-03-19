import { useEffect, useRef, useCallback } from 'react';
import { useWebRTCStore } from '../store/webrtcStore';
import { useAuthStore } from '../store/authStore';

export const useWebRTC = () => {
  const { token } = useAuthStore();
  const {
    socket,
    isConnected,
    currentCall,
    localStream,
    remoteStream,
    isAudioMuted,
    isVideoMuted,
    isTeacherMuted,
    initializeSocket,
    disconnectSocket,
    initiateCall,
    answerCall,
    rejectCall,
    hangup,
    toggleAudio,
    toggleVideo,
    muteStudentAudio
  } = useWebRTCStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize socket on mount
  useEffect(() => {
    if (token) {
      initializeSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [token, initializeSocket, disconnectSocket]);

  // Attach streams to video elements
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  const startCall = useCallback(async (targetUserId: string, targetUserName: string, targetUserRole: 'student' | 'teacher') => {
    try {
      await initiateCall(targetUserId, targetUserName, targetUserRole);
    } catch (error: any) {
      console.error('Failed to start call:', error);
      throw error;
    }
  }, [initiateCall]);

  const acceptCall = useCallback(async (callId: string) => {
    try {
      await answerCall(callId);
    } catch (error: any) {
      console.error('Failed to accept call:', error);
      throw error;
    }
  }, [answerCall]);

  const declineCall = useCallback((callId: string, reason?: string) => {
    rejectCall(callId, reason);
  }, [rejectCall]);

  const endCall = useCallback((reason?: string) => {
    hangup(reason);
  }, [hangup]);

  return {
    // Connection state
    isConnected,
    currentCall,

    // Media state
    isAudioMuted,
    isVideoMuted,
    isTeacherMuted,

    // Video refs
    localVideoRef,
    remoteVideoRef,

    // Actions
    startCall,
    acceptCall,
    declineCall,
    endCall,
    toggleAudio,
    toggleVideo,
    muteStudentAudio
  };
};
