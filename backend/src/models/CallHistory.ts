import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

interface CallHistoryAttributes {
  id: string;
  caller_id: string;
  callee_id: string;
  start_time: Date;
  end_time?: Date;
  duration?: number; // in seconds
  call_status: 'initiated' | 'connected' | 'ended' | 'rejected' | 'failed';
  end_reason?: 'user_hangup' | 'timeout' | 'network_error' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

export interface CallHistoryCreationAttributes extends Optional<CallHistoryAttributes, 'id' | 'created_at' | 'updated_at' | 'end_time' | 'duration' | 'end_reason'> {}

export class CallHistory extends Model<CallHistoryAttributes, CallHistoryCreationAttributes> implements CallHistoryAttributes {
  public id!: string;
  public caller_id!: string;
  public callee_id!: string;
  public start_time!: Date;
  public end_time?: Date;
  public duration?: number;
  public call_status!: 'initiated' | 'connected' | 'ended' | 'rejected' | 'failed';
  public end_reason?: 'user_hangup' | 'timeout' | 'network_error' | 'rejected';
  public created_at!: Date;
  public updated_at!: Date;

  // 关联
  public readonly caller!: User;
  public readonly callee!: User;
}

CallHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    caller_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    callee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Call duration in seconds'
    },
    call_status: {
      type: DataTypes.ENUM('initiated', 'connected', 'ended', 'rejected', 'failed'),
      allowNull: false,
      defaultValue: 'initiated'
    },
    end_reason: {
      type: DataTypes.ENUM('user_hangup', 'timeout', 'network_error', 'rejected'),
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
    tableName: 'call_history',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['caller_id'] },
      { fields: ['callee_id'] },
      { fields: ['call_status'] },
      { fields: ['start_time'] }
    ]
  }
);

// 关联
User.hasMany(CallHistory, { foreignKey: 'caller_id', as: 'made_calls' });
User.hasMany(CallHistory, { foreignKey: 'callee_id', as: 'received_calls' });
CallHistory.belongsTo(User, { foreignKey: 'caller_id', as: 'caller' });
CallHistory.belongsTo(User, { foreignKey: 'callee_id', as: 'callee' });

export default CallHistory;
