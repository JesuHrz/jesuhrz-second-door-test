import request from 'supertest'
import startApolloServer from '../server.js'
import db from '../db/index.js'
import config from '../config/index.js'

import {
  successfulCreatedUser,
  InvalidCreatedUser
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
