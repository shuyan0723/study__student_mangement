import React, { useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Table, Tag } from 'antd';
import * as THREE from 'three';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

const Teaching3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { courses, grades, students } = useDataStore();
  const { user } = useAuthStore();

  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  const courseIds = teacherCourses.map((c) => c.courseId);
  const teacherGrades = grades.filter((g) => courseIds.includes(g.courseId));

  const totalStudents = students.length;
  const totalCourses = teacherCourses.length;
  const totalGrades = teacherGrades.length;
  const avgScore = teacherGrades.length > 0
    ? (teacherGrades.reduce((sum, g) => sum + g.score, 0) / teacherGrades.length).toFixed(1)
    : '0';

  const courseStats = teacherCourses.map((course) => {
    const courseGrades = teacherGrades.filter((g) => g.courseId === course.courseId);
    const courseStudents = courseGrades.length;
    const avg = courseStudents > 0
      ? (courseGrades.reduce((sum, g) => sum + g.score, 0) / courseStudents).toFixed(1)
      : '0';
    return {
      key: course.courseId,
      courseName: course.courseName,
      students: courseStudents,
      credits: course.credits,
      hours: course.hours,
      avgScore: avg,
      passRate: courseStudents > 0
        ? ((courseGrades.filter((g) => g.gradeLevel !== 'F').length / courseStudents) * 100).toFixed(1) + '%'
        : '0%',
    };
  });

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '学生数',
      dataIndex: 'students',
      key: 'students',
    },
    {
      title: '学分',
      dataIndex: 'credits',
      key: 'credits',
    },
    {
      title: '课时',
      dataIndex: 'hours',
      key: 'hours',
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
    },
    {
      title: '及格率',
      dataIndex: 'passRate',
      key: 'passRate',
      render: (text: string) => {
        const rate = parseFloat(text);
        return <Tag color={rate >= 90 ? 'green' : rate >= 70 ? 'blue' : 'red'}>{text}</Tag>;
      },
    },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 20, 10);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(30, 30, 0xdddddd, 0xeeeeee);
    scene.add(gridHelper);

    const courseCount = Math.min(teacherCourses.length, 8);
    const rings: THREE.Mesh[] = [];

    for (let i = 0; i < courseCount; i++) {
      const angle = (i / courseCount) * Math.PI * 2;
      const radius = 5 + (i % 3) * 4;

      const ringGeometry = new THREE.TorusGeometry(radius, 0.3, 16, 100, Math.PI * 0.6);
      const hue = (i / courseCount) * 0.3 + 0.5;
      const ringMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(hue, 0.7, 0.5),
        transparent: true,
        opacity: 0.8,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(0, 1 + i * 0.5, 0);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.z = angle;
      scene.add(ring);
      rings.push(ring);
    }

    const centerSphereGeometry = new THREE.SphereGeometry(2, 32, 32);
    const centerSphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x1890ff,
      emissive: 0x1890ff,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.9,
    });
    const centerSphere = new THREE.Mesh(centerSphereGeometry, centerSphereMaterial);
    scene.add(centerSphere);

    const particleCount = 200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30;
      positions[i + 1] = Math.random() * 10;
      positions[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x1890ff,
      size: 0.2,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      rings.forEach((ring, index) => {
        ring.rotation.z += 0.005 * (index % 2 === 0 ? 1 : -1);
      });

      centerSphere.rotation.y += 0.01;
      centerSphere.rotation.x += 0.005;

      particles.rotation.y += 0.002;

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
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [teacherCourses]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic title="教授课程数" value={totalCourses} prefix={<span style={{ color: '#1890ff' }}>📚</span>} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="学生总数" value={totalStudents} prefix={<span style={{ color: '#52c41a' }}>👥</span>} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="成绩记录数" value={totalGrades} prefix={<span style={{ color: '#faad14' }}>📝</span>} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="平均分" value={avgScore} prefix={<span style={{ color: '#722ed1' }}>🎯</span>} suffix="分" />
          </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={14}>
          <Card title="3D 教学数据可视化">
            <div ref={containerRef} style={{ width: '100%', height: 400 }} />
          </Card>
        </Col>
        <Col span={10}>
          <Card title="课程统计详情">
            <Table
              dataSource={courseStats}
              columns={columns}
              pagination={false}
              size="small"
              scroll={{ y: 300 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Teaching3DScene;
