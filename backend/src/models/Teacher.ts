import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface TeacherAttributes {
  id: string;
  user_id: string;
  teacher_id: string;
  name: string;
  gender?: string;
  department?: string;
  title?: string;
  phone?: string;
  research_area?: string;
  education?: string;
  years_of_service?: number;
  created_at: Date;
  updated_at: Date;
}

export interface TeacherCreationAttributes extends Optional<TeacherAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Teacher extends Model<TeacherAttributes, TeacherCreationAttributes> implements TeacherAttributes {
  public id!: string;
  public user_id!: string;
  public teacher_id!: string;
  public name!: string;
  public gender?: string;
  public department?: string;
  public title?: string;
  public phone?: string;
  public research_area?: string;
  public education?: string;
  public years_of_service?: number;
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly user!: User;
  public readonly courses?: import('./Course').Course[];
}

Teacher.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: User,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    teacher_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9]{11}$/
      }
    },
    research_area: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    education: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    years_of_service: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      onUpdate: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: 'teachers',
    timestamps: false,
    underscored: true,
    indexes: [
      { unique: true, fields: ['user_id'] },
      { unique: true, fields: ['teacher_id'] },
      { fields: ['department'] },
      { fields: ['title'] }
    ]
  }
);

// 关联
User.hasOne(Teacher, { foreignKey: 'user_id', as: 'teacher' });
Teacher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Teacher;
