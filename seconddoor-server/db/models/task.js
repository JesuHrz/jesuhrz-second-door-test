import sql from 'sequelize'
import setupDatabase from '../lib/index.js'

const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}

export function setupTaskModel (config) {
  const sequelize = setupDatabase(config)
  const { User } = sequelize.models

  const Task = sequelize.define('Task', {
    id: {
      type: sql.DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    title: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name field must not be empty'
        }
      }
    },
    description: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The description field must not be empty'
        }
      }
    },
    status: {
      type: sql.DataTypes.ENUM({
        values: Object.values(STATUS)
      }),
      allowNull: false,
      defaultValue: STATUS.NOT_STARTED,
      validate: {
        notNull: {
          msg: 'The status field must not be empty'
        }
      }
    },
    userId: {
      type: sql.DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
        deferrable: sql.Deferrable.INITIALLY_IMMEDIATE
      },
      validate: {
        isInt: {
          args: true,
          msg: 'The identification field must be number'
        }
      }
    }
  }, {
    sequelize,
    timestamps: true
  })

  return Task
}
