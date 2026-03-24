"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Student = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class Student extends sequelize_1.Model {
}
exports.Student = Student;
Student.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: User_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    student_id: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    gender: {
        type: sequelize_1.DataTypes.ENUM('male', 'female', 'other'),
        allowNull: true
    },
    date_of_birth: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    college: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    major: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: /^[0-9]{11}$/
        }
    },
    home_address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    admission_date: {
        type: sequelize_1.DataTypes.DATE,
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
    tableName: 'students',
    timestamps: false,
    underscored: true,
    indexes: [
        { unique: true, fields: ['user_id'] },
        { unique: true, fields: ['student_id'] },
        { fields: ['college'] },
        { fields: ['major'] },
        { fields: ['status'] }
    ]
});
// 关联
User_1.default.hasOne(Student, { foreignKey: 'user_id', as: 'student' });
Student.belongsTo(User_1.default, { foreignKey: 'user_id', as: 'user' });
exports.default = Student;
