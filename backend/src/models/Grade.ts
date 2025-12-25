import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Student from './Student';
import Course from './Course';

interface GradeAttributes {
  id: string;
  student_id: string;
  course_id: string;
  score?: number;
  grade_level?: string;
  feedback?: string;
  submission_status: string;
  submitted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface GradeCreationAttributes extends Optional<GradeAttributes, 'id' | 'created_at' | 'updated_at' | 'submitted_at'> {}

export class Grade extends Model<GradeAttributes, GradeCreationAttributes> implements GradeAttributes {
  public id!: string;
  public student_id!: string;
  public course_id!: string;
  public score?: number;
  public grade_level?: string;
  public feedback?: string;
  public submission_status!: string;
  public submitted_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly student!: Student;
  public readonly course!: Course;
  public readonly appeals?: import('./Appeal').Appeal[];
}

Grade.init(
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
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 100
      }
    },
    grade_level: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        isIn: [['A', 'B', 'C', 'D', 'E', 'F', 'P', 'NP']]
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    submission_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'submitted', 'graded', 'revised']]
      }
    },
    submitted_at: {
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
    tableName: 'grades',
    timestamps: false,
    underscored: true,
    indexes: [
      { unique: true, fields: ['student_id', 'course_id'] },
      { fields: ['student_id'] },
      { fields: ['course_id'] },
      { fields: ['submission_status'] }
    ]
  }
);

// 关联
Student.hasMany(Grade, { foreignKey: 'student_id', as: 'grades' });
Course.hasMany(Grade, { foreignKey: 'course_id', as: 'grades' });
Grade.belongsTo(Student, { foreignKey: 'student_id', as: 'student' });
Grade.belongsTo(Course, { foreignKey: 'course_id', as: 'course' });

export default Grade;
