import { AuthenticationError } from 'apollo-server-express'
import { skip as next } from 'graphql-resolvers'

export const isAuthenticated = (_, __, { user }) => {
  if (!user) {
    throw new AuthenticationError('Unauthorized')
  }

  return next
}
