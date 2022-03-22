import request from 'supertest'

import startApolloServer from '../server.js'
import db from '../db/index.js'
import config from '../config/index.js'
import {
  successAuthQuery,
  successfulCreatedTask,
  successfulUpdatedTaskByStatus,
  getTaskById,
  getTasksByUserId,
  removeTaskById
} from './utils/helpers.js'
import { user, task } from './utils/mocks.js'

describe('Task', () => {
  let server, url, User, Task, draftUser, draftTask

  beforeAll(async () => {
    try {
      ({ server, url } = await startApolloServer())
      ;({ User, Task } = await db(config.db))
      await User.create(user)

      const query = Object.assign({}, successAuthQuery)
      query.variables = {
        email: user.email,
        password: user.password
      }

      const response = await request(url)
        .post('/')
        .send(query)

      const { data } = response.body

      draftUser = data.auth
    } catch (error) {
      console.log('Task error', error)
    }
  })

  afterAll(async () => {
    await User.deleteBy({ id: draftUser.user.id })
    await Task.deleteBy({ id: draftTask.id })
    await server.close()
  })

  it('Retrieves tasks by user id: 0', async () => {
    const query = Object.assign({}, getTasksByUserId)

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body

    expect(errors).toBeUndefined()
    expect(data.getTasksByUserId.notStarted).toBeDefined()
    expect(data.getTasksByUserId.inProgress).toBeDefined()
    expect(data.getTasksByUserId.completed).toBeDefined()
    expect(data.getTasksByUserId.notStarted.length).toBeGreaterThanOrEqual(0)
    expect(data.getTasksByUserId.inProgress.length).toBeGreaterThanOrEqual(0)
    expect(data.getTasksByUserId.completed.length).toBeGreaterThanOrEqual(0)
  })

  it('Creates task without authorization', async () => {
    const query = Object.assign({}, successfulCreatedTask)
    query.variables = {
      input: { ...task }
    }

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Unauthorized')
  })

  it('Successful created task', async () => {
    const query = Object.assign({}, successfulCreatedTask)
    query.variables = {
      input: { ...task }
    }

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body

    draftTask = data.createTask

    expect(errors).toBeUndefined()
    expect(data.createTask).toBeDefined()
    expect(data.createTask.createdAt).toBeDefined()
    expect(data.createTask.userId).toEqual(draftUser.user.id.toString())
    expect(data.createTask.title).toEqual(query.variables.input.title)
    expect(data.createTask.description).toEqual(query.variables.input.description)
    expect(data.createTask.status).toEqual('NOT_STARTED')
  })

  it('Sends missing params: input', async () => {
    const query = Object.assign({}, successfulCreatedTask)
    query.variables = {
      userId: draftUser.id
    }

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors.length).toEqual(1)
  })

  it('Updates task with invalid id', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = 123123
    query.variables.input.status = 'IN_PROGRESS'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body
    expect(errors).toBeDefined()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toBe('Task is not found.')
  })

  it('Updates task by status: IN_PROGRESS', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.status = 'IN_PROGRESS'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body
    expect(errors).toBeUndefined()
    expect(data.updateTask).toBeDefined()
    expect(data.updateTask.id).toEqual(draftTask.id.toString())
    expect(data.updateTask.status).toEqual(query.variables.input.status)
  })

  it('Updates task by status: NOT_STARTED', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.status = 'NOT_STARTED'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body
    expect(errors).toBeUndefined()
    expect(data.updateTask).toBeDefined()
    expect(data.updateTask.id).toEqual(draftTask.id.toString())
    expect(data.updateTask.status).toEqual(query.variables.input.status)
  })

  it('Updates task by status: COMPLETED', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.status = 'COMPLETED'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body
    expect(errors).toBeUndefined()
    expect(data.updateTask).toBeDefined()
    expect(data.updateTask.id).toEqual(draftTask.id.toString())
    expect(data.updateTask.status).toEqual(query.variables.input.status)
  })

  it('Updates task title without authorization', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.title = 'This is a new title'

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Unauthorized')
  })

  it('Updates task title', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.title = 'This is a new title'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body
    expect(errors).toBeUndefined()
    expect(data.updateTask).toBeDefined()
    expect(data.updateTask.id).toEqual(draftTask.id.toString())
    expect(data.updateTask.title).toEqual(query.variables.input.title)
  })

  it('Updates task description', async () => {
    const query = Object.assign({}, successfulUpdatedTaskByStatus)
    query.variables.id = draftTask.id
    query.variables.input.description = 'This is a new description'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body
    expect(errors).toBeUndefined()
    expect(data.updateTask).toBeDefined()
    expect(data.updateTask.id).toEqual(draftTask.id.toString())
    expect(data.updateTask.description).toEqual(query.variables.input.description)
  })

  it('Retrieves task by user id and task id without authorization', async () => {
    const query = Object.assign({}, getTaskById)
    query.variables.id = draftTask.id

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Unauthorized')
  })

  it('Retrieves task by user id and task id', async () => {
    const query = Object.assign({}, getTaskById)
    query.variables.id = draftTask.id

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body

    expect(errors).toBeUndefined()
    expect(data.getTaskById).toBeDefined()
    expect(data.getTaskById.id).toEqual(draftTask.id.toString())
    expect(Object.keys(data.getTaskById)).toEqual(['id', 'title', 'description', 'status', 'createdAt'])
  })

  it('Retrieves all task by user id', async () => {
    const query = Object.assign({}, getTasksByUserId)

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body

    expect(errors).toBeUndefined()
    expect(data.getTasksByUserId.notStarted).toBeDefined()
    expect(data.getTasksByUserId.inProgress).toBeDefined()
    expect(data.getTasksByUserId.completed).toBeDefined()
    expect(data.getTasksByUserId.notStarted.length).toBeGreaterThanOrEqual(0)
    expect(data.getTasksByUserId.inProgress.length).toBeGreaterThanOrEqual(0)
    expect(data.getTasksByUserId.completed.length).toBeGreaterThanOrEqual(0)
  })

  it('Retrieves all task by user id without authorization', async () => {
    const query = Object.assign({}, getTasksByUserId)

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Unauthorized')
  })

  it('Retrieves task with invalid id', async () => {
    const query = Object.assign({}, getTaskById)
    query.variables.id = 99999

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Task not found')
  })

  it('Removes task by Id without authorization', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables.id = draftTask.id

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('Unauthorized')
  })

  it('Removes task by Id', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables.id = draftTask.id

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data, errors } = response.body

    expect(errors).toBeUndefined()
    expect(data.removeTask.id).toEqual(draftTask.id.toString())
  })

  it('Removes task with invalid id', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables.id = 99999

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body
    expect(errors).toBeDefined()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toBe('Task is not found.')
  })
})
