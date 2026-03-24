// Import all models
import User from './User';
import Student from './Student';
import Teacher from './Teacher';
import Course from './Course';
import Grade from './Grade';
import Message from './Message';
import Appeal from './Appeal';
import CallHistory from './CallHistory';
import ApiConfig from './ApiConfig';
import AnalysisRecord from './AnalysisRecord';
import AnalysisTemplate from './AnalysisTemplate';

// 确保所有模型都被加载（Sequelize 需要这样来识别模型）
// 这些导入会触发模型的 init() 方法，使 Sequelize 能够同步表结构
User;
Student;
Teacher;
Course;
Grade;
Message;
Appeal;
CallHistory;
ApiConfig;
AnalysisRecord;
AnalysisTemplate;

// Export all models
export {
  User,
  Student,
  Teacher,
  Course,
  Grade,
  Message,
  Appeal,
  CallHistory,
  ApiConfig,
  AnalysisRecord,
  AnalysisTemplate
};

export default {
  User,
  Student,
  Teacher,
  Course,
  Grade,
  Message,
  Appeal,
  CallHistory,
  ApiConfig,
  AnalysisRecord,
  AnalysisTemplate
};
