import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Student from './Student';
import Course from './Course';
import User from './User';

interface AppealAttributes {
  id: string;
  student_id: string;
  course_id: string;
  original_score?: number;
  appeal_reason: string;
  attachments?: any;
  status: string;
  reviewed_by?: string;
  review_feedback?: string;
  new_score?: number;
  appeal_time: Date;
  reviewed_time?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface AppealCreationAttributes extends Optional<AppealAttributes, 'id' | 'created_at' | 'updated_at' | 'reviewed_time'> {}

export class Appeal extends Model<AppealAttributes, AppealCreationAttributes> implements AppealAttributes {
  public id!: string;
  public student_id!: string;
  public course_id!: string;
  public original_score?: number;
  public appeal_reason!: string;
  public attachments?: any;
  public status!: string;
  public reviewed_by?: string;
  public review_feedback?: string;
  public new_score?: number;
  public appeal_time!: Date;
  public reviewed_time?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly student!: Student;
  public readonly course!: Course;
  public readonly reviewer?: User;
}

Appeal.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    course_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Course,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    original_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    appeal_reason: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [10, 2000]
      }
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'reviewing', 'approved', 'rejected', 'closed']]
      }
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: User,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    review_feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    new_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    appeal_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    reviewed_time: {
      type: DataTypes.DATE,
      allowNull: true
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
  }
);

// 关联
Student.hasMany(Appeal, { foreignKey: 'student_id', as: 'appeals' });
Course.hasMany(Appeal, { foreignKey: 'course_id', as: 'appeals' });
User.hasMany(Appeal, { foreignKey: 'reviewed_by', as: 'reviewed_appeals' });
Appeal.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Appeal.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });
Appeal.belongsTo(User, { foreignKey: 'reviewed_by', as: 'reviewer' });

export default Appeal;
