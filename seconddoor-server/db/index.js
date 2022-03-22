import defaults from 'defaults'

import setupDatabase, { setupUser, setupTask } from './lib/index.js'
import {
  setupUserModel,
  setupTaskModel
} from './models/index.js'

export default async function db (config) {
  config = defaults(config, {})

  const instances = setupDatabase(config)
  const UserModel = setupUserModel(config)
  const TaskModel = setupTaskModel(config)

  const User = setupUser(UserModel)
  const Task = setupTask(TaskModel, UserModel)

  // A User has many Tasks
  UserModel.hasMany(TaskModel, { foreignKey: 'userId' })
  TaskModel.belongsTo(UserModel, { foreignKey: 'userId' })

  await instances.authenticate()

  if (config.setup) {
    await instances.sync({ force: true })
  }

  return {
    instances,
    User,
    Task
  }
}
