"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Teacher_1 = __importDefault(require("./Teacher"));
class Course extends sequelize_1.Model {
}
exports.Course = Course;
Course.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    course_id: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    course_name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    credits: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: false,
        validate: {
            min: 0.5,
            max: 10
        }
    },
    hours: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 16,
            max: 200
        }
    },
    semester: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    category: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true
    },
    teacher_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: Teacher_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    capacity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 10,
            max: 200
        }
    },
    enrolled_count: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    assessment_method: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'active'
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
    tableName: 'courses',
    timestamps: false,
    underscored: true,
    indexes: [
        { unique: true, fields: ['course_id'] },
        { fields: ['teacher_id'] },
        { fields: ['semester'] },
        { fields: ['category'] },
        { fields: ['status'] }
    ]
});
// 关联
Teacher_1.default.hasMany(Course, { foreignKey: 'teacher_id', as: 'courses' });
Course.belongsTo(Teacher_1.default, { foreignKey: 'teacher_id', as: 'teacher' });
exports.default = Course;
