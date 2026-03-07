const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedData() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      database: 'student_grade_system',
      multipleStatements: true
    });

    console.log('✅ Connected to database');

    // 清空现有数据（按外键依赖顺序）
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('TRUNCATE TABLE appeals');
    await connection.query('TRUNCATE TABLE messages');
    await connection.query('TRUNCATE TABLE grades');
    await connection.query('TRUNCATE TABLE courses');
    await connection.query('TRUNCATE TABLE students');
    await connection.query('TRUNCATE TABLE teachers');
    await connection.query('TRUNCATE TABLE users');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('✅ Cleared existing data');

    // 生成UUID的辅助函数
    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    const hashedPassword = await bcrypt.hash('123456', 10);

    // 创建用户
    const users = [
      {
        id: generateUUID(),
        username: 'admin',
        password_hash: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
        status: 'active'
      },
      {
        id: generateUUID(),
        username: 'teacher01',
        password_hash: hashedPassword,
        email: 'teacher01@example.com',
        role: 'teacher',
        status: 'active'
      },
      {
        id: generateUUID(),
        username: 'teacher02',
        password_hash: hashedPassword,
        email: 'teacher02@example.com',
        role: 'teacher',
        status: 'active'
      },
      {
        id: generateUUID(),
        username: 'student01',
        password_hash: hashedPassword,
        email: 'student01@example.com',
        role: 'student',
        status: 'active'
      },
      {
        id: generateUUID(),
        username: 'student02',
        password_hash: hashedPassword,
        email: 'student02@example.com',
        role: 'student',
        status: 'active'
      },
      {
        id: generateUUID(),
        username: 'student03',
        password_hash: hashedPassword,
        email: 'student03@example.com',
        role: 'student',
        status: 'active'
      }
    ];

    for (const user of users) {
      await connection.query(
        'INSERT INTO users (id, username, password_hash, email, role, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user.id, user.username, user.password_hash, user.email, user.role, user.status]
      );
    }
    console.log('✅ Created users');

    // 创建教师详细信息
    const teacher01Id = users.find(u => u.username === 'teacher01').id;
    const teacher02Id = users.find(u => u.username === 'teacher02').id;

    await connection.query(
      'INSERT INTO teachers (id, user_id, teacher_id, name, gender, department, title) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [generateUUID(), teacher01Id, 'T001', '张老师', 'male', '计算机学院', '副教授']
    );

    await connection.query(
      'INSERT INTO teachers (id, user_id, teacher_id, name, gender, department, title) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [generateUUID(), teacher02Id, 'T002', '李老师', 'female', '数学学院', '讲师']
    );
    console.log('✅ Created teachers');

    // 创建学生详细信息
    const student01Id = users.find(u => u.username === 'student01').id;
    const student02Id = users.find(u => u.username === 'student02').id;
    const student03Id = users.find(u => u.username === 'student03').id;

    await connection.query(
      'INSERT INTO students (id, user_id, student_id, name, gender, college, major) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [generateUUID(), student01Id, 'S001', '张三', 'male', '计算机学院', '计算机科学与技术']
    );

    await connection.query(
      'INSERT INTO students (id, user_id, student_id, name, gender, college, major) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [generateUUID(), student02Id, 'S002', '李四', 'female', '计算机学院', '软件工程']
    );

    await connection.query(
      'INSERT INTO students (id, user_id, student_id, name, gender, college, major) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [generateUUID(), student03Id, 'S003', '王五', 'male', '数学学院', '应用数学']
    );
    console.log('✅ Created students');

    // 获取教师ID
    const [teachers] = await connection.query('SELECT id FROM teachers WHERE teacher_id IN (?, ?)', ['T001', 'T002']);
    const teacher1 = teachers[0];
    const teacher2 = teachers[1];

    // 创建课程
    const course1Id = generateUUID();
    const course2Id = generateUUID();
    const course3Id = generateUUID();

    await connection.query(
      'INSERT INTO courses (id, course_id, course_name, credits, hours, semester, teacher_id, capacity, enrolled_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [course1Id, 'CS101', '数据结构', 4.0, 64, '2024-1', teacher1.id, 100, 30, 'active']
    );

    await connection.query(
      'INSERT INTO courses (id, course_id, course_name, credits, hours, semester, teacher_id, capacity, enrolled_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [course2Id, 'CS102', '算法分析', 3.5, 56, '2024-1', teacher1.id, 80, 25, 'active']
    );

    await connection.query(
      'INSERT INTO courses (id, course_id, course_name, credits, hours, semester, teacher_id, capacity, enrolled_count, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [course3Id, 'MATH201', '高等数学', 5.0, 80, '2024-1', teacher2.id, 120, 45, 'active']
    );
    console.log('✅ Created courses');

    // 获取学生ID
    const [students] = await connection.query('SELECT id FROM students WHERE student_id IN (?, ?, ?)', ['S001', 'S002', 'S003']);
    const student1 = students[0];
    const student2 = students[1];
    const student3 = students[2];

    // 创建成绩
    const grades = [
      { student_id: student1.id, course_id: course1Id, score: 85.5, grade_level: 'B', submission_status: 'graded' },
      { student_id: student1.id, course_id: course2Id, score: 92.0, grade_level: 'A', submission_status: 'graded' },
      { student_id: student1.id, course_id: course3Id, score: 78.0, grade_level: 'C', submission_status: 'graded' },
      { student_id: student2.id, course_id: course1Id, score: 88.0, grade_level: 'B', submission_status: 'graded' },
      { student_id: student2.id, course_id: course2Id, score: 95.5, grade_level: 'A', submission_status: 'graded' },
      { student_id: student2.id, course_id: course3Id, score: 82.0, grade_level: 'B', submission_status: 'graded' },
      { student_id: student3.id, course_id: course3Id, score: 90.0, grade_level: 'A', submission_status: 'graded' }
    ];

    for (const grade of grades) {
      await connection.query(
        'INSERT INTO grades (id, student_id, course_id, score, grade_level, submission_status) VALUES (?, ?, ?, ?, ?, ?)',
        [generateUUID(), grade.student_id, grade.course_id, grade.score, grade.grade_level, grade.submission_status]
      );
    }
    console.log('✅ Created grades');

    // 创建消息
    const messages = [
      { sender_id: student1.id, receiver_id: teacher1.id, content: '老师，请问什么时候可以查看成绩？' },
      { sender_id: teacher1.id, receiver_id: student1.id, content: '成绩已经发布，你可以登录系统查看。' },
      { sender_id: student2.id, receiver_id: teacher1.id, content: '老师，关于作业2我有几个问题想请教。' }
    ];

    for (const msg of messages) {
      await connection.query(
        'INSERT INTO messages (id, sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, ?, ?)',
        [generateUUID(), msg.sender_id, msg.receiver_id, msg.content, false]
      );
    }
    console.log('✅ Created messages');

    // 创建申诉
    await connection.query(
      'INSERT INTO appeals (id, student_id, course_id, original_score, appeal_reason, status) VALUES (?, ?, ?, ?, ?, ?)',
      [generateUUID(), student3.id, course3Id, 88.0, '我认为我的期末考试应该得到更高的分数，因为我在论述题中提供了充分的论据。', 'pending']
    );
    console.log('✅ Created appeals');

    console.log('\n🎉 Seed data completed successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Admin: username=admin, password=123456');
    console.log('   Teacher: username=teacher01, password=123456');
    console.log('   Student: username=student01, password=123456');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database connection closed');
    }
  }
}

seedData();
