import request from 'supertest'

import startApolloServer from '../server.js'
import db from '../db/index.js'
import config from '../config/index.js'
import {
  successAuthQuery,
  successfulCreatedTask,
  successfulUpdatedTask,
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

  it('Create task with invalid token', async () => {
    const query = Object.assign({}, successfulCreatedTask)
    query.variables = {
      input: { ...task }
    }

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAwMCwibmFtZSI6Ikpob24iLCJsYXN0TmFtZSI6Ikhlcm5hbmRleiIsImVtYWlsIjoiamVzdXNAdGVzdC5jb20iLCJwYXNzd29yZCI6IiQyYiQwNSRBNHY3eUVXeHczYmNpbVlFVHZSUlIuOThEUWRJOERxdHNVcGZvVjVOa1ZLOTJhMHdRMEY2VyIsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjFUMTU6MzA6MDMuMjI3WiIsImlhdCI6MTY0ODA2MjI3NX0.EyJM7WGBcNHCTVJiPXwyFR_UfIiZUosGfHKB3ZGm_BY'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('User is not found.')
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
    const query = Object.assign({}, successfulUpdatedTask)
    query.variables = {
      id: 123123,
      input: {
        status: 'IN_PROGRESS'
      }
    }

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

  it('Updates task', async () => {
    const query = Object.assign({}, successfulUpdatedTask)
    query.variables = {
      id: draftTask.id,
      input: {
        status: 'IN_PROGRESS',
        title: 'This is a new title',
        description: 'This is a new description'
      }
    }

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
    expect(data.updateTask.title).toEqual(query.variables.input.title)
    expect(data.updateTask.description).toEqual(query.variables.input.description)
  })

  it('Updates task with invalid status', async () => {
    const query = Object.assign({}, successfulUpdatedTask)
    query.variables = {
      id: draftTask.id,
      input: {
        status: 'INVALID_STATUS'
      }
    }

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${draftUser.jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body
    expect(errors).toBeDefined()
    expect(errors[0].message).toMatch(/enum_Tasks_status/)
  })

  it('Updates task without authorization', async () => {
    const query = Object.assign({}, successfulUpdatedTask)
    query.variables = {
      id: draftTask.id,
      input: { ...task }
    }
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

  it('Update task with invalid token', async () => {
    const query = Object.assign({}, successfulUpdatedTask)
    query.variables = {
      id: draftTask.id,
      input: { ...task }
    }

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAwMCwibmFtZSI6Ikpob24iLCJsYXN0TmFtZSI6Ikhlcm5hbmRleiIsImVtYWlsIjoiamVzdXNAdGVzdC5jb20iLCJwYXNzd29yZCI6IiQyYiQwNSRBNHY3eUVXeHczYmNpbVlFVHZSUlIuOThEUWRJOERxdHNVcGZvVjVOa1ZLOTJhMHdRMEY2VyIsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjFUMTU6MzA6MDMuMjI3WiIsImlhdCI6MTY0ODA2MjI3NX0.EyJM7WGBcNHCTVJiPXwyFR_UfIiZUosGfHKB3ZGm_BY'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors[0].message).toBe('User is not found.')
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

  it('Removes task by id without authorization', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables = {
      id: draftTask.id
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

  it('Removes task by Id', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables = {
      id: draftTask.id
    }

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
    query.variables = {
      id: 999999
    }

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

  it('Removes task with invalid token', async () => {
    const query = Object.assign({}, removeTaskById)
    query.variables = {
      id: draftTask.id
    }

    const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAwMDAwMCwibmFtZSI6Ikpob24iLCJsYXN0TmFtZSI6Ikhlcm5hbmRleiIsImVtYWlsIjoiamVzdXNAdGVzdC5jb20iLCJwYXNzd29yZCI6IiQyYiQwNSRBNHY3eUVXeHczYmNpbVlFVHZSUlIuOThEUWRJOERxdHNVcGZvVjVOa1ZLOTJhMHdRMEY2VyIsImNyZWF0ZWRBdCI6IjIwMjItMDMtMjFUMTU6MzA6MDMuMjI3WiIsImlhdCI6MTY0ODA2MjI3NX0.EyJM7WGBcNHCTVJiPXwyFR_UfIiZUosGfHKB3ZGm_BY'

    const response = await request(url)
      .post('/')
      .set({ Authorization: `Bearer ${jwt}` })
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body
    expect(errors).toBeDefined()
    expect(errors.length).toEqual(1)
    expect(errors[0].message).toBe('User is not found.')
  })
})
