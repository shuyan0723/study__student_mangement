import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Card, Statistic, Row, Col, Tag, List, Avatar, Tooltip, Badge } from 'antd';
import { 
  TeamOutlined, 
  RiseOutlined, 
  MessageOutlined, 
  EyeOutlined,
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';

interface StudentNode {
  id: string;
  name: string;
  participation: number;
  lastActive: string;
  status: 'active' | 'idle' | 'away';
}

const Classroom3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  // const [selectedStudent, setSelectedStudent] = useState<StudentNode | null>(null);
  const [interactionStats] = useState({
    totalInteractions: 156,
    activeStudents: 28,
    avgParticipation: 72,
    questionsAsked: 43
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x1890ff, 1, 50);
    pointLight1.position.set(-10, 10, -10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x52c41a, 1, 50);
    pointLight2.position.set(10, 10, 10);
    scene.add(pointLight2);

    const floorGeometry = new THREE.PlaneGeometry(40, 30);
    const floorMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x16213e,
      side: THREE.DoubleSide 
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const gridHelper = new THREE.GridHelper(40, 20, 0x0f3460, 0x0f3460);
    gridHelper.position.y = 0.01;
    scene.add(gridHelper);

    const studentNodes: StudentNode[] = [
      { id: '1', name: '张三', participation: 85, lastActive: '刚刚', status: 'active' },
      { id: '2', name: '李四', participation: 92, lastActive: '刚刚', status: 'active' },
      { id: '3', name: '王五', participation: 68, lastActive: '5分钟前', status: 'idle' },
      { id: '4', name: '赵六', participation: 78, lastActive: '刚刚', status: 'active' },
      { id: '5', name: '钱七', participation: 95, lastActive: '刚刚', status: 'active' },
      { id: '6', name: '孙八', participation: 45, lastActive: '15分钟前', status: 'away' },
      { id: '7', name: '周九', participation: 88, lastActive: '刚刚', status: 'active' },
      { id: '8', name: '吴十', participation: 72, lastActive: '3分钟前', status: 'idle' },
    ];

    const seats: THREE.Mesh[] = [];
    const connections: THREE.Line[] = [];
    const studentMeshes: { mesh: THREE.Mesh; student: StudentNode }[] = [];

    const rowCount = 2;
    const colCount = 4;
    const spacing = 6;

    studentNodes.forEach((student, index) => {
      const row = Math.floor(index / colCount);
      const col = index % colCount;
      const x = (col - (colCount - 1) / 2) * spacing;
      const z = (row - (rowCount - 1) / 2) * spacing * 1.5;

      const seatGeometry = new THREE.BoxGeometry(3, 0.3, 2.5);
      const seatMaterial = new THREE.MeshPhongMaterial({
        color: student.status === 'active' ? 0x1890ff : 
               student.status === 'idle' ? 0xfaad14 : 0x8c8c8c,
        transparent: true,
        opacity: 0.6
      });
      const seat = new THREE.Mesh(seatGeometry, seatMaterial);
      seat.position.set(x, 0.15, z);
      seat.receiveShadow = true;
      scene.add(seat);
      seats.push(seat);

      const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
      const color = student.status === 'active' ? 0x52c41a :
                    student.status === 'idle' ? 0xfaad14 : 0xff4d4f;
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.9
      });
      const studentSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      studentSphere.position.set(x, 1.5, z);
      studentSphere.castShadow = true;
      scene.add(studentSphere);
      studentMeshes.push({ mesh: studentSphere, student: student });

      const indicatorGeometry = new THREE.ConeGeometry(0.3, 0.6, 8);
      const indicatorMaterial = new THREE.MeshPhongMaterial({
        color: 0x1890ff,
        emissive: 0x1890ff,
        emissiveIntensity: 0.5
      });
      const indicator = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
      indicator.position.set(x, 2.8, z);
      scene.add(indicator);

      const pulseGeometry = new THREE.RingGeometry(1.2, 1.5, 32);
      const pulseMaterial = new THREE.MeshBasicMaterial({
        color: 0x52c41a,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
      pulse.rotation.x = -Math.PI / 2;
      pulse.position.set(x, 0.05, z); 
      scene.add(pulse);
    });

    for (let i = 0; i < studentMeshes.length; i++) {
      for (let j = i + 1; j < studentMeshes.length; j++) {
        if (Math.random() > 0.5) {
          const points = [
            studentMeshes[i].mesh.position.clone(),
            studentMeshes[j].mesh.position.clone()
          ];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x1890ff,
            transparent: true,
            opacity: 0.3
          });
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
          connections.push(line);
        }
      }
    }

    const teacherDeskGeometry = new THREE.BoxGeometry(6, 0.5, 2);
    const teacherDeskMaterial = new THREE.MeshPhongMaterial({ color: 0x722ed1 });
    const teacherDesk = new THREE.Mesh(teacherDeskGeometry, teacherDeskMaterial);
    teacherDesk.position.set(0, 0.25, -10);
    teacherDesk.castShadow = true;
    teacherDesk.receiveShadow = true;
    scene.add(teacherDesk);

    const teacherGeometry = new THREE.CylinderGeometry(0.8, 0.8, 2, 32);
    const teacherMaterial = new THREE.MeshPhongMaterial({ color: 0xeb2f96 });
    const teacher = new THREE.Mesh(teacherGeometry, teacherMaterial);
    teacher.position.set(0, 1, -10);
    teacher.castShadow = true;
    scene.add(teacher);

    const animationObjects: { 
      mesh: THREE.Mesh; 
      baseY: number; 
      speed: number; 
      offset: number;
    }[] = [];

    studentMeshes.forEach((item, index) => {
      animationObjects.push({
        mesh: item.mesh,
        baseY: item.mesh.position.y,
        speed: 0.5 + Math.random() * 0.5,
        offset: index * 0.5
      });
    });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const time = Date.now() * 0.001;

      animationObjects.forEach(obj => {
        obj.mesh.position.y = obj.baseY + Math.sin(time * obj.speed + obj.offset) * 0.1;
      });

      scene.rotation.y = Math.sin(time * 0.1) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '400px',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: '8px'
      }}>
        <span style={{ color: '#fff' }}>加载中...</span>
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
              suffix="/ 32"
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
              prefix={<MessageOutlined style={{ color: '#722ed1' }} />}
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
              <Tag color="blue">实时</Tag>
            }
          >
            <div 
              ref={containerRef} 
              style={{ 
                width: '100%', 
                height: '500px',
                borderRadius: '8px',
                overflow: 'hidden'
              }}
            />
            <div style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Tooltip title="活跃学生">
                <Tag color="green" icon={<CheckCircleOutlined />}>
                  活跃 (参与度 ≥ 80%)
                </Tag>
              </Tooltip>
              <Tooltip title="较不活跃">
                <Tag color="gold" icon={<MessageOutlined />}>
                  较不活跃 (参与度 50-79%)
                </Tag>
              </Tooltip>
              <Tooltip title="离开/离线">
                <Tag color="red" icon={<EyeOutlined />}>
                  离开 (参与度 &lt; 50%)
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
                学生参与详情
              </span>
            }
            extra={<Badge status="processing" text="实时更新" />}
          >
            <List
              itemLayout="horizontal"
              dataSource={[
                { name: '钱七', participation: 95, status: 'active' },
                { name: '李四', participation: 92, status: 'active' },
                { name: '周九', participation: 88, status: 'active' },
                { name: '张三', participation: 85, status: 'active' },
                { name: '赵六', participation: 78, status: 'idle' },
                { name: '吴十', participation: 72, status: 'idle' },
                { name: '王五', participation: 68, status: 'idle' },
                { name: '孙八', participation: 45, status: 'away' },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        style={{ 
                          backgroundColor: item.status === 'active' ? '#52c41a' :
                                          item.status === 'idle' ? '#faad14' : '#ff4d4f'
                        }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{item.name}</span>
                        <Tag 
                          color={item.status === 'active' ? 'green' : 
                                 item.status === 'idle' ? 'gold' : 'red'}
                          style={{ margin: 0 }}
                        >
                          {item.participation}%
                        </Tag>
                      </div>
                    }
                    description={
                      <div style={{ 
                        width: '100%', 
                        height: 4, 
                        background: '#f0f0f0', 
                        borderRadius: 2,
                        marginTop: 4
                      }}>
                        <div style={{
                          width: `${item.participation}%`,
                          height: '100%',
                          background: item.status === 'active' ? '#52c41a' :
                                     item.status === 'idle' ? '#faad14' : '#ff4d4f',
                          borderRadius: 2,
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="课堂互动趋势" size="small">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                <div key={time} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 40,
                    height: `${60 + Math.random() * 40}px`,
                    background: 'linear-gradient(180deg, #1890ff 0%, #52c41a 100%)',
                    borderRadius: '4px 4px 0 0',
                    marginBottom: 4
                  }} />
                  <span style={{ fontSize: 12, color: '#666' }}>{time}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="课程互动统计" size="small">
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[
                { id: '1', name: '数学', percentage: 85, color: '#1890ff' },
                { id: '2', name: '语文', percentage: 78, color: '#52c41a' },
                { id: '3', name: '英语', percentage: 92, color: '#722ed1' },
                { id: '4', name: '物理', percentage: 88, color: '#faad14' }
              ].map((course) => (
                <div key={course.id} style={{ textAlign: 'center' }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: `conic-gradient(${course.color} ${course.percentage}%, #f0f0f0 0)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                      {course.percentage}%
                    </span>
                  </div>
                  <span style={{ fontSize: 12 }}>{course.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Classroom3DScene;
