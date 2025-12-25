import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import Teacher from './Teacher';

interface CourseAttributes {
  id: string;
  course_id: string;
  course_name: string;
  credits: number;
  hours: number;
  semester?: string;
  category?: string;
  teacher_id?: string;
  description?: string;
  capacity: number;
  enrolled_count: number;
  assessment_method?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'created_at' | 'updated_at' | 'enrolled_count'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public course_id!: string;
  public course_name!: string;
  public credits!: number;
  public hours!: number;
  public semester?: string;
  public category?: string;
  public teacher_id?: string;
  public description?: string;
  public capacity!: number;
  public enrolled_count!: number;
  public assessment_method?: string;
  public status!: string;
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly teacher?: Teacher;
  public readonly grades?: import('./Grade').Grade[];
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    course_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    course_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    credits: {
      type: DataTypes.DECIMAL(3, 1),
      allowNull: false,
      validate: {
        min: 0.5,
        max: 10
      }
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 16,
        max: 200
      }
    },
    semester: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    teacher_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Teacher,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 10,
        max: 200
      }
    },
    enrolled_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    assessment_method: {
      type: DataTypes.STRING(255),
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
    tableName: 'courses',
    timestamps: false,
    underscored: true,
    indexes: [
      { unique: true, fields: ['course_id'] },
      { fields: ['teacher_id'] },
      { fields: ['semester'] },
      { fields: ['category'] },
      { fields: ['status'] }
    ]
  }
);

// 关联
Teacher.hasMany(Course, { foreignKey: 'teacher_id', as: 'courses' });
Course.belongsTo(Teacher, { foreignKey: 'teacher_id', as: 'teacher' });

export default Course;
