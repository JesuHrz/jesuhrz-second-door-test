import { UserInputError } from 'apollo-server-express'

const STATUS = {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
}

export const getTasksByUserId = async (_, __, { db, user }) => {
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

export const getTaskById = async (_, args, { db, user }) => {
  const { Task } = db
  const task = await Task.findBy({ userId: user.id, id: args.id })

  if (!task) throw new UserInputError('Task not found')

  return task.toJSON()
}
