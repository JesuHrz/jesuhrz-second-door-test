import request from 'supertest'
import startApolloServer from '../server.js'
import db from '../db/index.js'
import config from '../config/index.js'

import {
  successfulCreatedUser,
  InvalidCreatedUser,
  successfulUpdatedUser
} from './utils/helpers.js'

import { user } from './utils/mocks.js'

describe('User', () => {
  let server, url, draftUser

  beforeAll(async () => {
    ({ server, url } = await startApolloServer())
    const { User } = await db(config.db)
    await User.deleteBy({
      email: user.email
    })
  })

  afterAll(async () => {
    if (draftUser) {
      const { User } = await db(config.db)
      User.deleteBy({ id: draftUser.id })
    }

    await server.close()
  })

  it('Successful created user', async () => {
    const query = Object.assign({}, successfulCreatedUser)
    query.variables = { ...user }

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const newUser = Object.assign({}, user)
    const { data } = response.body

    newUser.password = undefined
    draftUser = newUser
    draftUser.id = data.createUser.user.id

    expect(data.createUser.jwt).toBeDefined()
    expect(data.createUser.user).toEqual(draftUser)
    expect(data.errors).toBeUndefined()

    draftUser.jwt = data.createUser.jwt
  })

  it('Successful updated user', async () => {
    const query = Object.assign({}, successfulUpdatedUser)
    query.variables = {
      input: {
        name: 'John Doe',
        lastName: 'User test 2',
        password: 'password@123'
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
    expect(data.updateUser).toBeDefined()
    expect(data.updateUser.name).toEqual(query.variables.input.name)
    expect(data.updateUser.lastName).toEqual(query.variables.input.lastName)
  })

  it('Updates user without authorization', async () => {
    const query = Object.assign({}, successfulUpdatedUser)
    query.variables = {
      input: {
        name: 'John test',
        lastName: 'User test test',
        password: 'password@password'
      }
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

  it('Updates user with invalid token', async () => {
    const query = Object.assign({}, successfulUpdatedUser)
    query.variables = {
      input: {
        name: 'John test',
        lastName: 'User test test',
        password: 'password@password'
      }
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

  it('Existing user', async () => {
    const query = Object.assign({}, successfulCreatedUser)
    query.variables = { ...user }

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { errors } = response.body

    expect(errors.length).toEqual(1)
    expect(errors[0].message).toEqual('Email already exists.')
  })

  it('Send invalid params', async () => {
    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .send(InvalidCreatedUser)

    const { errors } = response.body

    expect(errors).toBeDefined()
    expect(errors.length).toBeGreaterThan(0)
  })
})
