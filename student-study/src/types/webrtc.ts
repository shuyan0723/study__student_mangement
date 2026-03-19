export type CallStatus = 'idle' | 'initiating' | 'ringing' | 'connecting' | 'connected' | 'ending' | 'ended';

export interface WebRTCCall {
  callId: string;
  remoteUserId: string;
  remoteUserName: string;
  remoteUserRole: 'student' | 'teacher';
  status: CallStatus;
  startTime: Date;
  endTime?: Date;
  isIncoming: boolean;
}

export interface CallStatistics {
  totalCalls: number;
  connectedCalls: number;
  successRate: number;
  totalDuration: number;
  avgDuration: number;
}

export interface MediaConstraints {
  audio: boolean;
  video: boolean | { width: number; height: number };
}
