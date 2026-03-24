import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ApiConfigAttributes {
  id: string;
  provider: 'kimi' | 'openai' | 'custom';
  apiEndpoint: string;
  apiKey: string; // 加密存储
  model: string;
  isActive: boolean;
  dailyLimitPerTeacher: number;
  monthlyLimitPerTeacher: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiConfigCreationAttributes extends Optional<ApiConfigAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class ApiConfig extends Model<ApiConfigAttributes, ApiConfigCreationAttributes> implements ApiConfigAttributes {
  public id!: string;
  public provider!: 'kimi' | 'openai' | 'custom';
  public apiEndpoint!: string;
  public apiKey!: string;
  public model!: string;
  public isActive!: boolean;
  public dailyLimitPerTeacher!: number;
  public monthlyLimitPerTeacher!: number;
  public createdBy!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ApiConfig.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    provider: {
      type: DataTypes.ENUM('kimi', 'openai', 'custom'),
      allowNull: false,
      defaultValue: 'kimi'
    },
    apiEndpoint: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    apiKey: {
      type: DataTypes.STRING(500),
      allowNull: false,
      comment: 'AES-256加密存储'
    },
    model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'moonshot-v1-8k'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    dailyLimitPerTeacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10,
      comment: '单教师单日调用上限'
    },
    monthlyLimitPerTeacher: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
      comment: '单教师单月调用上限'
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: false
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
    }
  },
  {
    sequelize,
    tableName: 'api_configs',
    timestamps: false,
    underscored: true
  }
);

export default ApiConfig;
