"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisTemplate = exports.AnalysisRecord = exports.ApiConfig = exports.CallHistory = exports.Appeal = exports.Message = exports.Grade = exports.Course = exports.Teacher = exports.Student = exports.User = void 0;
// Import all models
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Student_1 = __importDefault(require("./Student"));
exports.Student = Student_1.default;
const Teacher_1 = __importDefault(require("./Teacher"));
exports.Teacher = Teacher_1.default;
const Course_1 = __importDefault(require("./Course"));
exports.Course = Course_1.default;
const Grade_1 = __importDefault(require("./Grade"));
exports.Grade = Grade_1.default;
const Message_1 = __importDefault(require("./Message"));
exports.Message = Message_1.default;
const Appeal_1 = __importDefault(require("./Appeal"));
exports.Appeal = Appeal_1.default;
const CallHistory_1 = __importDefault(require("./CallHistory"));
exports.CallHistory = CallHistory_1.default;
const ApiConfig_1 = __importDefault(require("./ApiConfig"));
exports.ApiConfig = ApiConfig_1.default;
const AnalysisRecord_1 = __importDefault(require("./AnalysisRecord"));
exports.AnalysisRecord = AnalysisRecord_1.default;
const AnalysisTemplate_1 = __importDefault(require("./AnalysisTemplate"));
exports.AnalysisTemplate = AnalysisTemplate_1.default;
// 确保所有模型都被加载（Sequelize 需要这样来识别模型）
// 这些导入会触发模型的 init() 方法，使 Sequelize 能够同步表结构
User_1.default;
Student_1.default;
Teacher_1.default;
Course_1.default;
Grade_1.default;
Message_1.default;
Appeal_1.default;
CallHistory_1.default;
ApiConfig_1.default;
AnalysisRecord_1.default;
AnalysisTemplate_1.default;
exports.default = {
    User: User_1.default,
    Student: Student_1.default,
    Teacher: Teacher_1.default,
    Course: Course_1.default,
    Grade: Grade_1.default,
    Message: Message_1.default,
    Appeal: Appeal_1.default,
    CallHistory: CallHistory_1.default,
    ApiConfig: ApiConfig_1.default,
    AnalysisRecord: AnalysisRecord_1.default,
    AnalysisTemplate: AnalysisTemplate_1.default
};
