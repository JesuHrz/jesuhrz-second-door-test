import {
  AuthenticationError,
  UserInputError
} from 'apollo-server-express'

import { generateToken, comparePassword } from '../utils/index.js'

const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}

export const resolvers = {
  Query: {
    getTaskById: async (_, args, { db, user }) => {
      if (!user) throw new AuthenticationError('Unauthorized')

      const { Task } = db
      const task = await Task.findBy({ userId: user.id, id: args.id })

      if (!task) throw new UserInputError('Task not found')

      return task.toJSON()
    },
    getTasksByUserId: async (_, __, { db, user }) => {
      if (!user) throw new AuthenticationError('Unauthorized')

      const { Task } = db
      const tasks = await Task.findAllBy({ userId: user.id })

      const data = tasks.reduce((acc, cur) => {
        const task = cur.toJSON()
        if (task.status === STATUS.NOT_STARTED) {
          acc.notStarted.push(task)
        }

        if (task.status === STATUS.IN_PROGRESS) {
          acc.inProgress.push(task)
        }

        if (task.status === STATUS.COMPLETED) {
          acc.completed.push(task)
        }

        return acc
      }, {
        notStarted: [],
        inProgress: [],
        completed: []
      })

      return data
    }
  },
  Mutation: {
    auth: async (_, args, { db }) => {
      const { User } = db
      const user = await User.findBy({ email: args.email })
      const hashedPassword = user?.password || ''
      const isPasswordValid = await comparePassword(args.password, hashedPassword)

      if (!user || !isPasswordValid) {
        throw new AuthenticationError('Email or password is incorrect')
      }

      const jwt = await generateToken(user)

      return {
        jwt,
        user: user
      }
    },
    createUser: async (_, args, { db }) => {
      const { User } = db

      const existingUser = await User.findBy({ email: args.email })

      if (existingUser) {
        throw new UserInputError('Email already exists.')
      }

      const user = await User.create({ ...args })
      const parsedUser = user.toJSON()

      const jwt = await generateToken(parsedUser)

      return {
        jwt,
        user: parsedUser
      }
    },
    createTask: async (_, args, { db, user }) => {
      if (!user) throw new AuthenticationError('Unauthorized')

      const { Task } = db
      const newTask = await Task.create({ userId: user.id, ...args.input })

      return newTask
    },
    updateTask: async (_, args, { db, user }) => {
      if (!user) throw new AuthenticationError('Unauthorized')

      const { Task } = db
      const existingTask = await Task.findById(args.id)

      if (!existingTask) {
        throw new UserInputError('Task is not found.')
      }

      const updatedTask = await Task.update({ userId: user.id, id: args.id, ...args.input })

      return updatedTask ? Task.findById(args.id) : existingTask
    },
    removeTask: async (_, args, { db, user }) => {
      if (!user) throw new AuthenticationError('Unauthorized')

      const { Task } = db
      const existingTask = await Task.findById(args.id)

      if (!existingTask) {
        throw new UserInputError('Task is not found.')
      }

      await Task.deleteBy({ userId: user.id, id: args.id })

      return existingTask
    }
  }
}
