import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface AnalysisRecordAttributes {
  id: string;
  teacherId: string;
  teacherName: string;
  courseIds: string; // JSON数组字符串
  courseNames: string; // JSON数组字符串
  examType?: string;
  analysisDimensions: string; // JSON数组字符串
  customInstruction?: string;
  status: 'pending' | 'analyzing' | 'completed' | 'failed' | 'deleted';
  analysisResult?: string; // JSON格式的分析报告
  errorMessage?: string;
  tokensUsed?: number;
  estimatedCost?: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface AnalysisRecordCreationAttributes extends Optional<AnalysisRecordAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'errorMessage' | 'tokensUsed' | 'estimatedCost'> {}

export class AnalysisRecord extends Model<AnalysisRecordAttributes, AnalysisRecordCreationAttributes> implements AnalysisRecordAttributes {
  public id!: string;
  public teacherId!: string;
  public teacherName!: string;
  public courseIds!: string;
  public courseNames!: string;
  public examType?: string;
  public analysisDimensions!: string;
  public customInstruction?: string;
  public status!: 'pending' | 'analyzing' | 'completed' | 'failed' | 'deleted';
  public analysisResult?: string;
  public errorMessage?: string;
  public tokensUsed?: number;
  public estimatedCost?: number;
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
}

AnalysisRecord.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    teacherId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    teacherName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    courseIds: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'JSON数组：["course1", "course2"]'
    },
    courseNames: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'JSON数组：["课程1", "课程2"]'
    },
    examType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: '考试类型：月考/期中/期末等'
    },
    analysisDimensions: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: 'JSON数组：["分数分布", "知识点薄弱项"]'
    },
    customInstruction: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'analyzing', 'completed', 'failed', 'deleted'),
      allowNull: false,
      defaultValue: 'pending'
    },
    analysisResult: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'JSON格式的分析报告'
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tokensUsed: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estimatedCost: {
      type: DataTypes.DECIMAL(10, 4),
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
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'analysis_records',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['teacher_id'] },
      { fields: ['status'] },
      { fields: ['created_at'] },
      { fields: ['deleted_at'] }
    ]
  }
);

export default AnalysisRecord;
