import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface StudentAttributes {
  id: string;
  user_id: string;
  student_id: string;
  name: string;
  gender?: string;
  date_of_birth?: Date;
  college?: string;
  major?: string;
  phone?: string;
  home_address?: string;
  admission_date?: Date;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface StudentCreationAttributes extends Optional<StudentAttributes, 'id' | 'created_at' | 'updated_at'> {}

export class Student extends Model<StudentAttributes, StudentCreationAttributes> implements StudentAttributes {
  public id!: string;
  public user_id!: string;
  public student_id!: string;
  public name!: string;
  public gender?: string;
  public date_of_birth?: Date;
  public college?: string;
  public major?: string;
  public phone?: string;
  public home_address?: string;
  public admission_date?: Date;
  public status!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly user!: User;
  public readonly grades?: import('./Grade').Grade[];
  public readonly appeals?: import('./Appeal').Appeal[];
}

Student.init(
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
    student_id: {
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
    date_of_birth: {
      type: DataTypes.DATE,
      allowNull: true
    },
    college: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    major: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        is: /^[0-9]{11}$/
      }
    },
    home_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    admission_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'active'
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
  }
);

// 关联
User.hasOne(Student, { foreignKey: 'user_id', as: 'student' });
Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export default Student;
