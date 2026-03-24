"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appeal = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const Student_1 = __importDefault(require("./Student"));
const Course_1 = __importDefault(require("./Course"));
const User_1 = __importDefault(require("./User"));
class Appeal extends sequelize_1.Model {
}
exports.Appeal = Appeal;
Appeal.init({
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
    original_score: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    appeal_reason: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 2000]
        }
    },
    attachments: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true
    },
    status: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'reviewing', 'approved', 'rejected', 'closed']]
        }
    },
    reviewed_by: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: User_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },
    review_feedback: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    new_score: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
            min: 0,
            max: 100
        }
    },
    appeal_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    reviewed_time: {
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
    tableName: 'appeals',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['student_id'] },
        { fields: ['course_id'] },
        { fields: ['status'] },
        { fields: ['appeal_time'] },
        { fields: ['reviewed_by'] }
    ]
});
// 关联
Student_1.default.hasMany(Appeal, { foreignKey: 'student_id', as: 'appeals' });
Course_1.default.hasMany(Appeal, { foreignKey: 'course_id', as: 'appeals' });
User_1.default.hasMany(Appeal, { foreignKey: 'reviewed_by', as: 'reviewed_appeals' });
Appeal.belongsTo(Student_1.default, { foreignKey: 'student_id', as: 'student' });
Appeal.belongsTo(Course_1.default, { foreignKey: 'course_id', as: 'course' });
Appeal.belongsTo(User_1.default, { foreignKey: 'reviewed_by', as: 'reviewer' });
exports.default = Appeal;
