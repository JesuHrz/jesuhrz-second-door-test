import startApolloServer from '../server.js'
import { spawnSync } from 'child_process'
import path from 'path'

const serverDir = path.resolve('./index.js')

describe('Task', () => {
  let server, url

  beforeAll(async () => {
    ({ server, url } = await startApolloServer())
  })

  afterAll(async () => {
    await server.close()
  })

  it('Successful to starting server', () => {
    expect(server).toBeDefined()
    expect(url).toBeDefined()
  })

  it('Failed to starting server', () => {
    const server = spawnSync('node', [serverDir])
    const { status, stdout } = server
    expect(status).toBe(1)
    expect(stdout.toString()).toMatch(/Error starting error:/)
  })
})
