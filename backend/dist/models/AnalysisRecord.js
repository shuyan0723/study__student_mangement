"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisRecord = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class AnalysisRecord extends sequelize_1.Model {
}
exports.AnalysisRecord = AnalysisRecord;
AnalysisRecord.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    teacherId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    teacherName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    courseIds: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: 'JSON数组：["course1", "course2"]'
    },
    courseNames: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: 'JSON数组：["课程1", "课程2"]'
    },
    examType: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        comment: '考试类型：月考/期中/期末等'
    },
    analysisDimensions: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: 'JSON数组：["分数分布", "知识点薄弱项"]'
    },
    customInstruction: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'analyzing', 'completed', 'failed', 'deleted'),
        allowNull: false,
        defaultValue: 'pending'
    },
    analysisResult: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        comment: 'JSON格式的分析报告'
    },
    errorMessage: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    tokensUsed: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true
    },
    estimatedCost: {
        type: sequelize_1.DataTypes.DECIMAL(10, 4),
        allowNull: true
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        onUpdate: sequelize_1.DataTypes.NOW
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    }
}, {
    sequelize: database_1.default,
    tableName: 'analysis_records',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['teacher_id'] },
        { fields: ['status'] },
        { fields: ['created_at'] },
        { fields: ['deleted_at'] }
    ]
});
exports.default = AnalysisRecord;
