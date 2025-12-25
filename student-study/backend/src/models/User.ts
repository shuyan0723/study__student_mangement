import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';
import type { IUser } from '../types/index.js';

interface UserCreationAttributes extends Optional<IUser, 'id' | 'created_at' | 'updated_at'> {}

class User extends Model<IUser, UserCreationAttributes> implements IUser {
  public id!: string;
  public username!: string;
  public password_hash!: string;
  public email?: string;
  public avatar_url?: string;
  public role!: 'student' | 'teacher' | 'admin';
  public status!: 'active' | 'inactive' | 'locked';
  public last_login?: Date;
  public login_attempts!: number;
  public locked_until?: Date;
  public created_at!: Date;
  public updated_at!: Date;
  public deleted_at?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.CHAR(36),
      primaryKey: true,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    avatar_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('student', 'teacher', 'admin'),
      allowNull: false,
      defaultValue: 'student'
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'locked'),
      allowNull: false,
      defaultValue: 'active'
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    locked_until: {
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
      defaultValue: DataTypes.NOW
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
    indexes: [
      { fields: ['username'] },
      { fields: ['email'] },
      { fields: ['role'] }
    ]
  }
);

export default User;
