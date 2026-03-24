"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Grade = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Student_1 = __importDefault(require("./Student"));
const Course_1 = __importDefault(require("./Course"));
class Grade extends sequelize_1.Model {
}
exports.Grade = Grade;
Grade.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    student_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Student_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    course_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: Course_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    score: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    grade_level: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
        validate: {
            isIn: [['A', 'B', 'C', 'D', 'E', 'F', 'P', 'NP']]
        }
    },
    feedback: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    submission_status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'submitted', 'graded', 'revised']]
        }
    },
    submitted_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
        onUpdate: 'CURRENT_TIMESTAMP'
    }
}, {
    sequelize: database_1.default,
    tableName: 'grades',
    timestamps: false,
    underscored: true,
    indexes: [
        { unique: true, fields: ['student_id', 'course_id'] },
        { fields: ['student_id'] },
        { fields: ['course_id'] },
        { fields: ['submission_status'] }
    ]
});
// 关联
Student_1.default.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Course_1.default.hasMany(Grade, { foreignKey: 'course_id', as: 'grades' });
Grade.belongsTo(Student_1.default, { foreignKey: 'student_id', as: 'student' });
Grade.belongsTo(Course_1.default, { foreignKey: 'course_id', as: 'course' });
exports.default = Grade;
