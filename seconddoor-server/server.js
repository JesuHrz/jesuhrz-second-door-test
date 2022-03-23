import http from 'http'
import express from 'express'
import expressJwt from 'express-jwt'
import cors from 'cors'
import { ApolloServer } from 'apollo-server-express'
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core'

import { typeDefs, resolvers } from './schema/index.js'

import db from './db/index.js'
import config from './config/index.js'
import { logger } from './utils/index.js'

const PORT = 3001

export default async function startApolloServer () {
  const app = express()
  const httpServer = http.createServer(app)
  const database = await db(config.db)

  app.use(cors({
    origin: '*'
  }))

  app.use(
    expressJwt({
      secret: config.auth.secret,
      algorithms: config.auth.algorithms,
      credentialsRequired: false
    })
  )

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, ...rest }) => {
      const user = req.user || null
      return {
        db: database,
        user
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageGraphQLPlayground()
    ]
  })

  await server.start()
  server.applyMiddleware({ app })

  const url = `http://localhost:${PORT}${server.graphqlPath}`

  httpServer.listen({ port: PORT }, (...aa) => {
    logger.info(`🚀 Server ready at ${url} 🚀 `)
  })

  return {
    server: httpServer,
    url
  }
}

process.on('uncaughtException', handleFatalError)
process.on('unhandledRejection', handleFatalError)

function handleFatalError (err) {
  logger.error('Error starting error:', err.message)
  process.exit(1)
}
