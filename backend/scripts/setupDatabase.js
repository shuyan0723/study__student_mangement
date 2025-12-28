const mysql = require('mysql2/promise');

async function createDatabase() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '123456',
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    const dbName = 'student_grade_system';
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database '${dbName}' created or already exists`);

    await connection.query(`USE ${dbName}`);

    const schema = `
      -- 用户表
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(36) PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE,
        role ENUM('student', 'teacher', 'admin') NOT NULL DEFAULT 'student',
        avatar_url VARCHAR(500),
        full_name VARCHAR(100),
        phone VARCHAR(20),
        status ENUM('active', 'inactive', 'banned') DEFAULT 'active',
        last_login_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_username (username),
        INDEX idx_role (role),
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 学生表
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        student_number VARCHAR(50) NOT NULL UNIQUE,
        enrollment_year INT,
        department VARCHAR(100),
        major VARCHAR(100),
        class_name VARCHAR(50),
        status ENUM('active', 'suspended', 'graduated', 'dropped') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_student_number (student_number),
        INDEX idx_enrollment_year (enrollment_year)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 教师表
      CREATE TABLE IF NOT EXISTS teachers (
        id VARCHAR(36) PRIMARY KEY,
        user_id VARCHAR(36) NOT NULL,
        teacher_number VARCHAR(50) NOT NULL UNIQUE,
        department VARCHAR(100),
        title VARCHAR(50),
        position VARCHAR(50),
        hire_date DATE,
        status ENUM('active', 'inactive', 'retired') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_teacher_number (teacher_number),
        INDEX idx_department (department)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 课程表
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(36) PRIMARY KEY,
        course_code VARCHAR(50) NOT NULL UNIQUE,
        course_name VARCHAR(100) NOT NULL,
        credits DECIMAL(3,1) NOT NULL,
        course_type ENUM('required', 'elective', 'public') DEFAULT 'required',
        description TEXT,
        teacher_id VARCHAR(36),
        semester VARCHAR(20) NOT NULL,
        academic_year VARCHAR(10) NOT NULL,
        schedule VARCHAR(200),
        classroom VARCHAR(100),
        max_students INT DEFAULT 100,
        status ENUM('active', 'inactive', 'completed') DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
        INDEX idx_course_code (course_code),
        INDEX idx_semester (semester),
        INDEX idx_teacher (teacher_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 成绩表
      CREATE TABLE IF NOT EXISTS grades (
        id VARCHAR(36) PRIMARY KEY,
        student_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        score DECIMAL(5,2),
        grade_level VARCHAR(10),
        feedback TEXT,
        submission_status ENUM('pending', 'submitted', 'graded', 'revised') DEFAULT 'pending',
        submitted_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE KEY uk_student_course (student_id, course_id),
        INDEX idx_student (student_id),
        INDEX idx_course (course_id),
        INDEX idx_submission_status (submission_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 消息表
      CREATE TABLE IF NOT EXISTS messages (
        id VARCHAR(36) PRIMARY KEY,
        sender_id VARCHAR(36) NOT NULL,
        receiver_id VARCHAR(36) NOT NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_sender (sender_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      -- 申诉表
      CREATE TABLE IF NOT EXISTS appeals (
        id VARCHAR(36) PRIMARY KEY,
        student_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(36) NOT NULL,
        original_score DECIMAL(5,2),
        appeal_reason TEXT NOT NULL,
        attachments JSON,
        status ENUM('pending', 'reviewing', 'approved', 'rejected', 'closed') DEFAULT 'pending',
        reviewed_by VARCHAR(36),
        review_feedback TEXT,
        new_score DECIMAL(5,2),
        appeal_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        reviewed_time DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_student (student_id),
        INDEX idx_course (course_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await connection.query(schema);
    console.log('✅ All tables created successfully');

    const [tables] = await connection.query("SHOW TABLES");
    console.log('\n📊 Created tables:');
    tables.forEach((table) => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n✅ Database setup completed!');
    }
  }
}

createDatabase();
