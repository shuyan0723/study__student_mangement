import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Card, Row, Col, Statistic, Table, Tag, Progress, Input, Select, Space, Button } from 'antd';
import { SearchOutlined, TrophyOutlined, BarChartOutlined, ReloadOutlined } from '@ant-design/icons';
import * as THREE from 'three';
import { Pie, Column } from '@ant-design/charts';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';

const Teaching3DScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { courses, grades, students } = useDataStore();
  const { user } = useAuthStore();

  // 筛选状态
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [scoreRange, setScoreRange] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const teacherCourses = courses.filter((c) => c.teacherId === user?.id);
  const courseIds = teacherCourses.map((c) => c.courseId);
  const teacherGrades = grades.filter((g) => courseIds.includes(g.courseId));

  const totalStudents = students.length;
  const totalCourses = teacherCourses.length;
  const totalGrades = teacherGrades.length;
  const avgScore = teacherGrades.length > 0
    ? (teacherGrades.reduce((sum, g) => sum + g.score, 0) / teacherGrades.length).toFixed(1)
    : '0';

  // 成绩等级分布统计
  const gradeDistribution = useMemo(() => {
    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    teacherGrades.forEach(g => {
      if (g.gradeLevel && Object.prototype.hasOwnProperty.call(distribution, g.gradeLevel)) {
        distribution[g.gradeLevel as keyof typeof distribution]++;
      }
    });
    return Object.entries(distribution).map(([level, count]) => ({
      type: level === 'A' ? '优秀(A)' :
            level === 'B' ? '良好(B)' :
            level === 'C' ? '中等(C)' :
            level === 'D' ? '及格(D)' : '不及格(F)',
      value: count,
    })).filter(item => item.value > 0);
  }, [teacherGrades]);

  // 成绩分析统计
  const gradeAnalysis = useMemo(() => {
    const total = teacherGrades.length;
    if (total === 0) return { excellent: 0, good: 0, pass: 0, fail: 0 };
    const excellent = teacherGrades.filter(g => g.gradeLevel === 'A').length;
    const good = teacherGrades.filter(g => g.gradeLevel === 'B').length;
    const pass = teacherGrades.filter(g => ['C', 'D'].includes(g.gradeLevel)).length;
    const fail = teacherGrades.filter(g => g.gradeLevel === 'F').length;
    return {
      excellent: Math.round((excellent / total) * 100),
      good: Math.round((good / total) * 100),
      pass: Math.round((pass / total) * 100),
      fail: Math.round((fail / total) * 100),
    };
  }, [teacherGrades]);

  // 课程成绩对比数据
  const courseComparisonData = useMemo(() => {
    return teacherCourses.map(course => {
      const courseGrades = teacherGrades.filter(g => g.courseId === course.courseId);
      const avg = courseGrades.length > 0
        ? (courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length).toFixed(1)
        : '0';
      return {
        course: course.courseName.length > 8 ? course.courseName.substring(0, 8) + '...' : course.courseName,
        平均分: parseFloat(avg),
      };
    });
  }, [teacherCourses, teacherGrades]);

  // 应用筛选后的成绩
  const filteredGrades = useMemo(() => {
    return teacherGrades.filter(grade => {
      // 课程筛选
      if (selectedCourse !== 'all' && grade.courseId !== selectedCourse) return false;

      // 分数范围筛选
      if (scoreRange !== 'all') {
        if (scoreRange === 'excellent' && grade.score < 90) return false;
        if (scoreRange === 'good' && (grade.score < 80 || grade.score >= 90)) return false;
        if (scoreRange === 'pass' && (grade.score < 60 || grade.score >= 80)) return false;
        if (scoreRange === 'fail' && grade.score >= 60) return false;
      }

      // 搜索筛选
      if (searchText) {
        const student = students.find(s => s.studentId === grade.studentId);
        if (!student) return false;
        const searchLower = searchText.toLowerCase();
        return (
          student.name.toLowerCase().includes(searchLower) ||
          student.studentId.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [teacherGrades, selectedCourse, scoreRange, searchText, students]);

  // 学生排行榜 - Top 10
  const topStudents = useMemo(() => {
    const studentAvgScores = new Map<string, { totalScore: number; count: number; name: string; studentId: string }>();

    filteredGrades.forEach(grade => {
      const student = students.find(s => s.studentId === grade.studentId);
      if (!student) return;

      const existing = studentAvgScores.get(student.studentId);
      if (existing) {
        existing.totalScore += grade.score;
        existing.count += 1;
      } else {
        studentAvgScores.set(student.studentId, {
          totalScore: grade.score,
          count: 1,
          name: student.name,
          studentId: student.studentId,
        });
      }
    });

    return Array.from(studentAvgScores.values())
      .map(item => ({
        ...item,
        avgScore: (item.totalScore / item.count).toFixed(2),
      }))
      .sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore))
      .slice(0, 10);
  }, [filteredGrades, students]);

  // 高级统计分析
  const advancedStats = useMemo(() => {
    if (filteredGrades.length === 0) {
      return { max: 0, min: 0, median: 0, stdDev: 0 };
    }

    const scores = filteredGrades.map(g => g.score).sort((a, b) => a - b);
    const max = scores[scores.length - 1];
    const min = scores[0];

    // 中位数
    const mid = Math.floor(scores.length / 2);
    const median = scores.length % 2 !== 0
      ? scores[mid]
      : (scores[mid - 1] + scores[mid]) / 2;

    // 标准差
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    return { max, min, median, stdDev: stdDev.toFixed(2) };
  }, [filteredGrades]);

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

  // 3D场景点击选中的课程信息状态
  const [selectedCourseInfo, setSelectedCourseInfo] = useState<{
    courseName: string;
    students: number;
    avgScore: string;
    passRate: string;
  } | null>(null);

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

      // 为环形添加课程信息
      const course = teacherCourses[i];
      ring.userData = {
        type: 'course',
        courseId: course.courseId,
        courseName: course.courseName,
        index: i,
      } as { type: string; courseId: string; courseName: string; index: number | string };

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

    // 添加 Raycaster 用于鼠标点击检测
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // 处理鼠标点击事件
    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      // 计算鼠标在canvas中的位置
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // 更新 raycaster
      raycaster.setFromCamera(mouse, camera);

      // 检测与环形的交叉
      const intersects = raycaster.intersectObjects(rings);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const userData = clickedObject.userData as {
          type: string;
          courseId: string;
          courseName: string;
          index: number | string;
        };

        if (userData && userData.type === 'course') {
          // 查找该课程的统计数据
          const courseStat = courseStats.find(c => c.key === userData.courseId);
          if (courseStat) {
            setSelectedCourseInfo({
              courseName: userData.courseName,
              students: courseStat.students,
              avgScore: courseStat.avgScore,
              passRate: courseStat.passRate,
            });

            // 高亮点击的环形
            rings.forEach((ring, index) => {
              const material = ring.material as THREE.MeshPhongMaterial;
              if (index === Number(userData.index)) {
                material.emissive = new THREE.Color(0x1890ff);
                material.emissiveIntensity = 0.5;
              } else {
                material.emissive = new THREE.Color(0x000000);
                material.emissiveIntensity = 0;
              }
            });
          }
        }
      } else {
        // 点击空白处，重置选择
        setSelectedCourseInfo(null);
        rings.forEach((ring) => {
          const material = ring.material as THREE.MeshPhongMaterial;
          material.emissive = new THREE.Color(0x000000);
          material.emissiveIntensity = 0;
        });
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

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
      renderer.domElement.removeEventListener('click', onMouseClick);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [teacherCourses, courseStats]);

  // 重置筛选
  const handleResetFilters = () => {
    setSelectedCourse('all');
    setScoreRange('all');
    setSearchText('');
  };

  // 学生排行榜列定义
  const topStudentsColumns = [
    {
      title: '排名',
      key: 'rank',
      render: (_: unknown, __: unknown, index: number) => (
        <span style={{
          fontWeight: 'bold',
          color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#666'
        }}>
          {index < 3 && <TrophyOutlined style={{ marginRight: 4 }} />}
          #{index + 1}
        </span>
      ),
    },
    {
      title: '学号',
      dataIndex: 'studentId',
      key: 'studentId',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '平均分',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (score: string) => (
        <Tag color={parseFloat(score) >= 90 ? 'green' : parseFloat(score) >= 80 ? 'blue' : 'orange'}>
          {score}
        </Tag>
      ),
      sorter: (a: { avgScore: string }, b: { avgScore: string }) =>
        parseFloat(a.avgScore) - parseFloat(b.avgScore),
    },
    {
      title: '课程数',
      dataIndex: 'count',
      key: 'count',
    },
  ];

  return (
    <div>
      {/* 筛选搜索栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space size="large" wrap>
          <Input
            placeholder="搜索学生姓名或学号"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="选择课程"
            value={selectedCourse}
            onChange={setSelectedCourse}
            style={{ width: 150 }}
          >
            <Select.Option value="all">全部课程</Select.Option>
            {teacherCourses.map(course => (
              <Select.Option key={course.courseId} value={course.courseId}>
                {course.courseName}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="分数范围"
            value={scoreRange}
            onChange={setScoreRange}
            style={{ width: 120 }}
          >
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="excellent">优秀(90+)</Select.Option>
            <Select.Option value="good">良好(80-89)</Select.Option>
            <Select.Option value="pass">及格(60-79)</Select.Option>
            <Select.Option value="fail">不及格(&lt;60)</Select.Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={handleResetFilters}>
            重置筛选
          </Button>
        </Space>
      </Card>

      {/* 基础统计 */}
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

      {/* 成绩分析卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="优秀率 (A)">
            <Progress
              type="circle"
              percent={gradeAnalysis.excellent}
              strokeColor="#52c41a"
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="良好率 (B)">
            <Progress
              type="circle"
              percent={gradeAnalysis.good}
              strokeColor="#1890ff"
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="及格率 (C-D)">
            <Progress
              type="circle"
              percent={gradeAnalysis.pass}
              strokeColor="#faad14"
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card title="不及格率 (F)">
            <Progress
              type="circle"
              percent={gradeAnalysis.fail}
              strokeColor="#ff4d4f"
              format={(percent) => `${percent}%`}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={14}>
          <Card title="3D 教学数据可视化" extra={<Tag color="blue">点击环形查看详情</Tag>}>
            <div ref={containerRef} style={{ width: '100%', height: 400 }} />
            {selectedCourseInfo && (
              <div style={{
                position: 'absolute',
                top: 100,
                right: 30,
                background: 'rgba(255, 255, 255, 0.95)',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                minWidth: '200px',
                zIndex: 10,
              }}>
                <div style={{ marginBottom: 12, fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                  {selectedCourseInfo.courseName}
                </div>
                <div style={{ marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: '#666' }}>学生数：</span>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>{selectedCourseInfo.students}</span>
                </div>
                <div style={{ marginBottom: 8, fontSize: 14 }}>
                  <span style={{ color: '#666' }}>平均分：</span>
                  <span style={{ fontWeight: 'bold', color: '#52c41a' }}>{selectedCourseInfo.avgScore}</span>
                </div>
                <div style={{ fontSize: 14 }}>
                  <span style={{ color: '#666' }}>及格率：</span>
                  <span style={{ fontWeight: 'bold' }}>{selectedCourseInfo.passRate}</span>
                </div>
              </div>
            )}
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

      {/* 图表可视化区域 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card
            title="成绩等级分布"
            style={{ height: 480 }}
            styles={{
              header: { borderBottom: '2px solid #f0f0f0' },
              body: { padding: '24px' },
            }}
          >
            <Pie
              data={gradeDistribution}
              angleField="value"
              colorField="type"
              radius={0.8}
              innerRadius={0.6}
              label={{
                type: 'inner',
                offset: '-50%',
                content: '{value}',
                style: { textAlign: 'center', fontSize: 14, fontWeight: 'bold' },
              }}
              statistic={{
                title: {
                  style: { fontSize: '16px', fontWeight: 'bold', color: '#666' },
                  content: '总成绩数',
                },
                content: {
                  style: { fontSize: '24px', fontWeight: 'bold' },
                  content: filteredGrades.length,
                },
              }}
              legend={{
                layout: 'horizontal',
                position: 'bottom',
                offsetY: 10,
              }}
              style={{ height: 380 }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="课程平均分对比"
            style={{ height: 480 }}
            styles={{
              header: { borderBottom: '2px solid #f0f0f0' },
              body: { padding: '24px' },
            }}
          >
            <Column
              data={courseComparisonData}
              xField="course"
              yField="平均分"
              label={{
                position: 'top',
                style: { fill: '#000', fontSize: 12, fontWeight: 'bold' },
              }}
              meta={{
                平均分: { alias: '平均分', min: 0, max: 100 },
              }}
              columnStyle={{
                fill: '#1890ff',
                fillOpacity: 0.8,
                lineWidth: 1,
                stroke: '#1890ff',
              }}
              xAxis={{
                label: {
                  autoHide: true,
                  autoRotate: false,
                  style: { fontSize: 11 },
                },
                line: { style: { stroke: '#d9d9d9' } },
              }}
              yAxis={{
                label: {
                  style: { fontSize: 11 },
                },
                grid: { line: { style: { stroke: '#f0f0f0' } } },
              }}
              style={{ height: 380 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 高级统计分析 */}
      <Card
        title={<><BarChartOutlined /> 高级统计分析</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="最高分"
              value={advancedStats.max}
              suffix="分"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="最低分"
              value={advancedStats.min}
              suffix="分"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="中位数"
              value={advancedStats.median}
              suffix="分"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="标准差"
              value={advancedStats.stdDev}
              valueStyle={{ color: '#722ed1' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 学生排行榜 */}
      <Card
        title={<><TrophyOutlined /> Top 10 优秀学生排行榜</>}
      >
        <Table
          dataSource={topStudents}
          columns={topStudentsColumns}
          pagination={false}
          rowKey="studentId"
          size="small"
        />
      </Card>
    </div>
  );
};

export default Teaching3DScene;
