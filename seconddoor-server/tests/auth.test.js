import request from 'supertest'

import startApolloServer from '../server.js'
import db from '../db/index.js'
import config from '../config/index.js'
import {
  successAuthQuery,
  invalidAuthQuery
} from './utils/helpers.js'
import { user } from './utils/mocks.js'

describe('Authentication', () => {
  let server, url, User, draftUser

  beforeAll(async () => {
    ({ server, url } = await startApolloServer())
    ;({ User } = await db(config.db))
    draftUser = await User.create(user)
  })

  afterAll(async () => {
    await User.deleteBy({ id: draftUser.id })
    await server.close()
  })

  it('Successful authentication', async () => {
    const query = Object.assign({}, successAuthQuery)
    query.variables = {
      email: user.email,
      password: user.password
    }

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const { data } = response.body

    expect(data.errors).toBeUndefined()
    expect(data.auth.jwt).toBeDefined()
    expect(Object.keys(data.auth.user)).toEqual(['id', 'name', 'lastName', 'email'])
  })

  it('Failed authentication', async () => {
    const query = Object.assign({}, successAuthQuery)
    query.variables = {
      email: 'error@test.com',
      password: 'error-password'
    }

    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(200)
      .send(query)

    const data = response.body
    expect(data.errors).toBeDefined()
    expect(data.errors.length).toBeGreaterThan(0)
    expect(data.errors[0].message).toBe('Email or password is incorrect')
  })

  it('Send invalid query', async () => {
    const response = await request(url)
      .post('/')
      .expect('Content-Type', /application\/json/)
      .expect(400)
      .send(invalidAuthQuery)

    const data = response.body
    expect(data.errors).toBeDefined()
    expect(data.errors.length).toBeGreaterThan(0)
  })
})
