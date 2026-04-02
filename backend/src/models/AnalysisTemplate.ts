import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AnalysisTemplateAttributes {
  id: string;
  templateName: string;
  description?: string;
  analysisDimensions: string; // JSON数组
  defaultPrompt?: string;
  isGlobal: boolean;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalysisTemplateCreationAttributes extends Optional<AnalysisTemplateAttributes, 'id' | 'createdAt' | 'updatedAt' | 'description' | 'defaultPrompt' | 'createdBy'> {}

export class AnalysisTemplate extends Model<AnalysisTemplateAttributes, AnalysisTemplateCreationAttributes> implements AnalysisTemplateAttributes {
  public id!: string;
  public templateName!: string;
  public description?: string;
  public analysisDimensions!: string;
  public defaultPrompt?: string;
  public isGlobal!: boolean;
  public createdBy?: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

AnalysisTemplate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    templateName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    analysisDimensions: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'JSON数组：["分数分布", "知识点薄弱项"]'
    },
    defaultPrompt: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: '是否为全局模板（管理员创建）'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'analysis_templates',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['is_global'] },
      { fields: ['created_by'] }
    ]
  }
);

export default AnalysisTemplate;
