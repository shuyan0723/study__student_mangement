import { useEffect, useState } from 'react';
import { Modal, Button, Space, Typography, Badge, Tooltip } from 'antd';
import {
  PhoneOutlined,
  PhoneFilled,
  AudioMutedOutlined,
  AudioOutlined,
  VideoCameraOutlined,
  VideoCameraAddOutlined,
  StopOutlined
} from '@ant-design/icons';
import { useWebRTC } from '../hooks/useWebRTC';
import './VideoCallModal.less';

const { Text } = Typography;

interface VideoCallModalProps {
  visible: boolean;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ visible, onClose }) => {
  const {
    currentCall,
    isAudioMuted,
    isVideoMuted,
    isTeacherMuted,
    localVideoRef,
    remoteVideoRef,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    muteStudentAudio
  } = useWebRTC();

  const [callDuration, setCallDuration] = useState(0);

  // Calculate call duration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCall?.status === 'connected') {
      const startTime = new Date(currentCall.startTime).getTime();
      interval = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentCall?.status, currentCall?.startTime]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccept = async () => {
    if (currentCall) {
      try {
        await acceptCall(currentCall.callId);
      } catch (error) {
        console.error('Error accepting call:', error);
      }
    }
  };

  const handleReject = () => {
    if (currentCall) {
      rejectCall(currentCall.callId);
    }
    onClose();
  };

  const handleHangup = () => {
    endCall();
    onClose();
  };

  if (!currentCall) return null;

  const isIncoming = currentCall.isIncoming;
  const isRinging = currentCall.status === 'ringing';
  const isConnected = currentCall.status === 'connected';
  const isConnecting = currentCall.status === 'connecting';

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleHangup}
      footer={null}
      width={900}
      closable={isConnected}
      maskClosable={false}
      className="video-call-modal"
    >
      <div className="video-call-container">
        {/* Remote video (full screen) */}
        <div className="remote-video-container">
          {isConnected ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="remote-video"
            />
          ) : (
            <div className="video-placeholder">
              <div className="caller-info">
                <div className="caller-avatar">
                  {currentCall.remoteUserName.charAt(0)}
                </div>
                <Text className="caller-name">{currentCall.remoteUserName}</Text>
                <Text className="call-status">
                  {isRinging && '正在呼叫...'}
                  {isConnecting && '连接中...'}
                  {isConnected && formatDuration(callDuration)}
                </Text>
              </div>
            </div>
          )}
        </div>

        {/* Local video (picture-in-picture) */}
        {currentCall.status !== 'ringing' && (
          <div className="local-video-container">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="local-video"
            />
            {isAudioMuted && (
              <div className="mute-indicator">
                <AudioMutedOutlined />
              </div>
            )}
          </div>
        )}

        {/* Call controls */}
        <div className="call-controls">
          {isIncoming && isRinging ? (
            // Incoming call controls
            <Space size="large">
              <Button
                type="primary"
                size="large"
                icon={<PhoneFilled />}
                onClick={handleAccept}
                className="accept-button"
              >
                接听
              </Button>
              <Button
                danger
                size="large"
                icon={<PhoneOutlined />}
                onClick={handleReject}
                className="reject-button"
              >
                拒绝
              </Button>
            </Space>
          ) : isConnected || isConnecting ? (
            // In-call controls
            <Space size="middle">
              <Tooltip title={isAudioMuted ? '取消静音' : '静音'}>
                <Button
                  shape="circle"
                  size="large"
                  icon={isAudioMuted ? <AudioMutedOutlined /> : <AudioOutlined />}
                  onClick={toggleAudio}
                  disabled={isTeacherMuted}
                  type={isAudioMuted || isTeacherMuted ? 'primary' : 'default'}
                  danger={isAudioMuted || isTeacherMuted}
                />
              </Tooltip>

              <Tooltip title={isVideoMuted ? '开启摄像头' : '关闭摄像头'}>
                <Button
                  shape="circle"
                  size="large"
                  icon={isVideoMuted ? <StopOutlined /> : <VideoCameraOutlined />}
                  onClick={toggleVideo}
                  type={isVideoMuted ? 'primary' : 'default'}
                  danger={isVideoMuted}
                />
              </Tooltip>

              {currentCall.remoteUserRole === 'student' && (
                <Tooltip title="静音学生">
                  <Button
                    shape="circle"
                    size="large"
                    icon={<AudioMutedOutlined />}
                    onClick={() => muteStudentAudio(currentCall.remoteUserId)}
                  />
                </Tooltip>
              )}

              <Tooltip title="挂断">
                <Button
                  danger
                  shape="circle"
                  size="large"
                  icon={<PhoneOutlined />}
                  onClick={handleHangup}
                  className="hangup-button"
                />
              </Tooltip>
            </Space>
          ) : (
            // Outgoing call controls
            <Space size="large">
              <Badge status="processing" text={<Text strong>正在呼叫 {currentCall.remoteUserName}...</Text>} />
              <Button
                danger
                size="large"
                icon={<PhoneOutlined />}
                onClick={handleHangup}
              >
                取消
              </Button>
            </Space>
          )}
        </div>

        {/* Teacher mute indicator for students */}
        {isTeacherMuted && (
          <div className="teacher-mute-notice">
            <AudioMutedOutlined /> 老师已将您静音
          </div>
        )}
      </div>
    </Modal>
  );
};

export default VideoCallModal;
