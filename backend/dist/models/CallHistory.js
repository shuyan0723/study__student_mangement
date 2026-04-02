"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CallHistory = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
const User_1 = __importDefault(require("./User"));
class CallHistory extends sequelize_1.Model {
}
exports.CallHistory = CallHistory;
CallHistory.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    caller_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    callee_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User_1.default,
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    },
    start_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    end_time: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Call duration in seconds'
    },
    call_status: {
        type: sequelize_1.DataTypes.ENUM('initiated', 'connected', 'ended', 'rejected', 'failed'),
        allowNull: false,
        defaultValue: 'initiated'
    },
    end_reason: {
        type: sequelize_1.DataTypes.ENUM('user_hangup', 'timeout', 'network_error', 'rejected'),
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
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    tableName: 'call_history',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['caller_id'] },
        { fields: ['callee_id'] },
        { fields: ['call_status'] },
        { fields: ['start_time'] }
    ]
});
// 关联
User_1.default.hasMany(CallHistory, { foreignKey: 'caller_id', as: 'made_calls' });
User_1.default.hasMany(CallHistory, { foreignKey: 'callee_id', as: 'received_calls' });
CallHistory.belongsTo(User_1.default, { foreignKey: 'caller_id', as: 'caller' });
CallHistory.belongsTo(User_1.default, { foreignKey: 'callee_id', as: 'callee' });
exports.default = CallHistory;
