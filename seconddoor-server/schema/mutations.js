import {
  AuthenticationError,
  UserInputError
} from 'apollo-server-express'

import { generateToken, comparePassword } from '../utils/index.js'

export const auth = async (_, args, { db }) => {
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
}

export const createUser = async (_, args, { db }) => {
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
}

export const updateUser = async (_, args, { db, user }) => {
  const { User } = db
  const existingUser = await User.findById(user.id)

  if (!existingUser) {
    throw new UserInputError('User is not found.')
  }

  const updatedUsed = await User.update({ id: user.id, ...args.input })

  return updatedUsed ? User.findById(user.id) : existingUser
}

export const createTask = async (_, args, { db, user }) => {
  const { Task, User } = db
  const existingUser = await User.findById(user.id)

  if (!existingUser) {
    throw new UserInputError('User is not found.')
  }

  const newTask = await Task.create({ userId: user.id, ...args.input })

  return newTask
}

export const updateTask = async (_, args, { db, user }) => {
  const { Task, User } = db
  const existingUser = await User.findById(user.id)

  if (!existingUser) {
    throw new UserInputError('User is not found.')
  }

  const existingTask = await Task.findById(args.id)

  if (!existingTask) {
    throw new UserInputError('Task is not found.')
  }

  const updatedTask = await Task.update({ userId: user.id, id: args.id, ...args.input })

  return updatedTask ? Task.findById(args.id) : existingTask
}

export const removeTask = async (_, args, { db, user }) => {
  const { Task, User } = db
  const existingUser = await User.findById(user.id)

  if (!existingUser) {
    throw new UserInputError('User is not found.')
  }

  const existingTask = await Task.findById(args.id)

  if (!existingTask) {
    throw new UserInputError('Task is not found.')
  }

  await Task.deleteBy({ userId: user.id, id: args.id })

  return existingTask
}
