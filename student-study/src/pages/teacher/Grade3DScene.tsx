import React, { useEffect, useRef, useState } from 'react';
import { Card, Select, Row, Col, Statistic, Tag } from 'antd';
import * as THREE from 'three';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

const Grade3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { courses, grades } = useDataStore();
  const { user } = useAuthStore();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [stats, setStats] = useState({ a: 0, b: 0, c: 0, d: 0, f: 0 });

  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  const courseIds = teacherCourses.map((c) => c.courseId);
  const teacherGrades = grades.filter((g) => courseIds.includes(g.courseId));

  const filteredGrades = selectedCourse
    ? teacherGrades.filter((g) => g.courseId === selectedCourse)
    : teacherGrades;

  useEffect(() => {
    if (!containerRef.current) return;

    const counts = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    filteredGrades.forEach((g) => {
      if (counts[g.gradeLevel as keyof typeof counts] !== undefined) {
        counts[g.gradeLevel as keyof typeof counts]++;
      }
    });
    setStats({ a: counts.A, b: counts.B, c: counts.C, d: counts.D, f: counts.F });

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f2f5);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 10, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(20, 20, 0xcccccc, 0xe5e5e5);
    scene.add(gridHelper);

    const gradeData = [
      { label: 'A', count: counts.A, color: 0x52c41a },
      { label: 'B', count: counts.B, color: 0x1890ff },
      { label: 'C', count: counts.C, color: 0xfaad14 },
      { label: 'D', count: counts.D, color: 0xfa8c16 },
      { label: 'F', count: counts.F, color: 0xf5222d },
    ];

    const bars: THREE.Mesh[] = [];
    const maxCount = Math.max(...gradeData.map((d) => d.count), 1);

    gradeData.forEach((item, index) => {
      const height = item.count > 0 ? (item.count / maxCount) * 6 + 0.5 : 0.3;
      const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
      const material = new THREE.MeshPhongMaterial({
        color: item.color,
        transparent: true,
        opacity: 0.85,
      });
      const bar = new THREE.Mesh(geometry, material);
      bar.position.set((index - 2) * 3, height / 2, 0);
      bar.castShadow = true;
      bar.receiveShadow = true;
      scene.add(bar);
      bars.push(bar);

      if (item.count > 0) {
        const sphereGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
          color: item.color,
          emissive: item.color,
          emissiveIntensity: 0.3,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set((index - 2) * 3, height + 0.5, 0);
        scene.add(sphere);
      }
    });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      bars.forEach((bar) => {
        bar.rotation.y += 0.005;
      });
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
  }, [filteredGrades]);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={4}>
          <Card>
            <Statistic title="优秀(A)" value={stats.a} valueStyle={{ color: '#52c41a' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="良好(B)" value={stats.b} valueStyle={{ color: '#1890ff' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="中等(C)" value={stats.c} valueStyle={{ color: '#faad14' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="及格(D)" value={stats.d} valueStyle={{ color: '#fa8c16' }} />
          </Card>
        </Col>
        <Col span={4}>
          <Card>
            <Statistic title="不及格(F)" value={stats.f} valueStyle={{ color: '#f5222d' }} />
          </Card>
        </Col>
      </Row>
      <Card
        title="3D 成绩分布可视化"
        extra={
          <Select
            style={{ width: 200 }}
            placeholder="选择课程"
            allowClear
            value={selectedCourse || undefined}
            onChange={setSelectedCourse}
            options={teacherCourses.map((c) => ({
              label: c.courseName,
              value: c.courseId,
            }))}
          />
        }
      >
        <div ref={containerRef} style={{ width: '100%', height: 500 }} />
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Tag color="green">A (优秀)</Tag>
          <Tag color="blue">B (良好)</Tag>
          <Tag color="gold">C (中等)</Tag>
          <Tag color="orange">D (及格)</Tag>
          <Tag color="red">F (不及格)</Tag>
        </div>
      </Card>
    </div>
  );
};

export default Grade3DScene;
