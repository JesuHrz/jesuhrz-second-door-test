import sql from 'sequelize'
import setupDatabase, { hashPassword } from '../lib/index.js'

export function setupUserModel (config) {
  const sequelize = setupDatabase(config)

  const User = sequelize.define('User', {
    id: {
      type: sql.DataTypes.INTEGER,
      autoIncrement: true,
      unique: true,
      primaryKey: true
    },
    name: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name field must not be empty'
        }
      }
    },
    lastName: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The lastname field must not be empty'
        }
      }
    },
    email: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Invalid Email'
        },
        notNull: {
          msg: 'The email field must not be empty'
        }
      }
    },
    password: {
      type: sql.DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The password field must not be empty'
        }
      }
    }
  }, {
    sequelize,
    hooks: {
      beforeCreate: async (record) => {
        record.password = await hashPassword(record.password)
      },
      beforeUpdate: async (record) => {
        record.password = await hashPassword(record.password)
      }
    },
    timestamps: true
  })

  return User
}
