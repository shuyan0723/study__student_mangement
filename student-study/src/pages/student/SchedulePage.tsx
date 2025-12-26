import { Card, Table, Tag, Empty, Tabs, Button, Space } from 'antd';
import { CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store/authStore';
import { useDataStore } from '../../store/dataStore';
import { useMemo } from 'react';
import CourseCalendar from '../../components/CourseCalendar';

export const SchedulePage = () => {
  const { user } = useAuthStore();
  const { courses, studentCourses } = useDataStore();

  const mySchedule = useMemo(() => {
    const enrolledCourseIds = studentCourses
      .filter((sc) => sc.studentId === user?.id)
      .map((sc) => sc.courseId);

    return courses.filter((c) => enrolledCourseIds.includes(c.courseId));
  }, [courses, studentCourses, user?.id]);

  // 模拟课程表数据
  const scheduleData = mySchedule.map((course, index) => ({
    key: index,
    courseId: course.courseId,
    courseName: course.courseName,
    teacherName: course.teacherName,
    day: ['星期一', '星期二', '星期三', '星期四', '星期五'][index % 5],
    time: `${8 + (index % 4)}:00 - ${9 + (index % 4)}:00`,
    location: `教学楼${101 + index}`,
    credits: course.credits,
    hours: course.hours,
  }));

  // 考试安排模拟数据
  const exams = mySchedule.map((course, index) => ({
    key: index,
    courseId: course.courseId,
    courseName: course.courseName,
    examTime: `2024-${11 + Math.floor(index / 3)}-${15 + (index % 3) * 5}`,
    examRoom: `考场${201 + index}`,
    examType: index % 2 === 0 ? '笔试' : '口试',
    status: index % 3 === 0 ? '已安排' : '待确定',
  }));

  const scheduleColumns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '授课教师',
      dataIndex: 'teacherName',
      key: 'teacherName',
    },
    {
      title: '上课时间',
      dataIndex: 'time',
      key: 'time',
      render: (text: string) => (
        <span>
          <ClockCircleOutlined /> {text}
        </span>
      ),
    },
    {
      title: '上课地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" size="small">
            课程详情
          </Button>
          <Button type="link" size="small">
            提交作业
          </Button>
        </Space>
      ),
    },
  ];

  const examColumns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '考试时间',
      dataIndex: 'examTime',
      key: 'examTime',
      render: (text: string) => (
        <span>
          <CalendarOutlined /> {text}
        </span>
      ),
    },
    {
      title: '考试地点',
      dataIndex: 'examRoom',
      key: 'examRoom',
    },
    {
      title: '考试形式',
      dataIndex: 'examType',
      key: 'examType',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          笔试: 'blue',
          口试: 'green',
        };
        return <Tag color={colorMap[type]}>{type}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          已安排: 'success',
          待确定: 'warning',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" size="small">
            {record.status === '待确定' ? '查询安排' : '下载准考证'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        items={[
          {
            label: '课程表',
            key: 'schedule',
            children: (
              <Card title="我的课程表">
                {scheduleData.length > 0 ? (
                  <Table
                    dataSource={scheduleData}
                    columns={scheduleColumns}
                    pagination={{ pageSize: 10 }}
                    size="small"
                  />
                ) : (
                  <Empty description="暂无课程" />
                )}
              </Card>
            ),
          },
          {
            label: '考试安排',
            key: 'exams',
            children: (
              <Card title="考试安排表">
                {exams.length > 0 ? (
                  <>
                    <Table
                      dataSource={exams}
                      columns={examColumns}
                      pagination={{ pageSize: 10 }}
                      size="small"
                    />
                    <div
                      style={{
                        marginTop: 24,
                        padding: 12,
                        background: '#e6f7ff',
                        borderRadius: 4,
                        borderLeft: '4px solid #1890ff',
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong>ℹ️ 温馨提示</strong>: 请于考试前30分钟到达考场，准时参加考试。如有特殊情况，请提前联系教务处。
                      </p>
                    </div>
                  </>
                ) : (
                  <Empty description="暂无考试安排" />
                )}
              </Card>
            ),
          },
          {
            label: '课程日历',
            key: 'calendar',
            children: <CourseCalendar courses={mySchedule} />,
          },
        ]}
      />
    </div>
  );
};

export default SchedulePage;
