import { combineResolvers } from 'graphql-resolvers'

import {
  getTasksByUserId,
  getTaskById
} from './queries.js'
import {
  auth,
  createUser,
  updateUser,
  createTask,
  updateTask,
  removeTask
} from './mutations.js'
import { isAuthenticated } from './middlewares.js'

export const resolvers = {
  Query: {
    getTaskById: combineResolvers(isAuthenticated, getTaskById),
    getTasksByUserId: combineResolvers(isAuthenticated, getTasksByUserId)
  },
  Mutation: {
    auth,
    createUser,
    updateUser: combineResolvers(isAuthenticated, updateUser),
    createTask: combineResolvers(isAuthenticated, createTask),
    updateTask: combineResolvers(isAuthenticated, updateTask),
    removeTask: combineResolvers(isAuthenticated, removeTask)
  }
}
