import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Card, Statistic, Row, Col, Tag, List, Avatar, Tooltip, Badge, Button, Modal, Descriptions, Progress, Space, Alert, Divider } from 'antd';
import {
  TeamOutlined,
  RiseOutlined,
  MessageOutlined,
  EyeOutlined,
  UserOutlined,
  CameraOutlined,
  FullscreenOutlined,
  FileTextOutlined,
  CommentOutlined,
  WarningOutlined
} from '@ant-design/icons';

// 学生活动状态类型
export type StudentActivityType = 'listening' | 'questioning' | 'note_taking' | 'distracted' | 'discussing' | 'confused' | 'understanding';

// 学生活动数据接口
export interface StudentActivity {
  studentId: string;
  name: string;
  studentIdNumber: string;
  currentActivity: StudentActivityType;
  activityStartTime: string;
  activityDuration: number;
  participationScore: number;
  questionCount: number;
  noteTakingCount: number;
  distractedCount: number;
  position: { x: number; y: number; z: number };
  status: 'active' | 'idle' | 'away';
  lastActive: string;
}

const Classroom3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentActivity | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'free' | 'front' | 'side' | 'top' | 'teacher'>('free');

  // 模拟学生数据
  const [studentActivities, setStudentActivities] = useState<StudentActivity[]>([
    {
      studentId: '1',
      name: '张三',
      studentIdNumber: '2024001',
      currentActivity: 'listening',
      activityStartTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      activityDuration: 15,
      participationScore: 85,
      questionCount: 3,
      noteTakingCount: 12,
      distractedCount: 2,
      position: { x: -9, y: 1.5, z: -6 },
      status: 'active',
      lastActive: '刚刚'
    },
    {
      studentId: '2',
      name: '李四',
      studentIdNumber: '2024002',
      currentActivity: 'questioning',
      activityStartTime: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      activityDuration: 2,
      participationScore: 92,
      questionCount: 8,
      noteTakingCount: 15,
      distractedCount: 1,
      position: { x: -3, y: 1.5, z: -6 },
      status: 'active',
      lastActive: '刚刚'
    },
    {
      studentId: '3',
      name: '王五',
      studentIdNumber: '2024003',
      currentActivity: 'note_taking',
      activityStartTime: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      activityDuration: 8,
      participationScore: 68,
      questionCount: 2,
      noteTakingCount: 20,
      distractedCount: 5,
      position: { x: 3, y: 1.5, z: -6 },
      status: 'idle',
      lastActive: '5分钟前'
    },
    {
      studentId: '4',
      name: '赵六',
      studentIdNumber: '2024004',
      currentActivity: 'discussing',
      activityStartTime: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      activityDuration: 3,
      participationScore: 78,
      questionCount: 4,
      noteTakingCount: 10,
      distractedCount: 3,
      position: { x: 9, y: 1.5, z: -6 },
      status: 'active',
      lastActive: '刚刚'
    },
    {
      studentId: '5',
      name: '钱七',
      studentIdNumber: '2024005',
      currentActivity: 'understanding',
      activityStartTime: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      activityDuration: 5,
      participationScore: 95,
      questionCount: 6,
      noteTakingCount: 18,
      distractedCount: 0,
      position: { x: -9, y: 1.5, z: 6 },
      status: 'active',
      lastActive: '刚刚'
    },
    {
      studentId: '6',
      name: '孙八',
      studentIdNumber: '2024006',
      currentActivity: 'distracted',
      activityStartTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      activityDuration: 10,
      participationScore: 45,
      questionCount: 0,
      noteTakingCount: 2,
      distractedCount: 8,
      position: { x: -3, y: 1.5, z: 6 },
      status: 'away',
      lastActive: '15分钟前'
    },
    {
      studentId: '7',
      name: '周九',
      studentIdNumber: '2024007',
      currentActivity: 'confused',
      activityStartTime: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
      activityDuration: 4,
      participationScore: 88,
      questionCount: 5,
      noteTakingCount: 14,
      distractedCount: 2,
      position: { x: 3, y: 1.5, z: 6 },
      status: 'active',
      lastActive: '刚刚'
    },
    {
      studentId: '8',
      name: '吴十',
      studentIdNumber: '2024008',
      currentActivity: 'listening',
      activityStartTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      activityDuration: 20,
      participationScore: 72,
      questionCount: 2,
      noteTakingCount: 11,
      distractedCount: 3,
      position: { x: 9, y: 1.5, z: 6 },
      status: 'idle',
      lastActive: '3分钟前'
    }
  ]);

  const [interactionStats] = useState({
    totalInteractions: 156,
    activeStudents: 28,
    avgParticipation: 72,
    questionsAsked: 43
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 获取活动状态配置
  const getActivityConfig = (activity: StudentActivityType) => {
    const configs = {
      listening: { color: 0x52c41a, icon: '👂', label: '正在听课', description: '专注听讲中' },
      questioning: { color: 0x1890ff, icon: '🙋', label: '正在提问', description: '举手提问' },
      note_taking: { color: 0xfaad14, icon: '✍️', label: '正在做笔记', description: '记录重点' },
      distracted: { color: 0xff4d4f, icon: '😴', label: '走神/分心', description: '需要提醒' },
      discussing: { color: 0x722ed1, icon: '💬', label: '小组讨论', description: '与同学交流' },
      confused: { color: 0xfa8c16, icon: '❓', label: '有疑惑', description: '需要帮助' },
      understanding: { color: 0x13c2c2, icon: '✅', label: '理解点头', description: '明白了' }
    };
    return configs[activity];
  };

  // 视角切换
  const changeView = useCallback((mode: 'free' | 'front' | 'side' | 'top' | 'teacher') => {
    if (!cameraRef.current || !controlsRef.current) return;

    setViewMode(mode);

    switch (mode) {
      case 'front':
        cameraRef.current.position.set(0, 10, 30);
        break;
      case 'side':
        cameraRef.current.position.set(30, 10, 0);
        break;
      case 'top':
        cameraRef.current.position.set(0, 35, 0);
        break;
      case 'teacher':
        cameraRef.current.position.set(0, 5, -15);
        break;
      case 'free':
        cameraRef.current.position.set(0, 20, 25);
        break;
    }

    cameraRef.current.lookAt(0, 0, 0);
    controlsRef.current.update();
  }, []);

  // 处理学生点击
  const handleStudentClick = useCallback((student: StudentActivity) => {
    setSelectedStudent(student);
    setDetailModalVisible(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f5ff);
    sceneRef.current = scene;

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI / 2;
    controlsRef.current = controls;

    // 初始化射线检测器
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 0.5 };
    raycasterRef.current = raycaster;

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -30;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = -30;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x1890ff, 0.5, 50);
    pointLight1.position.set(-15, 15, -15);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x52c41a, 0.5, 50);
    pointLight2.position.set(15, 15, 15);
    scene.add(pointLight2);

    // 创建教室地板
    const floorGeometry = new THREE.PlaneGeometry(50, 40);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0xe8e8e8,
      side: THREE.DoubleSide
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(50, 25, 0xcccccc, 0xe8e8e8);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    // 创建教室墙壁
    const wallMaterial = new THREE.MeshPhongMaterial({
      color: 0xf5f5f5,
      side: THREE.DoubleSide
    });

    // 后墙（带黑板）
    const backWallGeometry = new THREE.PlaneGeometry(50, 12);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, 6, -20);
    scene.add(backWall);

    // 黑板
    const blackboardGeometry = new THREE.PlaneGeometry(20, 4);
    const blackboardMaterial = new THREE.MeshPhongMaterial({ color: 0x2d4a3d });
    const blackboard = new THREE.Mesh(blackboardGeometry, blackboardMaterial);
    blackboard.position.set(0, 5, -19.9);
    scene.add(blackboard);

    // 侧墙
    const sideWallGeometry = new THREE.PlaneGeometry(40, 12);
    const leftWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    leftWall.position.set(-25, 6, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(sideWallGeometry, wallMaterial);
    rightWall.position.set(25, 6, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // 前墙（带门和窗）
    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(50, 12), wallMaterial);
    frontWall.position.set(0, 6, 20);
    scene.add(frontWall);

    // 门
    const doorGeometry = new THREE.PlaneGeometry(6, 8);
    const doorMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(10, 4, 19.9);
    scene.add(door);

    // 窗户
    const windowGeometry = new THREE.PlaneGeometry(8, 4);
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.6
    });

    for (let i = -2; i <= 2; i++) {
      if (i === 1) continue; // 跳过门的位置
      const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
      windowMesh.position.set(i * 8, 6, 19.9);
      scene.add(windowMesh);
    }

    // 教师讲台
    const podiumGeometry = new THREE.BoxGeometry(8, 1, 3);
    const podiumMaterial = new THREE.MeshPhongMaterial({ color: 0x722ed1 });
    const podium = new THREE.Mesh(podiumGeometry, podiumMaterial);
    podium.position.set(0, 0.5, -18);
    podium.castShadow = true;
    podium.receiveShadow = true;
    scene.add(podium);

    // 教师模型
    const teacherGeometry = new THREE.CylinderGeometry(0.8, 1, 2.5, 32);
    const teacherMaterial = new THREE.MeshPhongMaterial({
      color: 0xeb2f96,
      emissive: 0xeb2f96,
      emissiveIntensity: 0.2
    });
    const teacher = new THREE.Mesh(teacherGeometry, teacherMaterial);
    teacher.position.set(0, 2.25, -18);
    teacher.castShadow = true;
    scene.add(teacher);

    // 创建学生课桌椅和模型
    const studentMeshes: THREE.Mesh[] = [];
    const studentActivityMeshes: { mesh: THREE.Mesh; student: StudentActivity }[] = [];

    studentActivities.forEach((student) => {
      const { x, y, z } = student.position;

      // 课桌
      const deskGeometry = new THREE.BoxGeometry(3, 0.8, 2);
      const deskMaterial = new THREE.MeshPhongMaterial({ color: 0x8d6e63 });
      const desk = new THREE.Mesh(deskGeometry, deskMaterial);
      desk.position.set(x, 0.4, z);
      desk.castShadow = true;
      desk.receiveShadow = true;
      scene.add(desk);

      // 椅子
      const chairGeometry = new THREE.BoxGeometry(2.5, 0.2, 2);
      const chairMaterial = new THREE.MeshPhongMaterial({ color: 0x5d4037 });
      const chair = new THREE.Mesh(chairGeometry, chairMaterial);
      chair.position.set(x, 0.8, z + 2);
      chair.castShadow = true;
      scene.add(chair);

      // 椅子背
      const chairBackGeometry = new THREE.BoxGeometry(2.5, 2, 0.2);
      const chairBack = new THREE.Mesh(chairBackGeometry, chairMaterial);
      chairBack.position.set(x, 1.8, z + 3);
      chairBack.castShadow = true;
      scene.add(chairBack);

      // 学生模型（根据活动状态显示不同颜色和动画）
      const activityConfig = getActivityConfig(student.currentActivity);
      const studentGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const studentMaterial = new THREE.MeshPhongMaterial({
        color: activityConfig.color,
        emissive: activityConfig.color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
      });
      const studentMesh = new THREE.Mesh(studentGeometry, studentMaterial);
      studentMesh.position.set(x, y, z);
      studentMesh.castShadow = true;
      studentMesh.userData = { student }; // 存储学生数据用于点击检测
      scene.add(studentMesh);
      studentMeshes.push(studentMesh);
      studentActivityMeshes.push({ mesh: studentMesh, student });

      // 活动图标（使用文字精灵）
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, 128, 128);
        ctx.font = '80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(activityConfig.icon, 64, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(x, 3, z);
      sprite.scale.set(2, 2, 1);
      scene.add(sprite);
    });

    // 学生之间的互动连线
    for (let i = 0; i < studentActivities.length; i++) {
      for (let j = i + 1; j < studentActivities.length; j++) {
        const student1 = studentActivities[i];
        const student2 = studentActivities[j];

        // 如果两个学生都在讨论或有互动，显示连线
        if (student1.currentActivity === 'discussing' && student2.currentActivity === 'discussing') {
          const points = [
            new THREE.Vector3(student1.position.x, student1.position.y, student1.position.z),
            new THREE.Vector3(student2.position.x, student2.position.y, student2.position.z)
          ];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineDashedMaterial({
            color: 0x722ed1,
            dashSize: 1,
            gapSize: 0.5,
            transparent: true,
            opacity: 0.6
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          line.computeLineDistances();
          scene.add(line);
        }
      }
    }

    // 鼠标点击事件
    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current || !cameraRef.current || !raycasterRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
      );

      raycasterRef.current.setFromCamera(mouse, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(studentMeshes);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object as THREE.Mesh;
        const studentData = clickedMesh.userData.student as StudentActivity;
        if (studentData) {
          handleStudentClick(studentData);
        }
      }
    };

    containerRef.current.addEventListener('click', onMouseClick);

    // 动画循环
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      // 学生动画效果
      studentActivityMeshes.forEach((item, index) => {
        const { mesh, student } = item;
        const activityConfig = getActivityConfig(student.currentActivity);

        // 根据不同活动状态显示不同动画
        switch (student.currentActivity) {
          case 'questioning':
            // 举手上下运动
            mesh.position.y = 1.5 + Math.sin(time * 3) * 0.3;
            break;
          case 'note_taking':
            // 轻微晃动表示写字
            mesh.position.x = student.position.x + Math.sin(time * 5) * 0.1;
            break;
          case 'distracted':
            // 低垂状态
            mesh.position.y = 1.5 + Math.sin(time * 0.5) * 0.1;
            mesh.rotation.x = Math.sin(time * 0.3) * 0.2;
            break;
          case 'understanding':
            // 点头动作
            mesh.rotation.x = Math.sin(time * 2) * 0.2;
            break;
          case 'confused':
            // 左右摇头
            mesh.rotation.z = Math.sin(time * 1.5) * 0.15;
            break;
          case 'listening':
          default:
            // 正常呼吸效果
            mesh.position.y = 1.5 + Math.sin(time + index) * 0.05;
            break;
        }
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('click', onMouseClick);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      controls.dispose();
      renderer.dispose();

      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [isClient, studentActivities, handleStudentClick]);

  const handleResetView = () => {
    changeView('free');
  };

  if (!isClient) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#fff', fontSize: '16px' }}>加载中...</span>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="总互动次数"
              value={interactionStats.totalInteractions}
              prefix={<MessageOutlined style={{ color: '#1890ff' }} />}
              suffix="次"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="活跃学生"
              value={interactionStats.activeStudents}
              prefix={<TeamOutlined style={{ color: '#52c41a' }} />}
              suffix={`/ ${studentActivities.length}`}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="平均参与度"
              value={interactionStats.avgParticipation}
              prefix={<RiseOutlined style={{ color: '#faad14' }} />}
              suffix="%"
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <Statistic
              title="提问数"
              value={interactionStats.questionsAsked}
              prefix={<CommentOutlined style={{ color: '#722ed1' }} />}
              suffix="个"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span>
                <TeamOutlined style={{ marginRight: 8 }} />
                3D课堂互动可视化
              </span>
            }
            extra={
              <Space wrap>
                <Button
                  icon={<CameraOutlined />}
                  onClick={handleResetView}
                  size="small"
                >
                  重置视角
                </Button>
                <Button
                  icon={<FullscreenOutlined />}
                  onClick={() => changeView('top')}
                  size="small"
                >
                  俯视图
                </Button>
                <Button
                  icon={<EyeOutlined />}
                  onClick={() => changeView('teacher')}
                  size="small"
                >
                  教师视角
                </Button>
              </Space>
            }
          >
            <Alert
              message="操作提示"
              description="鼠标拖拽旋转视角 | 滚轮缩放 | 点击学生查看详情"
              type="info"
              showIcon
              style={{ marginBottom: 16 }}
            />

            <div
              ref={containerRef}
              style={{
                width: '100%',
                height: '500px',
                borderRadius: '8px',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            />

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Tooltip title="专注听讲中">
                <Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  👂 正在听课
                </Tag>
              </Tooltip>
              <Tooltip title="举手提问中">
                <Tag color="processing" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  🙋 正在提问
                </Tag>
              </Tooltip>
              <Tooltip title="记录重点内容">
                <Tag color="warning" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  ✍️ 正在做笔记
                </Tag>
              </Tooltip>
              <Tooltip title="需要提醒">
                <Tag color="error" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  😴 走神/分心
                </Tag>
              </Tooltip>
              <Tooltip title="与同学交流讨论">
                <Tag color="purple" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  💬 小组讨论
                </Tag>
              </Tooltip>
              <Tooltip title="需要帮助">
                <Tag color="orange" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  ❓ 有疑惑
                </Tag>
              </Tooltip>
              <Tooltip title="理解了知识点">
                <Tag color="cyan" style={{ fontSize: '14px', padding: '4px 12px' }}>
                  ✅ 理解点头
                </Tag>
              </Tooltip>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title={
              <span>
                <TeamOutlined style={{ marginRight: 8 }} />
                学生活动详情
              </span>
            }
            extra={<Badge status="processing" text="实时更新" />}
          >
            <List
              itemLayout="horizontal"
              dataSource={studentActivities.sort((a, b) => b.participationScore - a.participationScore)}
              renderItem={(student) => {
                const activityConfig = getActivityConfig(student.currentActivity);
                return (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleStudentClick(student)}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          style={{
                            backgroundColor: `#${activityConfig.color.toString(16).padStart(6, '0')}`
                          }}
                          icon={<UserOutlined />}
                        />
                      }
                      title={
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{student.name}</span>
                          <Tag
                            color={
                              student.currentActivity === 'distracted' ? 'red' :
                              student.currentActivity === 'questioning' ? 'blue' :
                              student.currentActivity === 'confused' ? 'orange' : 'green'
                            }
                            style={{ margin: 0 }}
                          >
                            {activityConfig.icon} {activityConfig.label}
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <div style={{
                            width: '100%',
                            height: 4,
                            background: '#f0f0f0',
                            borderRadius: 2,
                            marginTop: 4
                          }}>
                            <div style={{
                              width: `${student.participationScore}%`,
                              height: '100%',
                              background: `#${activityConfig.color.toString(16).padStart(6, '0')}`,
                              borderRadius: 2,
                              transition: 'width 0.3s ease'
                            }} />
                          </div>
                          <div style={{ marginTop: 4, fontSize: 12, color: '#999' }}>
                            参与度: {student.participationScore}% | {activityConfig.description}
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 学生详情弹窗 */}
      <Modal
        title={
          <span>
            <UserOutlined style={{ marginRight: 8 }} />
            {selectedStudent?.name} - 学生活动详情
          </span>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {selectedStudent && (
          <div>
            <Alert
              message={getActivityConfig(selectedStudent.currentActivity).label}
              description={getActivityConfig(selectedStudent.currentActivity).description}
              type={
                selectedStudent.currentActivity === 'distracted' ? 'error' :
                selectedStudent.currentActivity === 'confused' ? 'warning' :
                selectedStudent.currentActivity === 'questioning' ? 'info' : 'success'
              }
              showIcon
              style={{ marginBottom: 16 }}
            />

            <Descriptions column={2} bordered size="small">
              <Descriptions.Item label="学号">{selectedStudent.studentIdNumber}</Descriptions.Item>
              <Descriptions.Item label="姓名">{selectedStudent.name}</Descriptions.Item>
              <Descriptions.Item label="当前状态">
                <Tag color={
                  selectedStudent.currentActivity === 'distracted' ? 'red' :
                  selectedStudent.currentActivity === 'questioning' ? 'blue' :
                  selectedStudent.currentActivity === 'confused' ? 'orange' : 'green'
                }>
                  {getActivityConfig(selectedStudent.currentActivity).icon} {getActivityConfig(selectedStudent.currentActivity).label}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="持续时间">
                {selectedStudent.activityDuration} 分钟
              </Descriptions.Item>
              <Descriptions.Item label="参与度评分">
                <Progress
                  percent={selectedStudent.participationScore}
                  size="small"
                  status={selectedStudent.participationScore >= 80 ? 'success' : selectedStudent.participationScore >= 60 ? 'normal' : 'exception'}
                />
              </Descriptions.Item>
              <Descriptions.Item label="最后活跃">
                {selectedStudent.lastActive}
              </Descriptions.Item>
            </Descriptions>

            <Divider orientation="left">活动统计</Divider>

            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="提问次数"
                    value={selectedStudent.questionCount}
                    prefix={<CommentOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="做笔记次数"
                    value={selectedStudent.noteTakingCount}
                    prefix={<FileTextOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ fontSize: '20px' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="分心次数"
                    value={selectedStudent.distractedCount}
                    prefix={<WarningOutlined style={{ color: '#ff4d4f' }} />}
                    valueStyle={{ fontSize: '20px', color: '#ff4d4f' }}
                  />
                </Card>
              </Col>
            </Row>

            {selectedStudent.currentActivity === 'distracted' && (
              <Alert
                message="建议提醒"
                description="该学生已分心较长时间，建议适当提醒或提问以吸引注意力"
                type="warning"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}

            {selectedStudent.currentActivity === 'confused' && (
              <Alert
                message="需要帮助"
                description="该学生表现出疑惑，可能需要额外解释或帮助"
                type="info"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Classroom3DScene;
