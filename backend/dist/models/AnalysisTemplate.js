"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisTemplate = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class AnalysisTemplate extends sequelize_1.Model {
}
exports.AnalysisTemplate = AnalysisTemplate;
AnalysisTemplate.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    templateName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false
    },
    description: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    analysisDimensions: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
        comment: 'JSON数组：["分数分布", "知识点薄弱项"]'
    },
    defaultPrompt: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true
    },
    isGlobal: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: '是否为全局模板（管理员创建）'
    },
    createdBy: {
        type: sequelize_1.DataTypes.UUID,
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
    }
}, {
    sequelize: database_1.default,
    tableName: 'analysis_templates',
    timestamps: false,
    underscored: true,
    indexes: [
        { fields: ['is_global'] },
        { fields: ['created_by'] }
    ]
});
exports.default = AnalysisTemplate;
