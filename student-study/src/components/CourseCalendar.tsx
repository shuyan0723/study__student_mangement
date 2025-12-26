import React from 'react';
import { Card, Tag, Tooltip } from 'antd';
import type { Course } from '../types';

interface CourseCalendarProps {
  courses: Course[];
}

interface ScheduleCell {
  course: Course;
  dayOfWeek: number;
  startSection: number;
  endSection: number;
  location?: string;
}

const DAY_NAMES = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
const SECTION_COUNT = 8;
const COLORS = [
  '#1890ff', '#52c41a', '#faad14', '#f5222d',
  '#722ed1', '#13c2c2', '#eb2f96', '#fa8c16',
  '#2f54eb', '#52c41a',
];

const getCourseColor = (courseId: string): string => {
  const colorIndex = courseId.charCodeAt(courseId.length - 1) % COLORS.length;
  return COLORS[colorIndex];
};

const CourseCalendar: React.FC<CourseCalendarProps> = ({ courses }) => {
  const scheduleData: Map<string, ScheduleCell[]> = new Map();

  courses.forEach((course) => {
    if (course.schedule && course.schedule.length > 0) {
      course.schedule.forEach((schedule) => {
        const key = `${schedule.dayOfWeek}-${schedule.startSection}`;
        const existing = scheduleData.get(key) || [];
        existing.push({
          course,
          dayOfWeek: schedule.dayOfWeek,
          startSection: schedule.startSection,
          endSection: schedule.endSection,
          location: schedule.location,
        });
        scheduleData.set(key, existing);
      });
    }
  });

  const renderScheduleCell = (day: number, section: number) => {
    const key = `${day}-${section}`;
    const cells = scheduleData.get(key);

    if (!cells || cells.length === 0) {
      return <div className="schedule-cell empty" />;
    }

    return (
      <div className="schedule-cell">
        {cells.map((cell, index) => (
          <Tooltip
            key={`${cell.course.courseId}-${index}`}
            title={
              <div>
                <div style={{ fontWeight: 'bold' }}>{cell.course.courseName}</div>
                <div>教师: {cell.course.teacherName}</div>
                <div>地点: {cell.location || '未指定'}</div>
                <div>节次: 第{cell.startSection}-{cell.endSection}节</div>
              </div>
            }
          >
            <Tag
              color={getCourseColor(cell.course.courseId)}
              style={{
                margin: '2px 0',
                fontSize: '11px',
                whiteSpace: 'normal',
                lineHeight: '1.2',
                maxWidth: '100%',
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{cell.course.courseName}</div>
              <div>{cell.location}</div>
            </Tag>
          </Tooltip>
        ))}
      </div>
    );
  };

  return (
    <Card title="课程时间表" style={{ overflow: 'auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', paddingBottom: '8px' }}>
          <div style={{ width: '60px', flexShrink: 0, fontWeight: 'bold', color: '#666' }}>节次</div>
          {DAY_NAMES.map((name, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                textAlign: 'center',
                fontWeight: 'bold',
                color: '#1890ff',
                fontSize: '14px',
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {Array.from({ length: SECTION_COUNT }, (_, sectionIndex) => (
          <div
            key={sectionIndex}
            style={{
              display: 'flex',
              minHeight: sectionIndex >= 5 ? '60px' : '50px',
              borderBottom: '1px solid #f0f0f0',
            }}
          >
            <div
              style={{
                width: '60px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                color: '#999',
                fontSize: '12px',
                backgroundColor: '#fafafa',
              }}
            >
              {sectionIndex + 1}
            </div>
            {Array.from({ length: 7 }, (_, dayIndex) => (
              <div
                key={dayIndex}
                style={{
                  flex: 1,
                  borderLeft: '1px solid #f0f0f0',
                  padding: '4px',
                  minHeight: sectionIndex >= 5 ? '56px' : '46px',
                }}
              >
                {renderScheduleCell(dayIndex + 1, sectionIndex + 1)}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: '#fafafa', borderRadius: '8px' }}>
        <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#333' }}>课程图例</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {courses.slice(0, 6).map((course) => (
            <Tag key={course.courseId} color={getCourseColor(course.courseId)}>
              {course.courseName}
            </Tag>
          ))}
          {courses.length > 6 && (
            <Tag color="default">+{courses.length - 6} 门课程</Tag>
          )}
        </div>
      </div>

      <style>{`
        .schedule-cell {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        .schedule-cell.empty {
          background-color: #fafafa;
        }
      `}</style>
    </Card>
  );
};

export default CourseCalendar;
