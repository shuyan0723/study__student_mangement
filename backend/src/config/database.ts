import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'student_grade_system',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '123456',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX || '10'),
    min: parseInt(process.env.DB_POOL_MIN || '2'),
    acquire: 30000,
    idle: 10000
  },
  timezone: '+08:00',
  dialectOptions: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Synchronize database models
const syncDatabase = async () => {
  try {
    await sequelize.sync({
      alter: process.env.NODE_ENV === 'development' ? true : false,
      force: false
    });
    console.log('✅ Database models synchronized successfully.');
  } catch (error) {
    console.error('❌ Failed to synchronize database models:', error);
    process.exit(1);
  }
};

export { sequelize, testConnection, syncDatabase };
export default sequelize;