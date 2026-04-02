"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiConfig = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class ApiConfig extends sequelize_1.Model {
}
exports.ApiConfig = ApiConfig;
ApiConfig.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    provider: {
        type: sequelize_1.DataTypes.ENUM('kimi', 'openai', 'custom'),
        allowNull: false,
        defaultValue: 'kimi'
    },
    apiEndpoint: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false
    },
    apiKey: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        comment: 'AES-256加密存储'
    },
    model: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
        defaultValue: 'moonshot-v1-8k'
    },
    isActive: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    dailyLimitPerTeacher: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
        comment: '单教师单日调用上限'
    },
    monthlyLimitPerTeacher: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
        comment: '单教师单月调用上限'
    },
    createdBy: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    tableName: 'api_configs',
    timestamps: false,
    underscored: true
});
exports.default = ApiConfig;
